import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { error } from '@sveltejs/kit';
import { PHOTO_FILE_NAME, photosDir } from '#lib/server/photos.ts';
import type { RequestHandler } from './$types';

// Served behind authentication (see hooks.server.ts). File names are random
// UUIDs and never change, so they can be cached for a long time.
export const GET: RequestHandler = async ({ params }) => {
	if (!PHOTO_FILE_NAME.test(params.name)) error(404, 'Photo introuvable');
	try {
		const data = await readFile(join(photosDir(), params.name));
		return new Response(data, {
			headers: {
				'content-type': 'image/webp',
				'cache-control': 'private, max-age=31536000, immutable'
			}
		});
	} catch {
		error(404, 'Photo introuvable');
	}
};
