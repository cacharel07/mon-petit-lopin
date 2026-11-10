/**
 * CSV serialisation for exports. Uses ';' as separator and a UTF-8 BOM so the
 * file opens directly in a French-locale spreadsheet.
 */

export const CSV_SEPARATOR = ';';

function cell(value: unknown): string {
	if (value === null || value === undefined) return '';
	const text = typeof value === 'string' ? value : String(value);
	return /[";\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(
	rows: readonly Record<string, unknown>[],
	columns?: readonly string[]
): string {
	const cols = columns ?? (rows[0] ? Object.keys(rows[0]) : []);
	const lines = [cols.map(cell).join(CSV_SEPARATOR)];
	for (const row of rows) lines.push(cols.map((c) => cell(row[c])).join(CSV_SEPARATOR));
	return '﻿' + lines.join('\r\n') + '\r\n';
}
