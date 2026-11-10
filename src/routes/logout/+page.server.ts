import { redirect } from '@sveltejs/kit';
import { destroySession } from '#lib/server/auth/session.ts';
import type { Actions } from './$types';

export const actions: Actions = {
	default: ({ cookies }) => {
		destroySession(cookies);
		redirect(303, '/login');
	}
};
