import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { validateSession } from '#lib/server/auth/session.ts';

const PUBLIC_PATHS = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const secure = event.url.protocol === 'https:';
	event.locals.authenticated = validateSession(event.cookies, secure);

	const isPublic = PUBLIC_PATHS.some((p) => event.url.pathname.startsWith(p));
	if (!event.locals.authenticated && !isPublic) {
		const target = event.url.pathname + event.url.search;
		redirect(303, `/login?redirect=${encodeURIComponent(target)}`);
	}

	return resolve(event);
};
