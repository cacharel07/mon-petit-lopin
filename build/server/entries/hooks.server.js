import { i as redirect } from "../chunks/exports.js";
import { r as validateSession } from "../chunks/session.js";
// src/hooks.server.ts
var PUBLIC_PATHS = ["/login"];
var handle = async ({ event, resolve }) => {
	const secure = event.url.protocol === "https:";
	event.locals.authenticated = validateSession(event.cookies, secure);
	const isPublic = PUBLIC_PATHS.some((p) => event.url.pathname.startsWith(p));
	if (!event.locals.authenticated && !isPublic) {
		const target = event.url.pathname + event.url.search;
		redirect(303, `/login?redirect=${encodeURIComponent(target)}`);
	}
	return resolve(event);
};
export { handle };

//# sourceMappingURL=hooks.server.js.map