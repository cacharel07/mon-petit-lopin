import { i as redirect } from "../../../chunks/exports.js";
import { h as todayIso } from "../../../chunks/dates.js";
import { u as PROJECT_STATUSES } from "../../../chunks/enums.js";
import { n as datesForStatus } from "../../../chunks/projects.js";
import { n as db, o as project } from "../../../chunks/db.js";
import { f as withForm, l as requiredInt, s as oneOf } from "../../../chunks/forms.js";
import { a as listProjects, n as getProject } from "../../../chunks/projects2.js";
import { eq } from "drizzle-orm";
// src/routes/travaux/+page.server.ts
var load = ({ url }) => {
	const view = url.searchParams.get("vue") === "kanban" ? "kanban" : "list";
	const param = url.searchParams.get("statut");
	return {
		view,
		status: PROJECT_STATUSES.includes(param ?? "") ? param : null,
		projects: listProjects(),
		today: todayIso()
	};
};
var actions = { 
/** Move a project to another Kanban column. */
move: ({ request }) => withForm(request, (form) => {
	const p = getProject(requiredInt(form, "id", "Projet"));
	if (!p) return;
	const to = oneOf(form, "status", PROJECT_STATUSES, "Statut");
	db.update(project).set({
		status: to,
		...datesForStatus(p, p.status, to, todayIso())
	}).where(eq(project.id, p.id)).run();
	redirect(303, "/travaux?vue=kanban");
}) };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map