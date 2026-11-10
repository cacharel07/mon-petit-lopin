import { i as redirect, t as error } from "../../../../../chunks/exports.js";
import { d as tree, n as db } from "../../../../../chunks/db.js";
import { t as catalogForForms } from "../../../../../chunks/catalog-view.js";
import { f as withForm } from "../../../../../chunks/forms.js";
import { t as parseTreeForm } from "../../../../../chunks/tree-form.js";
import { a as dropOverrides, f as listTemplates, h as setPollinators, l as getTree, m as listZones, o as getPollinatorIds, p as listTrees, r as deleteTree } from "../../../../../chunks/trees.js";
import { eq } from "drizzle-orm";
// src/routes/arbres/[id]/modifier/+page.server.ts
function loadTree(id) {
	const t = getTree(Number(id));
	if (!t) error(404, "Arbre introuvable");
	return t;
}
var load = ({ params }) => {
	const t = loadTree(params.id);
	return {
		tree: t,
		pollinatorIds: getPollinatorIds(t.id),
		zones: listZones(),
		templates: listTemplates(),
		catalog: catalogForForms(),
		otherTrees: listTrees().filter((o) => o.id !== t.id).map((o) => ({
			id: o.id,
			name: o.name
		}))
	};
};
var actions = {
	save: ({ request, params }) => withForm(request, (form) => {
		const current = loadTree(params.id);
		const { tree: values, pollinatorIds } = parseTreeForm(form);
		db.transaction(() => {
			if (values.speciesTemplateId !== current.speciesTemplateId) dropOverrides(current.id);
			db.update(tree).set(values).where(eq(tree.id, current.id)).run();
		});
		setPollinators(current.id, pollinatorIds);
		redirect(303, `/arbres/${current.id}`);
	}),
	delete: async ({ params }) => {
		await deleteTree(loadTree(params.id).id);
		redirect(303, "/arbres");
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map