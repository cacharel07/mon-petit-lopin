import { i as redirect, n as fail } from "../../../chunks/exports.js";
import { n as ADMIN_USERNAME, t as ADMIN_PASSWORD_HASH } from "../../../chunks/private.js";
import { t as createSession } from "../../../chunks/session.js";
import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
// src/lib/server/auth/password.ts
var scrypt$1 = promisify(scrypt);
async function verifyPassword(password, stored) {
	const [algo, saltHex, hashHex] = stored.split(":");
	if (algo !== "scrypt" || !saltHex || !hashHex) return false;
	const expected = Buffer.from(hashHex, "hex");
	const actual = await scrypt$1(password, Buffer.from(saltHex, "hex"), expected.length);
	return timingSafeEqual(actual, expected);
}
// src/routes/login/+page.server.ts
/** Only allow redirects to local paths (no open redirect). */
function safeRedirect(target) {
	return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
}
var load = ({ locals, url }) => {
	if (locals.authenticated) redirect(303, safeRedirect(url.searchParams.get("redirect")));
};
var lastFailure = 0;
var actions = { default: async ({ request, cookies, url }) => {
	const form = await request.formData();
	const username = String(form.get("username") ?? "").trim();
	const password = String(form.get("password") ?? "");
	if (Date.now() - lastFailure < 1e3) return fail(429, {
		username,
		error: "Trop de tentatives, réessaie dans un instant."
	});
	if (!(username === ADMIN_USERNAME && await verifyPassword(password, ADMIN_PASSWORD_HASH))) {
		lastFailure = Date.now();
		return fail(400, {
			username,
			error: "Identifiant ou mot de passe incorrect."
		});
	}
	createSession(cookies, url.protocol === "https:");
	redirect(303, safeRedirect(url.searchParams.get("redirect")));
} };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map