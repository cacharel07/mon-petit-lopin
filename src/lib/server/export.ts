import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { zipSync, strToU8, type Zippable } from 'fflate';
import { toCsv } from '../domain/csv.ts';
import { sqlite } from './db/index.ts';
import { photosDir } from './photos.ts';

/** Tables included in exports (sessions are left out). */
export const EXPORT_TABLES = [
	'zone',
	'species_template',
	'care_rule',
	'tree',
	'tree_pollinator',
	'intervention',
	'project',
	'project_task',
	'project_tree',
	'photo'
] as const;
export type ExportTable = (typeof EXPORT_TABLES)[number];

export function isExportTable(name: string): name is ExportTable {
	return (EXPORT_TABLES as readonly string[]).includes(name);
}

function columns(table: ExportTable): string[] {
	return (sqlite.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[]).map(
		(c) => c.name
	);
}

export function tableRows(table: ExportTable): Record<string, unknown>[] {
	return sqlite.prepare(`SELECT * FROM "${table}" ORDER BY rowid`).all() as Record<
		string,
		unknown
	>[];
}

export function tableCsv(table: ExportTable): string {
	return toCsv(tableRows(table), columns(table));
}

/** Every table, with the raw database column names. */
export function exportJson() {
	const tables = Object.fromEntries(EXPORT_TABLES.map((t) => [t, tableRows(t)]));
	return {
		app: 'mon-petit-lopin',
		exportedAt: new Date().toISOString(),
		tables
	};
}

/** ZIP archive: data.json, one CSV per table and every photo file. */
export async function exportZip(): Promise<Uint8Array> {
	const data = exportJson();
	const files: Zippable = {
		'data.json': strToU8(JSON.stringify(data, null, 2)),
		'LISEZMOI.txt': strToU8(
			'Export de Mon petit lopin.\n\n' +
				'- data.json : toutes les tables (noms de colonnes de la base).\n' +
				'- csv/ : une table par fichier, séparateur « ; », encodage UTF-8.\n' +
				'- photos/ : fichiers référencés par photo.file_name et photo.thumb_name.\n'
		)
	};
	for (const table of EXPORT_TABLES) files[`csv/${table}.csv`] = strToU8(tableCsv(table));

	for (const p of data.tables.photo as { file_name: string; thumb_name: string }[]) {
		for (const name of [p.file_name, p.thumb_name]) {
			try {
				// WebP is already compressed: store without recompressing.
				files[`photos/${name}`] = [await readFile(join(photosDir(), name)), { level: 0 }];
			} catch {
				// Missing file: skip it, the metadata stays in data.json.
			}
		}
	}
	return zipSync(files, { level: 6 });
}
