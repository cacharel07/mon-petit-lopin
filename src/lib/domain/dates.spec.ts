import { describe, expect, it } from 'vitest';
import { formatDate, formatWindow, fullYearsBetween, isIsoDate, todayIso } from './dates.ts';

describe('isIsoDate', () => {
	it('accepts valid dates and rejects invalid ones', () => {
		expect(isIsoDate('2026-11-10')).toBe(true);
		expect(isIsoDate('2024-02-29')).toBe(true);
		expect(isIsoDate('2026-02-29')).toBe(false);
		expect(isIsoDate('2026-13-01')).toBe(false);
		expect(isIsoDate('10/11/2026')).toBe(false);
	});
});

describe('fullYearsBetween', () => {
	it('counts completed years only', () => {
		expect(fullYearsBetween('2023-03-15', '2026-03-14')).toBe(2);
		expect(fullYearsBetween('2023-03-15', '2026-03-15')).toBe(3);
		expect(fullYearsBetween('2026-11-10', '2026-12-01')).toBe(0);
	});
});

describe('todayIso', () => {
	it('uses the garden time zone, not UTC', () => {
		// 23:30 UTC on Dec 31 is already Jan 1 in Paris.
		expect(todayIso(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01');
	});
});

describe('formatting', () => {
	it('formats dates in French', () => {
		expect(formatDate('2026-03-01')).toBe('1er mars 2026');
		expect(formatDate('2026-11-10')).toBe('10 novembre 2026');
		expect(formatDate(null)).toBe('');
	});

	it('formats a care window', () => {
		expect(formatWindow({ startMonth: 2, startDay: 15, endMonth: 3, endDay: 31 })).toBe(
			'du 15 févr. au 31 mars'
		);
	});
});
