import { describe, expect, it } from 'vitest';
import { daysInMonth } from '../domain/dates.ts';
import { CARE_RULE_TYPES, SPECIES_CATEGORIES } from '../domain/enums.ts';
import { CATALOG } from './catalog.ts';
import { SEED_SPECIES } from './db/seed-data.ts';

const validDay = ([month, day]: [number, number]) =>
	month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(2024, month);

describe('catalogue', () => {
	it('has unique keys and common names', () => {
		expect(new Set(CATALOG.map((e) => e.key)).size).toBe(CATALOG.length);
		expect(new Set(CATALOG.map((e) => e.commonName)).size).toBe(CATALOG.length);
	});

	it('contains the species of the seed', () => {
		for (const key of SEED_SPECIES) expect(CATALOG.some((e) => e.key === key)).toBe(true);
	});

	it.each(CATALOG.map((e) => [e.commonName, e] as const))('%s is consistent', (_, entry) => {
		expect(SPECIES_CATEGORIES).toContain(entry.category);
		expect(entry.defaultSpacingM).toBeGreaterThan(0);
		expect(entry.rules.length).toBeGreaterThan(0);
		for (const r of entry.rules) {
			expect(CARE_RULE_TYPES).toContain(r.type);
			expect(r.label.trim()).not.toBe('');
			expect(validDay(r.start) && validDay(r.end)).toBe(true);
			if (r.intervalDays != null) expect(r.intervalDays).toBeGreaterThan(0);
			if (r.minAgeYears != null && r.maxAgeYears != null) {
				expect(r.minAgeYears).toBeLessThan(r.maxAgeYears);
			}
		}
		const names = (entry.varieties ?? []).map((v) => v.name);
		expect(new Set(names).size).toBe(names.length);
	});
});
