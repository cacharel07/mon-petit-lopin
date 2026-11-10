import { i as redirect, t as error } from "../../../../../../chunks/exports.js";
import { i as INTERVENTION_TYPES } from "../../../../../../chunks/enums.js";
import { a as photo, i as intervention, n as db } from "../../../../../../chunks/db.js";
import { a as files, c as requiredDate, d as text, f as withForm, l as requiredInt, s as oneOf } from "../../../../../../chunks/forms.js";
import { i as storePhoto } from "../../../../../../chunks/photos.js";
import { i as displayName, l as getTree, n as deletePhoto, t as deleteIntervention } from "../../../../../../chunks/trees.js";
import { and, asc, eq } from "drizzle-orm";
// src/routes/arbres/[id]/journal/[interventionId]/+page.server.ts
function context(params) {
	const t = getTree(Number(params.id));
	if (!t) error(404, "Arbre introuvable");
	const entry = db.select().from(intervention).where(and(eq(intervention.id, Number(params.interventionId)), eq(intervention.treeId, t.id))).get();
	if (!entry) error(404, "Intervention introuvable");
	return {
		tree: t,
		entry
	};
}
var load = ({ params }) => {
	const { tree, entry } = context(params);
	return {
		tree: {
			id: tree.id,
			name: displayName(tree)
		},
		entry,
		photos: db.select().from(photo).where(eq(photo.interventionId, entry.id)).orderBy(asc(photo.id)).all()
	};
};
var actions = {
	save: ({ request, params }) => withForm(request, async (form) => {
		const { tree, entry } = context(params);
		db.update(intervention).set({
			date: requiredDate(form, "date", "Date"),
			type: oneOf(form, "type", INTERVENTION_TYPES, "Type"),
			notes: text(form, "notes")
		}).where(eq(intervention.id, entry.id)).run();
		for (const file of files(form, "photos")) db.insert(photo).values({
			...await storePhoto(file),
			interventionId: entry.id
		}).run();
		redirect(303, `/arbres/${tree.id}`);
	}),
	deletePhoto: ({ request, params }) => withForm(request, async (form) => {
		const { entry } = context(params);
		const photoId = requiredInt(form, "photoId", "Photo");
		if (db.select({ id: photo.id }).from(photo).where(and(eq(photo.id, photoId), eq(photo.interventionId, entry.id))).get()) await deletePhoto(photoId);
	}),
	delete: async ({ params }) => {
		const { tree, entry } = context(params);
		await deleteIntervention(entry.id);
		redirect(303, `/arbres/${tree.id}`);
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map