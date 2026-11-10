import { eq, gte, inArray, isNotNull } from 'drizzle-orm';
import { effectiveRules } from '../domain/care-rules.ts';
import { addDays, todayIso } from '../domain/dates.ts';
import {
	computeProjectItems,
	computeTreeCareItems,
	type CareItem,
	type DueItem,
	type ScheduleOptions
} from '../domain/schedule.ts';
import { db } from './db/index.ts';
import { careRule, intervention, project, projectTask, tree, type CareRule } from './db/schema.ts';
import { displayName } from './trees.ts';

/** Interventions older than this cannot affect any open item. */
const HISTORY_DAYS = 500;

function loadRules(templateIds: number[], treeIds: number[]) {
	const templateRules = templateIds.length
		? db.select().from(careRule).where(inArray(careRule.speciesTemplateId, templateIds)).all()
		: [];
	const treeRules = treeIds.length
		? db.select().from(careRule).where(inArray(careRule.treeId, treeIds)).all()
		: [];
	const group = (rules: CareRule[], key: 'speciesTemplateId' | 'treeId') => {
		const map = new Map<number, CareRule[]>();
		for (const r of rules) {
			const id = r[key];
			if (id == null) continue;
			map.set(id, [...(map.get(id) ?? []), r]);
		}
		return map;
	};
	return {
		byTemplate: group(templateRules, 'speciesTemplateId'),
		byTree: group(treeRules, 'treeId')
	};
}

/** Care items of the given planted trees (all planted trees when omitted). */
export function careItems(options: ScheduleOptions, treeIds?: number[]): CareItem[] {
	const trees = db
		.select()
		.from(tree)
		.where(treeIds ? inArray(tree.id, treeIds) : eq(tree.status, 'planted'))
		.all()
		.filter((t) => t.status === 'planted');
	if (!trees.length) return [];

	const ids = trees.map((t) => t.id);
	const templateIds = [
		...new Set(trees.map((t) => t.speciesTemplateId).filter((id) => id != null))
	];
	const { byTemplate, byTree } = loadRules(templateIds, ids);

	const since = addDays(options.today, -HISTORY_DAYS);
	const history = db
		.select({
			treeId: intervention.treeId,
			date: intervention.date,
			type: intervention.type,
			careRuleId: intervention.careRuleId
		})
		.from(intervention)
		.where(gte(intervention.date, since))
		.all()
		.filter((i) => ids.includes(i.treeId));

	return trees.flatMap((t) =>
		computeTreeCareItems(
			{ id: t.id, name: displayName(t), status: t.status, plantingDate: t.plantingDate },
			effectiveRules(
				t.speciesTemplateId ? (byTemplate.get(t.speciesTemplateId) ?? []) : [],
				byTree.get(t.id) ?? []
			),
			history.filter((i) => i.treeId === t.id),
			options
		)
	);
}

export function projectItems(options: ScheduleOptions) {
	const projects = db.select().from(project).all();
	const tasks = db.select().from(projectTask).where(isNotNull(projectTask.dueDate)).all();
	return computeProjectItems(projects, tasks, options);
}

/** Every open item up to the horizon (care + projects). */
export function allDueItems(options: ScheduleOptions): DueItem[] {
	return [...careItems(options), ...projectItems(options)];
}

/**
 * The most relevant occurrence of each rule of a tree, for its calendar:
 * overdue, then due, then the next upcoming, then the last done.
 */
export function currentItemByRule(treeId: number, today = todayIso()): Map<number, CareItem> {
	const items = careItems({ today, horizon: addDays(today, 400) }, [treeId]);
	const rank = { overdue: 0, due: 1, upcoming: 2, done: 3 } as const;
	const best = new Map<number, CareItem>();
	for (const item of items) {
		const current = best.get(item.ruleId);
		if (
			!current ||
			rank[item.status] < rank[current.status] ||
			(item.status === current.status &&
				(item.status === 'done'
					? item.windowStart > current.windowStart
					: item.dueDate < current.dueDate))
		) {
			best.set(item.ruleId, item);
		}
	}
	return best;
}
