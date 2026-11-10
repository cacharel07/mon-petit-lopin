import { describe, expect, it } from 'vitest';
import {
	centsToInput,
	datesForStatus,
	formatEuros,
	parseEuros,
	projectProgress
} from './projects.ts';

describe('projectProgress', () => {
	it('uses the checklist', () => {
		expect(projectProgress([{ done: true }, { done: false }, { done: false }], 'in_progress')).toBe(
			33
		);
	});
	it('falls back on the status without checklist', () => {
		expect(projectProgress([], 'planned')).toBe(0);
		expect(projectProgress([], 'done')).toBe(100);
		expect(projectProgress([{ done: false }], 'done')).toBe(100);
	});
});

describe('datesForStatus', () => {
	const empty = { actualStart: null, actualEnd: null };
	it('sets the actual start and end when missing', () => {
		expect(datesForStatus(empty, 'planned', 'in_progress', '2026-11-10')).toEqual({
			actualStart: '2026-11-10',
			actualEnd: null
		});
		expect(datesForStatus(empty, 'planned', 'done', '2026-11-10')).toEqual({
			actualStart: '2026-11-10',
			actualEnd: '2026-11-10'
		});
	});
	it('keeps existing dates', () => {
		const d = { actualStart: '2026-10-01', actualEnd: null };
		expect(datesForStatus(d, 'in_progress', 'done', '2026-11-10')).toEqual({
			actualStart: '2026-10-01',
			actualEnd: '2026-11-10'
		});
	});
	it('returns only the date fields, even when given a whole project', () => {
		const project = { status: 'planned', title: 'Abri', actualStart: null, actualEnd: null };
		expect(Object.keys(datesForStatus(project, 'planned', 'done', '2026-11-10')).sort()).toEqual([
			'actualEnd',
			'actualStart'
		]);
	});

	it('clears the end date when reopening', () => {
		const d = { actualStart: '2026-10-01', actualEnd: '2026-11-01' };
		expect(datesForStatus(d, 'done', 'in_progress', '2026-11-10').actualEnd).toBeNull();
	});
});

describe('euros', () => {
	it('parses French and English notations', () => {
		expect(parseEuros('1 250,50')).toBe(125050);
		expect(parseEuros('1250.5')).toBe(125050);
		expect(parseEuros('300 €')).toBe(30000);
		expect(parseEuros('')).toBeNull();
		expect(parseEuros('abc')).toBeNaN();
	});
	it('formats amounts', () => {
		expect(formatEuros(125050).replace(/\s/g, ' ')).toBe('1 250,50 €');
		expect(centsToInput(125050)).toBe('1250,50');
		expect(centsToInput(30000)).toBe('300');
	});
});
