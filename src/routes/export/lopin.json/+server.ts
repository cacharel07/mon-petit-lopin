import { todayIso } from '#lib/domain/dates.ts';
import { exportJson } from '#lib/server/export.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () =>
	new Response(JSON.stringify(exportJson(), null, 2), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'content-disposition': `attachment; filename="lopin-${todayIso()}.json"`
		}
	});
