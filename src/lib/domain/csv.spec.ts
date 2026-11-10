import { describe, expect, it } from 'vitest';
import { toCsv } from './csv.ts';

describe('toCsv', () => {
	it('writes a header, escapes special characters and leaves nulls empty', () => {
		const csv = toCsv([
			{ id: 1, name: 'Pommier', notes: 'Taille "douce"; hiver' },
			{ id: 2, name: 'Cerisier', notes: null }
		]);
		expect(csv).toBe('﻿id;name;notes\r\n1;Pommier;"Taille ""douce""; hiver"\r\n2;Cerisier;\r\n');
	});

	it('keeps multi-line text in a quoted cell', () => {
		expect(toCsv([{ a: 'ligne 1\nligne 2' }])).toContain('"ligne 1\nligne 2"');
	});

	it('uses the given columns for an empty table', () => {
		expect(toCsv([], ['id', 'name'])).toBe('﻿id;name\r\n');
	});
});
