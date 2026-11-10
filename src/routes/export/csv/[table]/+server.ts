import { error } from '@sveltejs/kit';
import { todayIso } from '#lib/domain/dates.ts';
import { isExportTable, tableCsv } from '#lib/server/export.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	if (!isExportTable(params.table)) error(404, 'Table inconnue');
	return new Response(tableCsv(params.table), {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="lopin-${params.table}-${todayIso()}.csv"`
		}
	});
};
