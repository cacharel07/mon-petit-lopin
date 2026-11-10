import { i as redirect, t as error } from "../../../../chunks/exports.js";
import { d as fullYearsBetween, h as todayIso } from "../../../../chunks/dates.js";
import { i as INTERVENTION_TYPES } from "../../../../chunks/enums.js";
import { a as photo, d as tree, i as intervention, n as db } from "../../../../chunks/db.js";
import { a as files, c as requiredDate, d as text, f as withForm, l as requiredInt, r as date, s as oneOf, t as FormError } from "../../../../chunks/forms.js";
import { i as storePhoto } from "../../../../chunks/photos.js";
import { n as currentItemByRule } from "../../../../chunks/schedule.js";
import { t as dueText } from "../../../../chunks/due-text.js";
import { l as getTree, n as deletePhoto, u as getTreeDetail } from "../../../../chunks/trees.js";
import { and, eq } from "drizzle-orm";
// src/routes/arbres/[id]/+page.server.ts
function loadTree(id) {
	const t = getTree(Number(id));
	if (!t) error(404, "Arbre introuvable");
	return t;
}
var load = ({ params }) => {
	const detail = getTreeDetail(Number(params.id));
	if (!detail) error(404, "Arbre introuvable");
	const today = todayIso();
	const t = detail.tree;
	const statuses = {};
	for (const [ruleId, item] of currentItemByRule(t.id, today)) statuses[ruleId] = {
		status: item.status,
		text: dueText(item, today)
	};
	return {
		...detail,
		statuses,
		today,
		ageYears: t.status === "planted" && t.plantingDate ? fullYearsBetween(t.plantingDate, today) : null
	};
};
async function storeAll(uploads, owner) {
	for (const file of uploads) {
		const stored = await storePhoto(file);
		db.insert(photo).values({
			...stored,
			...owner
		}).run();
	}
}
var actions = {
	addIntervention: ({ request, params }) => withForm(request, async (form) => {
		const t = loadTree(params.id);
		const uploads = files(form, "photos");
		const id = db.insert(intervention).values({
			treeId: t.id,
			date: requiredDate(form, "date", "Date"),
			type: oneOf(form, "type", INTERVENTION_TYPES, "Type"),
			notes: text(form, "notes")
		}).returning({ id: intervention.id }).get().id;
		await storeAll(uploads, { interventionId: id });
		return { added: "intervention" };
	}),
	addPhotos: ({ request, params }) => withForm(request, async (form) => {
		const t = loadTree(params.id);
		const uploads = files(form, "photos");
		if (!uploads.length) throw new FormError("Choisis au moins une photo.");
		await storeAll(uploads, { treeId: t.id });
		return { added: "photos" };
	}),
	deletePhoto: ({ request, params }) => withForm(request, async (form) => {
		const t = loadTree(params.id);
		const photoId = requiredInt(form, "photoId", "Photo");
		if (db.select({ id: photo.id }).from(photo).where(and(eq(photo.id, photoId), eq(photo.treeId, t.id))).get()) await deletePhoto(photoId);
	}),
	markPlanted: ({ request, params }) => withForm(request, (form) => {
		const t = loadTree(params.id);
		const plantingDate = date(form, "date", "Date de plantation") ?? todayIso();
		db.transaction(() => {
			db.update(tree).set({
				status: "planted",
				plantingDate
			}).where(eq(tree.id, t.id)).run();
			db.insert(intervention).values({
				treeId: t.id,
				date: plantingDate,
				type: "planting",
				notes: text(form, "notes")
			}).run();
		});
		redirect(303, `/arbres/${t.id}`);
	})
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map