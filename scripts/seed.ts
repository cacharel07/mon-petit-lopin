// Usage: npm run db:seed
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../src/lib/server/db/schema.ts';
import { seed } from '../src/lib/server/db/seed.ts';

const path = process.env.DATABASE_URL || 'data/lopin.db';
mkdirSync(dirname(resolve(path)), { recursive: true });
const client = new Database(path);
client.pragma('foreign_keys = ON');
const db = drizzle(client, { schema });
migrate(db, { migrationsFolder: resolve('drizzle') });

try {
	seed(db);
	console.log(`Données initiales insérées dans ${path}.`);
} catch (e) {
	console.error((e as Error).message);
	process.exitCode = 1;
} finally {
	client.close();
}
