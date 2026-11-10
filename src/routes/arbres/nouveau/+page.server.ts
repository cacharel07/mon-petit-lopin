import { redirect } from '@sveltejs/kit';
import { db } from '#lib/server/db/index.ts';
import { tree } from '#lib/server/db/schema.ts';
import { catalogEntry } from '#lib/server/catalog.ts';
import { catalogForForms } from '#lib/server/catalog-view.ts';
import { withForm } from '#lib/server/forms.ts';
import { parseTreeForm } from '#lib/server/tree-form.ts';
import { listTemplates, listTrees, listZones, setPollinators } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

/**
 * Two steps: without `?espece=`, pick a species (catalogue or own template);
 * with it, the tree form prefilled from that species.
 *   ?espece=<catalog key> | ?espece=modele-<template id> | ?espece=libre
 */
export const load: PageServerLoad = ({ url }) => {
	const templates = listTemplates();
	const catalog = catalogForForms();
	const choice = url.searchParams.get('espece');

	let values: Record<string, string | number | boolean | null> | null = null;
	if (choice === 'libre') {
		values = {};
	} else if (choice?.startsWith('modele-')) {
		const t = templates.find((t) => `modele-${t.id}` === choice);
		if (t) {
			values = {
				speciesTemplateId: t.id,
				commonName: t.commonName,
				species: t.latinName,
				pollinatorRequired: t.needsPollinator,
				recommendedSpacingM: t.defaultSpacingM
			};
		}
	} else if (choice) {
		const entry = catalogEntry(choice);
		if (entry) {
			const linked = templates.find((t) => t.catalogKey === entry.key);
			values = {
				speciesTemplateId: linked ? linked.id : `catalog:${entry.key}`,
				commonName: entry.commonName,
				species: entry.latinName,
				pollinatorRequired: entry.needsPollinator,
				recommendedSpacingM: entry.defaultSpacingM
			};
		}
	}

	return {
		values,
		zones: listZones(),
		templates,
		catalog,
		otherTrees: listTrees().map((t) => ({ id: t.id, name: t.name }))
	};
};

export const actions: Actions = {
	default: ({ request }) =>
		withForm(request, (form) => {
			const { tree: values, pollinatorIds } = parseTreeForm(form);
			const id = db.insert(tree).values(values).returning({ id: tree.id }).get().id;
			setPollinators(id, pollinatorIds);
			redirect(303, `/arbres/${id}`);
		})
};
