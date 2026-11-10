import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { fullYearsBetween, todayIso } from '#lib/domain/dates.ts';
import { INTERVENTION_TYPES } from '#lib/domain/enums.ts';
import { db } from '#lib/server/db/index.ts';
import { intervention, photo, tree } from '#lib/server/db/schema.ts';
import {
	FormError,
	date,
	files,
	oneOf,
	requiredDate,
	requiredInt,
	text,
	withForm
} from '#lib/server/forms.ts';
import { storePhoto } from '#lib/server/photos.ts';
import { deletePhoto, getTree, getTreeDetail } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function loadTree(id: string) {
	const t = getTree(Number(id));
	if (!t) error(404, 'Arbre introuvable');
	return t;
}

export const load: PageServerLoad = ({ params }) => {
	const detail = getTreeDetail(Number(params.id));
	if (!detail) error(404, 'Arbre introuvable');
	const today = todayIso();
	const t = detail.tree;
	return {
		...detail,
		today,
		ageYears:
			t.status === 'planted' && t.plantingDate ? fullYearsBetween(t.plantingDate, today) : null
	};
};

async function storeAll(uploads: File[], owner: { treeId?: number; interventionId?: number }) {
	for (const file of uploads) {
		const stored = await storePhoto(file);
		db.insert(photo)
			.values({ ...stored, ...owner })
			.run();
	}
}

export const actions: Actions = {
	addIntervention: ({ request, params }) =>
		withForm(request, async (form) => {
			const t = loadTree(params.id);
			const uploads = files(form, 'photos');
			const id = db
				.insert(intervention)
				.values({
					treeId: t.id,
					date: requiredDate(form, 'date', 'Date'),
					type: oneOf(form, 'type', INTERVENTION_TYPES, 'Type'),
					notes: text(form, 'notes')
				})
				.returning({ id: intervention.id })
				.get().id;
			await storeAll(uploads, { interventionId: id });
			return { added: 'intervention' as const };
		}),

	addPhotos: ({ request, params }) =>
		withForm(request, async (form) => {
			const t = loadTree(params.id);
			const uploads = files(form, 'photos');
			if (!uploads.length) throw new FormError('Choisis au moins une photo.');
			await storeAll(uploads, { treeId: t.id });
			return { added: 'photos' as const };
		}),

	deletePhoto: ({ request, params }) =>
		withForm(request, async (form) => {
			const t = loadTree(params.id);
			const photoId = requiredInt(form, 'photoId', 'Photo');
			const owned = db
				.select({ id: photo.id })
				.from(photo)
				.where(and(eq(photo.id, photoId), eq(photo.treeId, t.id)))
				.get();
			if (owned) await deletePhoto(photoId);
		}),

	markPlanted: ({ request, params }) =>
		withForm(request, (form) => {
			const t = loadTree(params.id);
			const plantingDate = date(form, 'date', 'Date de plantation') ?? todayIso();
			db.transaction(() => {
				db.update(tree).set({ status: 'planted', plantingDate }).where(eq(tree.id, t.id)).run();
				db.insert(intervention)
					.values({
						treeId: t.id,
						date: plantingDate,
						type: 'planting',
						notes: text(form, 'notes')
					})
					.run();
			});
			redirect(303, `/arbres/${t.id}`);
		})
};
