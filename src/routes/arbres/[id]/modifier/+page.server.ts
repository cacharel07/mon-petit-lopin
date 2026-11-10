import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { tree } from '#lib/server/db/schema.ts';
import { catalogForForms } from '#lib/server/catalog-view.ts';
import { withForm } from '#lib/server/forms.ts';
import { parseTreeForm } from '#lib/server/tree-form.ts';
import {
	deleteTree,
	dropOverrides,
	getPollinatorIds,
	getTree,
	listTemplates,
	listTrees,
	listZones,
	setPollinators
} from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function loadTree(id: string) {
	const t = getTree(Number(id));
	if (!t) error(404, 'Arbre introuvable');
	return t;
}

export const load: PageServerLoad = ({ params }) => {
	const t = loadTree(params.id);
	return {
		tree: t,
		pollinatorIds: getPollinatorIds(t.id),
		zones: listZones(),
		templates: listTemplates(),
		catalog: catalogForForms(),
		otherTrees: listTrees()
			.filter((o) => o.id !== t.id)
			.map((o) => ({ id: o.id, name: o.name }))
	};
};

export const actions: Actions = {
	save: ({ request, params }) =>
		withForm(request, (form) => {
			const current = loadTree(params.id);
			const { tree: values, pollinatorIds } = parseTreeForm(form);
			db.transaction(() => {
				// Overrides only make sense for the rules of the current template.
				if (values.speciesTemplateId !== current.speciesTemplateId) dropOverrides(current.id);
				db.update(tree).set(values).where(eq(tree.id, current.id)).run();
			});
			setPollinators(current.id, pollinatorIds);
			redirect(303, `/arbres/${current.id}`);
		}),
	delete: async ({ params }) => {
		await deleteTree(loadTree(params.id).id);
		redirect(303, '/arbres');
	}
};
