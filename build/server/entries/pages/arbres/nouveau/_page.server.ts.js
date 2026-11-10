import { i as redirect } from "../../../../chunks/exports.js";
import { d as tree, n as db } from "../../../../chunks/db.js";
import { i as catalogEntry } from "../../../../chunks/catalog-templates.js";
import { t as catalogForForms } from "../../../../chunks/catalog-view.js";
import { f as withForm } from "../../../../chunks/forms.js";
import { t as parseTreeForm } from "../../../../chunks/tree-form.js";
import { f as listTemplates, h as setPollinators, m as listZones, p as listTrees } from "../../../../chunks/trees.js";
// src/routes/arbres/nouveau/+page.server.ts
/**
* Two steps: without `?espece=`, pick a species (catalogue or own template);
* with it, the tree form prefilled from that species.
*   ?espece=<catalog key> | ?espece=modele-<template id> | ?espece=libre
*/
var load = ({ url }) => {
	const templates = listTemplates();
	const catalog = catalogForForms();
	const choice = url.searchParams.get("espece");
	let values = null;
	if (choice === "libre") values = {};
	else if (choice?.startsWith("modele-")) {
		const t = templates.find((t) => `modele-${t.id}` === choice);
		if (t) values = {
			speciesTemplateId: t.id,
			commonName: t.commonName,
			species: t.latinName,
			pollinatorRequired: t.needsPollinator,
			recommendedSpacingM: t.defaultSpacingM
		};
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
		otherTrees: listTrees().map((t) => ({
			id: t.id,
			name: t.name
		}))
	};
};
var actions = { default: ({ request }) => withForm(request, (form) => {
	const { tree: values, pollinatorIds } = parseTreeForm(form);
	const id = db.insert(tree).values(values).returning({ id: tree.id }).get().id;
	setPollinators(id, pollinatorIds);
	redirect(303, `/arbres/${id}`);
}) };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map