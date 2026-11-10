import { describe, expect, it } from 'vitest';
import { endOfIsoWeek, endOfMonth, startOfIsoWeek } from './dates.ts';
import {
	computeProjectItems,
	computeTreeCareItems,
	groupForDashboard,
	windowForYear,
	type CareItem,
	type ScheduleIntervention,
	type ScheduleRule,
	type ScheduleTree
} from './schedule.ts';

const tree = (overrides: Partial<ScheduleTree> = {}): ScheduleTree => ({
	id: 1,
	name: 'Pommier',
	status: 'planted',
	plantingDate: '2023-03-15',
	...overrides
});

let nextRuleId = 1;
const rule = (overrides: Partial<ScheduleRule> = {}): ScheduleRule => ({
	id: nextRuleId++,
	type: 'pruning_winter',
	label: 'Taille',
	startMonth: 2,
	startDay: 15,
	endMonth: 3,
	endDay: 31,
	intervalDays: null,
	minAgeYears: null,
	maxAgeYears: null,
	verified: false,
	...overrides
});

const run = (
	today: string,
	r: ScheduleRule | ScheduleRule[],
	interventions: ScheduleIntervention[] = [],
	t: ScheduleTree = tree(),
	horizon = '2099-12-31'
) => computeTreeCareItems(t, Array.isArray(r) ? r : [r], interventions, { today, horizon });

/** The single item whose window contains or is closest to today. */
const statuses = (items: CareItem[]) => items.map((i) => `${i.windowStart}:${i.status}`);

describe('windowForYear', () => {
	it('builds a simple window', () => {
		expect(windowForYear(rule(), 2026)).toEqual({ start: '2026-02-15', end: '2026-03-31' });
	});

	it('handles a window that crosses the new year', () => {
		const r = rule({ startMonth: 12, startDay: 1, endMonth: 2, endDay: 28 });
		expect(windowForYear(r, 2026)).toEqual({ start: '2026-12-01', end: '2027-02-28' });
	});

	it('clamps Feb 29 in common years', () => {
		const r = rule({ startMonth: 2, startDay: 29, endMonth: 2, endDay: 29 });
		expect(windowForYear(r, 2027)).toEqual({ start: '2027-02-28', end: '2027-02-28' });
		expect(windowForYear(r, 2028)).toEqual({ start: '2028-02-29', end: '2028-02-29' });
	});
});

describe('computeTreeCareItems — once rules', () => {
	const r = rule();

	it('gives nothing for a tree that is not planted', () => {
		expect(run('2026-03-01', r, [], tree({ status: 'purchased' }))).toEqual([]);
		expect(run('2026-03-01', r, [], tree({ status: 'dead' }))).toEqual([]);
	});

	it('is upcoming before the window, due inside it', () => {
		expect(statuses(run('2026-01-10', r))).toEqual(['2026-02-15:upcoming', '2027-02-15:upcoming']);
		const due = run('2026-03-01', r).find((i) => i.status === 'due');
		expect(due).toMatchObject({ windowStart: '2026-02-15', dueDate: '2026-03-31' });
	});

	it('is overdue after the window, then dropped after the overdue period', () => {
		expect(run('2026-04-10', r).find((i) => i.windowStart === '2026-02-15')?.status).toBe(
			'overdue'
		);
		expect(run('2026-06-15', r).find((i) => i.windowStart === '2026-02-15')).toBeUndefined();
	});

	it('is done when an intervention of the same type is dated inside the window', () => {
		const items = run('2026-04-10', r, [{ date: '2026-03-02', type: 'pruning', careRuleId: null }]);
		expect(items.find((i) => i.windowStart === '2026-02-15')).toMatchObject({
			status: 'done',
			doneDate: '2026-03-02'
		});
	});

	it('ignores an unlinked intervention outside the window or of another type', () => {
		const items = run('2026-04-10', r, [
			{ date: '2026-04-05', type: 'pruning', careRuleId: null },
			{ date: '2026-03-01', type: 'watering', careRuleId: null }
		]);
		expect(items.find((i) => i.windowStart === '2026-02-15')?.status).toBe('overdue');
	});

	it('accepts a late intervention linked to the rule (« Fait » on an overdue item)', () => {
		const items = run('2026-04-12', r, [{ date: '2026-04-10', type: 'pruning', careRuleId: r.id }]);
		expect(items.find((i) => i.windowStart === '2026-02-15')?.status).toBe('done');
	});

	it('does not let an intervention linked to another rule count', () => {
		const items = run('2026-03-01', r, [{ date: '2026-02-20', type: 'pruning', careRuleId: 999 }]);
		expect(items.find((i) => i.windowStart === '2026-02-15')?.status).toBe('due');
	});

	it('handles windows crossing the new year', () => {
		const winter = rule({ startMonth: 12, startDay: 1, endMonth: 2, endDay: 28 });
		const due = run('2027-01-10', winter).find((i) => i.status === 'due');
		expect(due).toMatchObject({ windowStart: '2026-12-01', dueDate: '2027-02-28' });
	});

	it('respects the horizon for upcoming items', () => {
		const items = computeTreeCareItems(tree(), [r], [], {
			today: '2026-01-10',
			horizon: '2026-01-31'
		});
		expect(items).toEqual([]);
	});
});

describe('computeTreeCareItems — planting date and age', () => {
	it('ignores windows that end before planting and starts at the planting date', () => {
		const t = tree({ plantingDate: '2026-03-10' });
		const items = run('2026-03-12', rule(), [], t);
		expect(items.find((i) => i.status === 'due')).toMatchObject({ windowStart: '2026-03-10' });
		expect(run('2026-03-12', rule(), [], tree({ plantingDate: '2026-04-15' }))).toEqual([
			expect.objectContaining({ windowStart: '2027-02-15', status: 'upcoming' })
		]);
	});

	it('applies maxAgeYears as an exclusive bound (« les 3 premières années »)', () => {
		const young = rule({ maxAgeYears: 3, startMonth: 5, startDay: 15, endMonth: 9, endDay: 15 });
		// Planted 2023-03-15: age 2 on 2025-05-15, age 3 on 2026-05-15.
		expect(run('2025-06-01', young).map((i) => i.windowStart)).toContain('2025-05-15');
		expect(run('2026-06-01', young)).toEqual([]);
	});

	it('applies minAgeYears as an inclusive bound', () => {
		const adult = rule({ minAgeYears: 3 });
		// Age 2 on 2026-02-15 (planted 2023-03-15), age 3 on 2027-02-15.
		expect(run('2026-03-01', adult).map((i) => i.windowStart)).toEqual(['2027-02-15']);
	});

	it('skips age-restricted rules when the planting date is unknown', () => {
		const t = tree({ plantingDate: null });
		expect(run('2026-03-01', rule({ maxAgeYears: 3 }), [], t)).toEqual([]);
		expect(run('2026-03-01', rule(), [], t).some((i) => i.status === 'due')).toBe(true);
	});

	it('gives a tree planted this winter its first summer watering', () => {
		const watering = rule({
			type: 'watering',
			startMonth: 5,
			startDay: 15,
			endMonth: 9,
			endDay: 15,
			intervalDays: 10,
			maxAgeYears: 3
		});
		const items = run(
			'2027-05-20',
			watering,
			[],
			tree({ plantingDate: '2026-11-20' }),
			'2027-12-31'
		);
		expect(items).toEqual([expect.objectContaining({ status: 'overdue', dueDate: '2027-05-15' })]);
	});
});

describe('computeTreeCareItems — interval rules', () => {
	const watering = rule({
		type: 'watering',
		label: 'Arrosage',
		startMonth: 5,
		startDay: 15,
		endMonth: 9,
		endDay: 15,
		intervalDays: 10
	});
	const watered = (date: string): ScheduleIntervention => ({
		date,
		type: 'watering',
		careRuleId: null
	});

	it('is due on the window start when nothing was done', () => {
		expect(run('2026-05-15', watering, [], tree(), '2026-12-31')).toEqual([
			expect.objectContaining({ status: 'due', dueDate: '2026-05-15' })
		]);
	});

	it('schedules the next watering from the last one', () => {
		const [item] = run('2026-06-05', watering, [watered('2026-05-20'), watered('2026-06-01')]);
		expect(item).toMatchObject({
			status: 'upcoming',
			dueDate: '2026-06-11',
			doneDate: '2026-06-01'
		});
	});

	it('is overdue when the interval has passed', () => {
		const [item] = run('2026-06-20', watering, [watered('2026-06-01')]);
		expect(item).toMatchObject({ status: 'overdue', dueDate: '2026-06-11' });
	});

	it('counts a watering done just before the window opens', () => {
		const [item] = run('2026-05-16', watering, [watered('2026-05-12')]);
		expect(item).toMatchObject({ status: 'upcoming', dueDate: '2026-05-22' });
	});

	it('is done for the season when the next date falls after the window', () => {
		const [item] = run('2026-09-10', watering, [watered('2026-09-08')]);
		expect(item).toMatchObject({ status: 'done' });
	});

	it('disappears once the window is closed and announces next season', () => {
		expect(run('2026-10-01', watering)).toEqual([
			expect.objectContaining({ status: 'upcoming', dueDate: '2027-05-15' })
		]);
	});
});

describe('computeProjectItems', () => {
	const projects = [
		{ id: 1, title: 'Abri', status: 'in_progress' as const, plannedEnd: '2026-11-30' },
		{ id: 2, title: 'Pétanque', status: 'done' as const, plannedEnd: '2025-09-01' }
	];
	const tasks = [
		{ id: 10, projectId: 1, label: 'Toiture', done: false, dueDate: '2026-11-05' },
		{ id: 11, projectId: 1, label: 'Porte', done: true, dueDate: '2026-11-01' },
		{ id: 12, projectId: 1, label: 'Peinture', done: false, dueDate: null },
		{ id: 13, projectId: 2, label: 'Bordures', done: false, dueDate: '2025-08-01' }
	];

	it('keeps unfinished dated tasks of open projects and planned ends', () => {
		const items = computeProjectItems(projects, tasks, {
			today: '2026-11-10',
			horizon: '2026-12-31'
		});
		expect(items.map((i) => [i.key, i.status])).toEqual([
			['task:10', 'overdue'],
			['project:1', 'upcoming']
		]);
	});
});

describe('groupForDashboard', () => {
	it('splits items into overdue, this week and this month', () => {
		const today = '2026-11-10'; // Tuesday
		const r1 = rule({ startMonth: 10, startDay: 15, endMonth: 11, endDay: 30, label: 'Cuivre' });
		const r2 = rule({ startMonth: 11, startDay: 13, endMonth: 12, endDay: 15, label: 'Paillage' });
		const r3 = rule({ startMonth: 11, startDay: 20, endMonth: 12, endDay: 15, label: 'Compost' });
		const r4 = rule({ startMonth: 9, startDay: 1, endMonth: 10, endDay: 31, label: 'Récolte' });
		const r5 = rule({ startMonth: 12, startDay: 5, endMonth: 12, endDay: 20, label: 'Hiver' });
		const items = run(today, [r1, r2, r3, r4, r5]);
		expect(startOfIsoWeek(today)).toBe('2026-11-09');
		const groups = groupForDashboard(items, endOfIsoWeek(today), endOfMonth(today));
		expect(groups.overdue.map((i) => i.label)).toEqual(['Récolte']);
		expect(groups.thisWeek.map((i) => i.label)).toEqual(['Cuivre', 'Paillage']);
		expect(groups.thisMonth.map((i) => i.label)).toEqual(['Compost']);
	});
});
