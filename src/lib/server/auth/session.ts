import { createHash, randomBytes } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { eq, lt } from 'drizzle-orm';
import { db } from '../db';
import { session } from '../db/schema';

export const SESSION_COOKIE = 'lopin_session';
const DAY_MS = 24 * 60 * 60 * 1000;
const SESSION_DURATION_MS = 60 * DAY_MS;
const RENEW_THRESHOLD_MS = 30 * DAY_MS;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export function createSession(cookies: Cookies, secure: boolean) {
	const token = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
	db.insert(session)
		.values({ id: hashToken(token), expiresAt })
		.run();
	setCookie(cookies, token, expiresAt, secure);
}

/** Returns true when the cookie holds a valid session (renewing it if needed). */
export function validateSession(cookies: Cookies, secure: boolean): boolean {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return false;
	const id = hashToken(token);
	const row = db.select().from(session).where(eq(session.id, id)).get();
	if (!row) return false;
	const now = Date.now();
	if (row.expiresAt.getTime() <= now) {
		db.delete(session).where(eq(session.id, id)).run();
		return false;
	}
	if (row.expiresAt.getTime() - now < RENEW_THRESHOLD_MS) {
		const expiresAt = new Date(now + SESSION_DURATION_MS);
		db.update(session).set({ expiresAt }).where(eq(session.id, id)).run();
		setCookie(cookies, token, expiresAt, secure);
	}
	return true;
}

export function destroySession(cookies: Cookies) {
	const token = cookies.get(SESSION_COOKIE);
	if (token)
		db.delete(session)
			.where(eq(session.id, hashToken(token)))
			.run();
	cookies.delete(SESSION_COOKIE, { path: '/' });
	db.delete(session).where(lt(session.expiresAt, new Date())).run();
}

function setCookie(cookies: Cookies, token: string, expires: Date, secure: boolean) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		expires
	});
}
