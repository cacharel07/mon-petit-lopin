// @ts-nocheck
import { error, redirect } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';
import { INTERVENTION_TYPES } from '#lib/domain/enums.ts';
import { db } from '#lib/server/db/index.ts';
import { intervention, photo } from '#lib/server/db/schema.ts';
import { files, oneOf, requiredDate, requiredInt, text, withForm } from '#lib/server/forms.ts';
import { storePhoto } from '#lib/server/photos.ts';
import { deleteIntervention, deletePhoto, displayName, getTree } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function context(params: { id: string; interventionId: string }) {
	const t = getTree(Number(params.id));
	if (!t) error(404, 'Arbre introuvable');
	const entry = db
		.select()
		.from(intervention)
		.where(and(eq(intervention.id, Number(params.interventionId)), eq(intervention.treeId, t.id)))
		.get();
	if (!entry) error(404, 'Intervention introuvable');
	return { tree: t, entry };
}

export const load = ({ params }: Parameters<PageServerLoad>[0]) => {
	const { tree, entry } = context(params);
	return {
		tree: { id: tree.id, name: displayName(tree) },
		entry,
		photos: db
			.select()
			.from(photo)
			.where(eq(photo.interventionId, entry.id))
			.orderBy(asc(photo.id))
			.all()
	};
};

export const actions = {
	save: ({ request, params }: import('./$types').RequestEvent) =>
		withForm(request, async (form) => {
			const { tree, entry } = context(params);
			db.update(intervention)
				.set({
					date: requiredDate(form, 'date', 'Date'),
					type: oneOf(form, 'type', INTERVENTION_TYPES, 'Type'),
					notes: text(form, 'notes')
				})
				.where(eq(intervention.id, entry.id))
				.run();
			for (const file of files(form, 'photos')) {
				db.insert(photo)
					.values({ ...(await storePhoto(file)), interventionId: entry.id })
					.run();
			}
			redirect(303, `/arbres/${tree.id}`);
		}),
	deletePhoto: ({ request, params }: import('./$types').RequestEvent) =>
		withForm(request, async (form) => {
			const { entry } = context(params);
			const photoId = requiredInt(form, 'photoId', 'Photo');
			const owned = db
				.select({ id: photo.id })
				.from(photo)
				.where(and(eq(photo.id, photoId), eq(photo.interventionId, entry.id)))
				.get();
			if (owned) await deletePhoto(photoId);
		}),
	delete: async ({ params }: import('./$types').RequestEvent) => {
		const { tree, entry } = context(params);
		await deleteIntervention(entry.id);
		redirect(303, `/arbres/${tree.id}`);
	}
};
;null as any as Actions;