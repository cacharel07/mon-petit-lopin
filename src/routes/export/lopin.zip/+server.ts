import { todayIso } from '#lib/domain/dates.ts';
import { exportZip } from '#lib/server/export.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const zip = await exportZip();
	return new Response(Buffer.from(zip), {
		headers: {
			'content-type': 'application/zip',
			'content-disposition': `attachment; filename="lopin-${todayIso()}.zip"`
		}
	});
};
