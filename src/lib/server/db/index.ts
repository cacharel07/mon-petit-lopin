import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { building } from '$app/env';
import { DATABASE_URL } from '$app/env/private';
import * as schema from './schema.ts';

function open(path: string) {
	if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });
	const client = new Database(path);
	client.pragma('journal_mode = WAL');
	client.pragma('foreign_keys = ON');
	return client;
}

// During `vite build` SvelteKit analyses the app: do not touch the real database.
const client = open(building ? ':memory:' : DATABASE_URL);

export const db = drizzle(client, { schema });
export type Db = typeof db;

// Apply pending migrations at startup, so deploying is just "restart the app".
if (!building) migrate(db, { migrationsFolder: resolve('drizzle') });

export { client as sqlite };
