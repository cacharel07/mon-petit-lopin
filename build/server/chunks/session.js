import { l as session, n as db } from "./db.js";
import { eq, lt } from "drizzle-orm";
import { createHash, randomBytes } from "node:crypto";
// src/lib/server/auth/session.ts
var SESSION_COOKIE = "lopin_session";
var DAY_MS = 864e5;
var SESSION_DURATION_MS = 60 * DAY_MS;
var RENEW_THRESHOLD_MS = 30 * DAY_MS;
var hashToken = (token) => createHash("sha256").update(token).digest("hex");
function createSession(cookies, secure) {
	const token = randomBytes(32).toString("base64url");
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
	db.insert(session).values({
		id: hashToken(token),
		expiresAt
	}).run();
	setCookie(cookies, token, expiresAt, secure);
}
/** Returns true when the cookie holds a valid session (renewing it if needed). */
function validateSession(cookies, secure) {
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
function destroySession(cookies) {
	const token = cookies.get(SESSION_COOKIE);
	if (token) db.delete(session).where(eq(session.id, hashToken(token))).run();
	cookies.delete(SESSION_COOKIE, { path: "/" });
	db.delete(session).where(lt(session.expiresAt, /* @__PURE__ */ new Date())).run();
}
function setCookie(cookies, token, expires, secure) {
	cookies.set(SESSION_COOKIE, token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure,
		expires
	});
}
export { destroySession as n, validateSession as r, createSession as t };

//# sourceMappingURL=session.js.map