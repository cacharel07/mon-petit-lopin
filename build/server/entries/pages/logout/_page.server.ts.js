import { i as redirect } from "../../../chunks/exports.js";
import { n as destroySession } from "../../../chunks/session.js";
// src/routes/logout/+page.server.ts
var actions = { default: ({ cookies }) => {
	destroySession(cookies);
	redirect(303, "/login");
} };
export { actions };

//# sourceMappingURL=_page.server.ts.js.map