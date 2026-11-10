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

import {
	addDays,
	clampedDate,
	diffDays,
	fullYearsBetween,
	maxDate,
	parseIsoDate
} from './dates.ts';
import type { CareRuleType, InterventionType, ProjectStatus, TreeStatus } from './enums.ts';
import { CARE_RULE_TO_INTERVENTION } from './enums.ts';

export type DueStatus = 'overdue' | 'due' | 'upcoming' | 'done';

export interface ScheduleTree {
	id: number;
	name: string;
	status: TreeStatus;
	plantingDate: string | null;
}

export interface ScheduleRule {
	id: number;
	type: CareRuleType;
	label: string;
	startMonth: number;
	startDay: number;
	endMonth: number;
	endDay: number;
	intervalDays: number | null;
	minAgeYears: number | null;
	maxAgeYears: number | null;
	verified: boolean;
}

export interface ScheduleIntervention {
	date: string;
	type: InterventionType;
	careRuleId: number | null;
}

export interface CareItem {
	kind: 'care';
	/** Stable identifier of the occurrence. */
	key: string;
	status: DueStatus;
	/** Deadline for once rules (window end), due date for interval rules. */
	dueDate: string;
	windowStart: string;
	windowEnd: string;
	treeId: number;
	treeName: string;
	ruleId: number;
	label: string;
	ruleType: CareRuleType;
	interventionType: InterventionType;
	intervalDays: number | null;
	verified: boolean;
	/** Date of the fulfilling intervention (status 'done'). */
	doneDate: string | null;
}

export interface ScheduleProject {
	id: number;
	title: string;
	status: ProjectStatus;
	plannedEnd: string | null;
}

export interface ScheduleTask {
	id: number;
	projectId: number;
	label: string;
	done: boolean;
	dueDate: string | null;
}

export interface ProjectItem {
	kind: 'project_task' | 'project_end';
	key: string;
	status: Exclude<DueStatus, 'done'>;
	dueDate: string;
	projectId: number;
	projectTitle: string;
	taskId: number | null;
	label: string;
}

export type DueItem = CareItem | ProjectItem;

export interface ScheduleOptions {
	/** Reference day (ISO). */
	today: string;
	/** Upcoming items are kept when they start on or before this day. */
	horizon: string;
	/** Days an unfulfilled closed window stays overdue. */
	overdueDays?: number;
}

const DEFAULT_OVERDUE_DAYS = 60;

interface Window {
	start: string;
	end: string;
}

/** The occurrence of a rule's window that starts in `year`. */
export function windowForYear(rule: ScheduleRule, year: number): Window {
	const start = clampedDate(year, rule.startMonth, rule.startDay);
	const crossesYear =
		rule.endMonth < rule.startMonth ||
		(rule.endMonth === rule.startMonth && rule.endDay < rule.startDay);
	const end = clampedDate(crossesYear ? year + 1 : year, rule.endMonth, rule.endDay);
	return { start, end };
}

function ageAllows(rule: ScheduleRule, tree: ScheduleTree, onDate: string): boolean {
	if (rule.minAgeYears == null && rule.maxAgeYears == null) return true;
	if (!tree.plantingDate) return false;
	const age = Math.max(0, fullYearsBetween(tree.plantingDate, onDate));
	if (rule.minAgeYears != null && age < rule.minAgeYears) return false;
	if (rule.maxAgeYears != null && age >= rule.maxAgeYears) return false;
	return true;
}

const fulfils = (i: ScheduleIntervention, rule: ScheduleRule) =>
	i.careRuleId === rule.id ||
	(i.careRuleId == null && i.type === CARE_RULE_TO_INTERVENTION[rule.type]);

/**
 * Care items of one tree for the given effective rules. Returns at most one
 * item per rule occurrence (several occurrences may be returned per rule).
 */
export function computeTreeCareItems(
	tree: ScheduleTree,
	rules: readonly ScheduleRule[],
	interventions: readonly ScheduleIntervention[],
	options: ScheduleOptions
): CareItem[] {
	if (tree.status !== 'planted') return [];
	const { today, horizon } = options;
	const overdueDays = options.overdueDays ?? DEFAULT_OVERDUE_DAYS;
	const year = parseIsoDate(today).year;
	const items: CareItem[] = [];

	for (const rule of rules) {
		const matching = interventions.filter((i) => fulfils(i, rule));

		for (const y of [year - 1, year, year + 1]) {
			const window = windowForYear(rule, y);
			if (tree.plantingDate && window.end < tree.plantingDate) continue;
			const start = tree.plantingDate ? maxDate(window.start, tree.plantingDate) : window.start;
			if (!ageAllows(rule, tree, start)) continue;

			const base = {
				kind: 'care' as const,
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

			const item = rule.intervalDays
				? intervalItem(base, rule.intervalDays, matching, today)
				: onceItem(base, rule, matching, today, overdueDays);
			if (!item) continue;
			if (item.status === 'upcoming' && item.windowStart > horizon) continue;
			if (item.status === 'upcoming' && rule.intervalDays && item.dueDate > horizon) continue;
			items.push(item);
		}
	}
	return items;
}

type Base = Omit<CareItem, 'status' | 'dueDate' | 'doneDate'>;

function onceItem(
	base: Base,
	rule: ScheduleRule,
	matching: readonly ScheduleIntervention[],
	today: string,
	overdueDays: number
): CareItem | null {
	const overdueUntil = addDays(base.windowEnd, overdueDays);
	const done = matching
		.filter((i) =>
			i.careRuleId === rule.id
				? i.date >= base.windowStart && i.date <= overdueUntil
				: i.date >= base.windowStart && i.date <= base.windowEnd
		)
		.sort((a, b) => (a.date < b.date ? -1 : 1))[0];

	const dueDate = base.windowEnd;
	if (done) return { ...base, status: 'done', dueDate, doneDate: done.date };
	if (today < base.windowStart) return { ...base, status: 'upcoming', dueDate, doneDate: null };
	if (today <= base.windowEnd) return { ...base, status: 'due', dueDate, doneDate: null };
	if (today <= overdueUntil) return { ...base, status: 'overdue', dueDate, doneDate: null };
	return null;
}

function intervalItem(
	base: Base,
	interval: number,
	matching: readonly ScheduleIntervention[],
	today: string
): CareItem | null {
	if (today > base.windowEnd) return null;
	// Interventions up to `interval` days before the window still count.
	const earliest = addDays(base.windowStart, -interval);
	const last = matching
		.filter((i) => i.date >= earliest && i.date <= today && i.date <= base.windowEnd)
		.map((i) => i.date)
		.sort()
		.at(-1);

	const next = last ? maxDate(addDays(last, interval), base.windowStart) : base.windowStart;
	if (next > base.windowEnd) {
		return { ...base, status: 'done', dueDate: base.windowEnd, doneDate: last ?? null };
	}
	const status: DueStatus = next < today ? 'overdue' : next === today ? 'due' : 'upcoming';
	return { ...base, status, dueDate: next, doneDate: last ?? null };
}

/** Unfinished project tasks with a due date, and planned ends of open projects. */
export function computeProjectItems(
	projects: readonly ScheduleProject[],
	tasks: readonly ScheduleTask[],
	options: ScheduleOptions
): ProjectItem[] {
	const { today, horizon } = options;
	const statusOf = (date: string): ProjectItem['status'] =>
		date < today ? 'overdue' : date === today ? 'due' : 'upcoming';
	const byId = new Map(projects.map((p) => [p.id, p]));
	const items: ProjectItem[] = [];

	for (const task of tasks) {
		const project = byId.get(task.projectId);
		if (!project || project.status === 'done' || task.done || !task.dueDate) continue;
		if (task.dueDate > horizon) continue;
		items.push({
			kind: 'project_task',
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
		if (project.status === 'done' || !project.plannedEnd || project.plannedEnd > horizon) continue;
		items.push({
			kind: 'project_end',
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
export const startDate = (item: DueItem) =>
	item.kind === 'care' && !item.intervalDays && item.status === 'upcoming'
		? item.windowStart
		: item.dueDate;

export interface DashboardGroups {
	overdue: DueItem[];
	thisWeek: DueItem[];
	thisMonth: DueItem[];
}

/**
 * Group open items for the dashboard:
 * - overdue;
 * - this week: windows open now, and items starting before the end of the week;
 * - this month: items starting after this week and before the end of the month.
 */
export function groupForDashboard(
	items: readonly DueItem[],
	weekEnd: string,
	monthEnd: string
): DashboardGroups {
	const groups: DashboardGroups = { overdue: [], thisWeek: [], thisMonth: [] };
	const sorted = [...items].sort(
		(a, b) =>
			(startDate(a) < startDate(b) ? -1 : startDate(a) > startDate(b) ? 1 : 0) ||
			a.dueDate.localeCompare(b.dueDate)
	);
	for (const item of sorted) {
		if (item.status === 'done') continue;
		if (item.status === 'overdue') groups.overdue.push(item);
		else if (item.status === 'due' || startDate(item) <= weekEnd) groups.thisWeek.push(item);
		else if (startDate(item) <= monthEnd) groups.thisMonth.push(item);
	}
	// Open windows: the closest deadline first.
	groups.thisWeek.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
	groups.overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
	return groups;
}

/** Days between today and the item's due date (negative when late). */
export const daysLeft = (item: DueItem, today: string) => diffDays(today, item.dueDate);
