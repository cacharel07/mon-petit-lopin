import { resolve } from 'node:path';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { describe, expect, it } from 'vitest';
import { catalogEntry } from './catalog.ts';
import { ensureTemplateFromCatalog, importedCatalogKeys } from './catalog-templates.ts';
import * as schema from './db/schema.ts';

function freshDb() {
	const client = new Database(':memory:');
	client.pragma('foreign_keys = ON');
	const db = drizzle(client, { schema });
	migrate(db, { migrationsFolder: resolve('drizzle') });
	return db;
}

const rulesOf = (db: ReturnType<typeof freshDb>, id: number) =>
	db.select().from(schema.careRule).where(eq(schema.careRule.speciesTemplateId, id)).all();

describe('ensureTemplateFromCatalog', () => {
	it('creates the template with its rules, all to be verified', () => {
		const db = freshDb();
		const id = ensureTemplateFromCatalog(db, 'prunier');
		const rules = rulesOf(db, id);
		expect(rules).toHaveLength(catalogEntry('prunier')!.rules.length);
		expect(rules.every((r) => !r.verified)).toBe(true);
		expect(importedCatalogKeys(db)).toEqual(new Set(['prunier']));
	});

	it('returns the same template on later calls', () => {
		const db = freshDb();
		const id = ensureTemplateFromCatalog(db, 'prunier');
		expect(ensureTemplateFromCatalog(db, 'prunier')).toBe(id);
		expect(rulesOf(db, id)).toHaveLength(catalogEntry('prunier')!.rules.length);
	});

	it('links an existing template with the same name instead of duplicating it', () => {
		const db = freshDb();
		const existing = db
			.insert(schema.speciesTemplate)
			.values({ commonName: 'Prunier' })
			.returning({ id: schema.speciesTemplate.id })
			.get().id;
		expect(ensureTemplateFromCatalog(db, 'prunier')).toBe(existing);
		expect(rulesOf(db, existing)).toHaveLength(0);
		expect(importedCatalogKeys(db).has('prunier')).toBe(true);
	});

	it('puts the altitude warning in the template notes', () => {
		const db = freshDb();
		const id = ensureTemplateFromCatalog(db, 'abricotier');
		const t = db
			.select()
			.from(schema.speciesTemplate)
			.where(eq(schema.speciesTemplate.id, id))
			.get();
		expect(t?.notes).toMatch(/^⚠️/);
	});

	it('rejects unknown keys', () => {
		expect(() => ensureTemplateFromCatalog(freshDb(), 'baobab')).toThrow();
	});
});
