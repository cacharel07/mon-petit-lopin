import { t as client } from "./db.js";
import { r as photosDir } from "./photos.js";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { strToU8, zipSync } from "fflate";
function cell(value) {
	if (value === null || value === void 0) return "";
	const text = typeof value === "string" ? value : String(value);
	return /[";\r\n]/.test(text) ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}
function toCsv(rows, columns) {
	const cols = columns ?? (rows[0] ? Object.keys(rows[0]) : []);
	const lines = [cols.map(cell).join(";")];
	for (const row of rows) lines.push(cols.map((c) => cell(row[c])).join(";"));
	return "﻿" + lines.join("\r\n") + "\r\n";
}
// src/lib/server/export.ts
/** Tables included in exports (sessions are left out). */
var EXPORT_TABLES = [
	"zone",
	"species_template",
	"care_rule",
	"tree",
	"tree_pollinator",
	"intervention",
	"project",
	"project_task",
	"project_tree",
	"photo"
];
function isExportTable(name) {
	return EXPORT_TABLES.includes(name);
}
function columns(table) {
	return client.prepare(`PRAGMA table_info("${table}")`).all().map((c) => c.name);
}
function tableRows(table) {
	return client.prepare(`SELECT * FROM "${table}" ORDER BY rowid`).all();
}
function tableCsv(table) {
	return toCsv(tableRows(table), columns(table));
}
/** Every table, with the raw database column names. */
function exportJson() {
	const tables = Object.fromEntries(EXPORT_TABLES.map((t) => [t, tableRows(t)]));
	return {
		app: "mon-petit-lopin",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		tables
	};
}
/** ZIP archive: data.json, one CSV per table and every photo file. */
async function exportZip() {
	const data = exportJson();
	const files = {
		"data.json": strToU8(JSON.stringify(data, null, 2)),
		"LISEZMOI.txt": strToU8("Export de Mon petit lopin.\n\n- data.json : toutes les tables (noms de colonnes de la base).\n- csv/ : une table par fichier, séparateur « ; », encodage UTF-8.\n- photos/ : fichiers référencés par photo.file_name et photo.thumb_name.\n")
	};
	for (const table of EXPORT_TABLES) files[`csv/${table}.csv`] = strToU8(tableCsv(table));
	for (const p of data.tables.photo) for (const name of [p.file_name, p.thumb_name]) try {
		files[`photos/${name}`] = [await readFile(join(photosDir(), name)), { level: 0 }];
	} catch {}
	return zipSync(files, { level: 6 });
}
export { tableCsv as i, exportZip as n, isExportTable as r, exportJson as t };

//# sourceMappingURL=export.js.map