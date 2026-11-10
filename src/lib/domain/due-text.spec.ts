import { describe, expect, it } from 'vitest';
import { dueText } from './due-text.ts';
import type { CareItem } from './schedule.ts';

const item = (overrides: Partial<CareItem>): CareItem => ({
	kind: 'care',
	key: 'k',
	status: 'due',
	dueDate: '2026-11-30',
	windowStart: '2026-10-15',
	windowEnd: '2026-11-30',
	treeId: 1,
	treeName: 'Pommier',
	ruleId: 1,
	label: 'Cuivre',
	ruleType: 'treatment',
	interventionType: 'treatment',
	intervalDays: null,
	verified: false,
	doneDate: null,
	...overrides
});

describe('dueText', () => {
	const today = '2026-11-10';
	it('describes windows', () => {
		expect(dueText(item({}), today)).toBe("À faire d'ici le lun. 30 nov. (20 j)");
		expect(dueText(item({ status: 'upcoming', windowStart: '2026-12-01' }), today)).toBe(
			'À partir du mar. 1er déc.'
		);
		expect(dueText(item({ status: 'upcoming', windowStart: '2027-02-15' }), today)).toBe(
			'À partir du lun. 15 févr. 2027'
		);
		expect(dueText(item({ status: 'overdue', dueDate: '2026-10-31' }), today)).toBe(
			'En retard : période finie le sam. 31 oct.'
		);
	});
	it('describes interval items', () => {
		expect(
			dueText(item({ intervalDays: 10, status: 'overdue', dueDate: '2026-11-07' }), today)
		).toBe('En retard de 3 jours');
		expect(
			dueText(item({ intervalDays: 10, status: 'upcoming', dueDate: '2026-11-11' }), today)
		).toBe('Demain');
	});
});
