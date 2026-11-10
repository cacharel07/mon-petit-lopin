import { i as redirect, t as error } from "../../../../../chunks/exports.js";
import { h as todayIso } from "../../../../../chunks/dates.js";
import { n as datesForStatus } from "../../../../../chunks/projects.js";
import { n as db, o as project } from "../../../../../chunks/db.js";
import { f as withForm } from "../../../../../chunks/forms.js";
import { i as getProjectTreeIds, n as getProject, o as parseProjectForm, s as setProjectTrees, t as deleteProject } from "../../../../../chunks/projects2.js";
import { m as listZones, p as listTrees } from "../../../../../chunks/trees.js";
import { eq } from "drizzle-orm";
// src/routes/travaux/[id]/modifier/+page.server.ts
function loadProject(id) {
	const p = getProject(Number(id));
	if (!p) error(404, "Projet introuvable");
	return p;
}
var load = ({ params }) => {
	const p = loadProject(params.id);
	return {
		project: p,
		treeIds: getProjectTreeIds(p.id),
		zones: listZones(),
		trees: listTrees().map((t) => ({
			id: t.id,
			name: t.name
		}))
	};
};
var actions = {
	save: ({ request, params }) => withForm(request, (form) => {
		const p = loadProject(params.id);
		const { values, treeIds } = parseProjectForm(form);
		const dates = values.status !== p.status ? datesForStatus(values, p.status, values.status, todayIso()) : {};
		db.update(project).set({
			...values,
			...dates
		}).where(eq(project.id, p.id)).run();
		setProjectTrees(p.id, treeIds);
		redirect(303, `/travaux/${p.id}`);
	}),
	delete: async ({ params }) => {
		await deleteProject(loadProject(params.id).id);
		redirect(303, "/travaux");
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map