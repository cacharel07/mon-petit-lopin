import { i as redirect } from "../../../../chunks/exports.js";
import { h as todayIso } from "../../../../chunks/dates.js";
import { n as datesForStatus } from "../../../../chunks/projects.js";
import { n as db, o as project } from "../../../../chunks/db.js";
import { f as withForm } from "../../../../chunks/forms.js";
import { o as parseProjectForm, s as setProjectTrees } from "../../../../chunks/projects2.js";
import { m as listZones, p as listTrees } from "../../../../chunks/trees.js";
// src/routes/travaux/nouveau/+page.server.ts
var load = () => ({
	zones: listZones(),
	trees: listTrees().map((t) => ({
		id: t.id,
		name: t.name
	}))
});
var actions = { default: ({ request }) => withForm(request, (form) => {
	const { values, treeIds } = parseProjectForm(form);
	const dates = datesForStatus(values, "planned", values.status, todayIso());
	const id = db.insert(project).values({
		...values,
		...dates
	}).returning({ id: project.id }).get().id;
	setProjectTrees(id, treeIds);
	redirect(303, `/travaux/${id}`);
}) };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map