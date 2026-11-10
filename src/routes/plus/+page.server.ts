import { redirect } from '@sveltejs/kit';
import { db } from '#lib/server/db/index.ts';
import { isDatabaseEmpty, seed } from '#lib/server/db/seed.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ canSeed: isDatabaseEmpty(db) });

export const actions: Actions = {
	/**
	 * Insert the initial garden data from the app itself: the host's SSH session
	 * does not have enough memory to run `npm run db:seed`.
	 */
	seed: () => {
		if (isDatabaseEmpty(db)) seed(db);
		redirect(303, '/');
	}
};
