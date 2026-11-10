import { resolve } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { describe, expect, it } from 'vitest';
import * as schema from './schema.ts';
import { seed } from './seed.ts';

function freshDb() {
	const client = new Database(':memory:');
	client.pragma('foreign_keys = ON');
	const db = drizzle(client, { schema });
	migrate(db, { migrationsFolder: resolve('drizzle') });
	return db;
}

describe('seed', () => {
	it('inserts the garden data with every care rule marked as « à vérifier »', () => {
		const db = freshDb();
		seed(db);

		const trees = db.select().from(schema.tree).all();
		expect(trees).toHaveLength(9);
		expect(trees.filter((t) => t.status === 'planted')).toHaveLength(2);
		expect(trees.filter((t) => t.status === 'purchased')).toHaveLength(7);

		const rules = db.select().from(schema.careRule).all();
		expect(rules.length).toBeGreaterThan(0);
		expect(rules.every((r) => !r.verified && r.speciesTemplateId !== null)).toBe(true);

		const projects = db.select().from(schema.project).all();
		expect(projects.map((p) => p.status).sort()).toEqual(['done', 'in_progress', 'planned']);
	});

	it('refuses to run twice', () => {
		const db = freshDb();
		seed(db);
		expect(() => seed(db)).toThrow(/déjà/);
	});
});
