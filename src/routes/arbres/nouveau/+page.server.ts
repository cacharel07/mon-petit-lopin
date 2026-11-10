import { redirect } from '@sveltejs/kit';
import { db } from '#lib/server/db/index.ts';
import { tree } from '#lib/server/db/schema.ts';
import { withForm } from '#lib/server/forms.ts';
import { parseTreeForm } from '#lib/server/tree-form.ts';
import { listTemplates, listTrees, listZones, setPollinators } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	zones: listZones(),
	templates: listTemplates(),
	otherTrees: listTrees().map((t) => ({ id: t.id, name: t.name }))
});

export const actions: Actions = {
	default: ({ request }) =>
		withForm(request, (form) => {
			const { tree: values, pollinatorIds } = parseTreeForm(form);
			const id = db.insert(tree).values(values).returning({ id: tree.id }).get().id;
			setPollinators(id, pollinatorIds);
			redirect(303, `/arbres/${id}`);
		})
};
