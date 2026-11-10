// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { destroySession } from '#lib/server/auth/session.ts';
import type { Actions } from './$types';

export const actions = {
	default: ({ cookies }: import('./$types').RequestEvent) => {
		destroySession(cookies);
		redirect(303, '/login');
	}
};
;null as any as Actions;