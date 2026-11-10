import { g as effectiveRules, i as displayName } from "./trees.js";
import { d as fullYearsBetween, h as todayIso, m as parseIsoDate, n as addDays, p as maxDate, r as clampedDate } from "./dates.js";
import { t as CARE_RULE_TO_INTERVENTION } from "./enums.js";
import { d as tree, i as intervention, n as db, o as project, r as careRule, s as projectTask } from "./db.js";
import { eq, gte, inArray, isNotNull } from "drizzle-orm";
// src/lib/domain/schedule.ts
/**
* Due-date engine: turns care rules, trees, the intervention journal and
* project tasks into dated to-do items. Pure functions, no I/O.
*
* Care rules
* - A rule defines a yearly window [start, end] (the end may fall in the next
*   year, e.g. 1 Dec → 28 Feb). Feb 29 is clamped to Feb 28 in common years.
* - Only planted trees get care items. A window that ends before the planting
*   date is ignored; one that starts before it begins on the planting date.
* - Age (full years since planting, at the start of the occurrence) must be
*   >= minAgeYears and < maxAgeYears. Trees without planting date only get
*   rules without age condition.
* - "Once" rules (no interval): done when an intervention fulfils the window
*   (same intervention type dated inside the window, or linked to the rule and
*   dated from the window start up to the end of the overdue period).
*   Otherwise upcoming → due (window open) → overdue (window closed, for
*   `overdueDays` days, then dropped).
* - Interval rules (e.g. watering every 10 days): inside the window only, the
*   next due date is the last fulfilling intervention + interval (or the
*   window start). Overdue while the window is open, dropped after it.
*
* Project items: unfinished tasks with a due date and unfinished projects
* with a planned end date.
*/
var DEFAULT_OVERDUE_DAYS = 60;
/** The occurrence of a rule's window that starts in `year`. */
function windowForYear(rule, year) {
	const start = clampedDate(year, rule.startMonth, rule.startDay);
	const crossesYear = rule.endMonth < rule.startMonth || rule.endMonth === rule.startMonth && rule.endDay < rule.startDay;
	return {
		start,
		end: clampedDate(crossesYear ? year + 1 : year, rule.endMonth, rule.endDay)
	};
}
function ageAllows(rule, tree, onDate) {
	if (rule.minAgeYears == null && rule.maxAgeYears == null) return true;
	if (!tree.plantingDate) return false;
	const age = Math.max(0, fullYearsBetween(tree.plantingDate, onDate));
	if (rule.minAgeYears != null && age < rule.minAgeYears) return false;
	if (rule.maxAgeYears != null && age >= rule.maxAgeYears) return false;
	return true;
}
var fulfils = (i, rule) => i.careRuleId === rule.id || i.careRuleId == null && i.type === CARE_RULE_TO_INTERVENTION[rule.type];
/**
* Care items of one tree for the given effective rules. Returns at most one
* item per rule occurrence (several occurrences may be returned per rule).
*/
function computeTreeCareItems(tree, rules, interventions, options) {
	if (tree.status !== "planted") return [];
	const { today, horizon } = options;
	const overdueDays = options.overdueDays ?? DEFAULT_OVERDUE_DAYS;
	const year = parseIsoDate(today).year;
	const items = [];
	for (const rule of rules) {
		const matching = interventions.filter((i) => fulfils(i, rule));
		for (const y of [
			year - 1,
			year,
			year + 1
		]) {
			const window = windowForYear(rule, y);
			if (tree.plantingDate && window.end < tree.plantingDate) continue;
			const start = tree.plantingDate ? maxDate(window.start, tree.plantingDate) : window.start;
			if (!ageAllows(rule, tree, start)) continue;
			const base = {
				kind: "care",
				key: `care:${tree.id}:${rule.id}:${window.start}`,
				windowStart: start,
				windowEnd: window.end,
				treeId: tree.id,
				treeName: tree.name,
				ruleId: rule.id,
				label: rule.label,
				ruleType: rule.type,
				interventionType: CARE_RULE_TO_INTERVENTION[rule.type],
				intervalDays: rule.intervalDays,
				verified: rule.verified
			};
			const item = rule.intervalDays ? intervalItem(base, rule.intervalDays, matching, today) : onceItem(base, rule, matching, today, overdueDays);
			if (!item) continue;
			if (item.status === "upcoming" && item.windowStart > horizon) continue;
			if (item.status === "upcoming" && rule.intervalDays && item.dueDate > horizon) continue;
			items.push(item);
		}
	}
	return items;
}
function onceItem(base, rule, matching, today, overdueDays) {
	const overdueUntil = addDays(base.windowEnd, overdueDays);
	const done = matching.filter((i) => i.careRuleId === rule.id ? i.date >= base.windowStart && i.date <= overdueUntil : i.date >= base.windowStart && i.date <= base.windowEnd).sort((a, b) => a.date < b.date ? -1 : 1)[0];
	const dueDate = base.windowEnd;
	if (done) return {
		...base,
		status: "done",
		dueDate,
		doneDate: done.date
	};
	if (today < base.windowStart) return {
		...base,
		status: "upcoming",
		dueDate,
		doneDate: null
	};
	if (today <= base.windowEnd) return {
		...base,
		status: "due",
		dueDate,
		doneDate: null
	};
	if (today <= overdueUntil) return {
		...base,
		status: "overdue",
		dueDate,
		doneDate: null
	};
	return null;
}
function intervalItem(base, interval, matching, today) {
	if (today > base.windowEnd) return null;
	const earliest = addDays(base.windowStart, -interval);
	const last = matching.filter((i) => i.date >= earliest && i.date <= today && i.date <= base.windowEnd).map((i) => i.date).sort().at(-1);
	const next = last ? maxDate(addDays(last, interval), base.windowStart) : base.windowStart;
	if (next > base.windowEnd) return {
		...base,
		status: "done",
		dueDate: base.windowEnd,
		doneDate: last ?? null
	};
	const status = next < today ? "overdue" : next === today ? "due" : "upcoming";
	return {
		...base,
		status,
		dueDate: next,
		doneDate: last ?? null
	};
}
/** Unfinished project tasks with a due date, and planned ends of open projects. */
function computeProjectItems(projects, tasks, options) {
	const { today, horizon } = options;
	const statusOf = (date) => date < today ? "overdue" : date === today ? "due" : "upcoming";
	const byId = new Map(projects.map((p) => [p.id, p]));
	const items = [];
	for (const task of tasks) {
		const project = byId.get(task.projectId);
		if (!project || project.status === "done" || task.done || !task.dueDate) continue;
		if (task.dueDate > horizon) continue;
		items.push({
			kind: "project_task",
			key: `task:${task.id}`,
			status: statusOf(task.dueDate),
			dueDate: task.dueDate,
			projectId: project.id,
			projectTitle: project.title,
			taskId: task.id,
			label: task.label
		});
	}
	for (const project of projects) {
		if (project.status === "done" || !project.plannedEnd || project.plannedEnd > horizon) continue;
		items.push({
			kind: "project_end",
			key: `project:${project.id}`,
			status: statusOf(project.plannedEnd),
			dueDate: project.plannedEnd,
			projectId: project.id,
			projectTitle: project.title,
			taskId: null,
			label: `Fin prévue : ${project.title}`
		});
	}
	return items;
}
/** Date an item becomes actionable (used to sort and group). */
var startDate = (item) => item.kind === "care" && !item.intervalDays && item.status === "upcoming" ? item.windowStart : item.dueDate;
/**
* Group open items for the dashboard:
* - overdue;
* - this week: windows open now, and items starting before the end of the week;
* - this month: items starting after this week and before the end of the month.
*/
function groupForDashboard(items, weekEnd, monthEnd) {
	const groups = {
		overdue: [],
		thisWeek: [],
		thisMonth: []
	};
	const sorted = [...items].sort((a, b) => (startDate(a) < startDate(b) ? -1 : startDate(a) > startDate(b) ? 1 : 0) || a.dueDate.localeCompare(b.dueDate));
	for (const item of sorted) {
		if (item.status === "done") continue;
		if (item.status === "overdue") groups.overdue.push(item);
		else if (item.status === "due" || startDate(item) <= weekEnd) groups.thisWeek.push(item);
		else if (startDate(item) <= monthEnd) groups.thisMonth.push(item);
	}
	groups.thisWeek.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
	groups.overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
	return groups;
}
// src/lib/server/schedule.ts
function loadRules(templateIds, treeIds) {
	const templateRules = templateIds.length ? db.select().from(careRule).where(inArray(careRule.speciesTemplateId, templateIds)).all() : [];
	const treeRules = treeIds.length ? db.select().from(careRule).where(inArray(careRule.treeId, treeIds)).all() : [];
	const group = (rules, key) => {
		const map = /* @__PURE__ */ new Map();
		for (const r of rules) {
			const id = r[key];
			if (id == null) continue;
			map.set(id, [...map.get(id) ?? [], r]);
		}
		return map;
	};
	return {
		byTemplate: group(templateRules, "speciesTemplateId"),
		byTree: group(treeRules, "treeId")
	};
}
/** Care items of the given planted trees (all planted trees when omitted). */
function careItems(options, treeIds) {
	const trees = db.select().from(tree).where(treeIds ? inArray(tree.id, treeIds) : eq(tree.status, "planted")).all().filter((t) => t.status === "planted");
	if (!trees.length) return [];
	const ids = trees.map((t) => t.id);
	const { byTemplate, byTree } = loadRules([...new Set(trees.map((t) => t.speciesTemplateId).filter((id) => id != null))], ids);
	const since = addDays(options.today, -500);
	const history = db.select({
		treeId: intervention.treeId,
		date: intervention.date,
		type: intervention.type,
		careRuleId: intervention.careRuleId
	}).from(intervention).where(gte(intervention.date, since)).all().filter((i) => ids.includes(i.treeId));
	return trees.flatMap((t) => computeTreeCareItems({
		id: t.id,
		name: displayName(t),
		status: t.status,
		plantingDate: t.plantingDate
	}, effectiveRules(t.speciesTemplateId ? byTemplate.get(t.speciesTemplateId) ?? [] : [], byTree.get(t.id) ?? []), history.filter((i) => i.treeId === t.id), options));
}
function projectItems(options) {
	return computeProjectItems(db.select().from(project).all(), db.select().from(projectTask).where(isNotNull(projectTask.dueDate)).all(), options);
}
/** Every open item up to the horizon (care + projects). */
function allDueItems(options) {
	return [...careItems(options), ...projectItems(options)];
}
/**
* The most relevant occurrence of each rule of a tree, for its calendar:
* overdue, then due, then the next upcoming, then the last done.
*/
function currentItemByRule(treeId, today = todayIso()) {
	const items = careItems({
		today,
		horizon: addDays(today, 400)
	}, [treeId]);
	const rank = {
		overdue: 0,
		due: 1,
		upcoming: 2,
		done: 3
	};
	const best = /* @__PURE__ */ new Map();
	for (const item of items) {
		const current = best.get(item.ruleId);
		if (!current || rank[item.status] < rank[current.status] || item.status === current.status && (item.status === "done" ? item.windowStart > current.windowStart : item.dueDate < current.dueDate)) best.set(item.ruleId, item);
	}
	return best;
}
export { currentItemByRule as n, groupForDashboard as r, allDueItems as t };

//# sourceMappingURL=schedule.js.map