// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_PASSWORD_HASH, ADMIN_USERNAME } from '$app/env/private';
import { verifyPassword } from '#lib/server/auth/password.ts';
import { createSession } from '#lib/server/auth/session.ts';
import type { Actions, PageServerLoad } from './$types';

/** Only allow redirects to local paths (no open redirect). */
function safeRedirect(target: string | null): string {
	return target && target.startsWith('/') && !target.startsWith('//') ? target : '/';
}

export const load = ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	if (locals.authenticated) redirect(303, safeRedirect(url.searchParams.get('redirect')));
};

let lastFailure = 0;

export const actions = {
	default: async ({ request, cookies, url }: import('./$types').RequestEvent) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '').trim();
		const password = String(form.get('password') ?? '');

		// Crude brute-force protection: at most one failed attempt per second.
		if (Date.now() - lastFailure < 1000) {
			return fail(429, { username, error: 'Trop de tentatives, réessaie dans un instant.' });
		}

		const ok = username === ADMIN_USERNAME && (await verifyPassword(password, ADMIN_PASSWORD_HASH));
		if (!ok) {
			lastFailure = Date.now();
			return fail(400, { username, error: 'Identifiant ou mot de passe incorrect.' });
		}

		createSession(cookies, url.protocol === 'https:');
		redirect(303, safeRedirect(url.searchParams.get('redirect')));
	}
};
;null as any as Actions;