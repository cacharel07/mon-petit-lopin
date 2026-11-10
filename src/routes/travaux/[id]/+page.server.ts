import { error } from '@sveltejs/kit';
import { and, eq, max } from 'drizzle-orm';
import { todayIso } from '#lib/domain/dates.ts';
import { PHOTO_PHASES, PROJECT_STATUSES } from '#lib/domain/enums.ts';
import { datesForStatus } from '#lib/domain/projects.ts';
import { db } from '#lib/server/db/index.ts';
import { photo, project, projectTask } from '#lib/server/db/schema.ts';
import {
	FormError,
	date,
	files,
	oneOf,
	requiredInt,
	requiredText,
	withForm
} from '#lib/server/forms.ts';
import { storePhoto } from '#lib/server/photos.ts';
import { getProject, getProjectDetail } from '#lib/server/projects.ts';
import { deletePhoto } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function loadProject(id: string) {
	const p = getProject(Number(id));
	if (!p) error(404, 'Projet introuvable');
	return p;
}

export const load: PageServerLoad = ({ params }) => {
	const detail = getProjectDetail(Number(params.id));
	if (!detail) error(404, 'Projet introuvable');
	return { ...detail, today: todayIso() };
};

function taskOf(projectId: number, form: FormData) {
	const taskId = requiredInt(form, 'taskId', 'Tâche');
	const task = db
		.select()
		.from(projectTask)
		.where(and(eq(projectTask.id, taskId), eq(projectTask.projectId, projectId)))
		.get();
	if (!task) throw new FormError('Tâche introuvable.');
	return task;
}

export const actions: Actions = {
	setStatus: ({ request, params }) =>
		withForm(request, (form) => {
			const p = loadProject(params.id);
			const to = oneOf(form, 'status', PROJECT_STATUSES, 'Statut');
			db.update(project)
				.set({ status: to, ...datesForStatus(p, p.status, to, todayIso()) })
				.where(eq(project.id, p.id))
				.run();
		}),

	addTask: ({ request, params }) =>
		withForm(request, (form) => {
			const p = loadProject(params.id);
			const last = db
				.select({ m: max(projectTask.sortOrder) })
				.from(projectTask)
				.where(eq(projectTask.projectId, p.id))
				.get();
			db.insert(projectTask)
				.values({
					projectId: p.id,
					label: requiredText(form, 'label', 'Tâche'),
					dueDate: date(form, 'dueDate', 'Échéance'),
					sortOrder: (last?.m ?? 0) + 1
				})
				.run();
			return { taskAdded: true };
		}),

	toggleTask: ({ request, params }) =>
		withForm(request, (form) => {
			const task = taskOf(loadProject(params.id).id, form);
			db.update(projectTask)
				.set({ done: !task.done, doneAt: task.done ? null : todayIso() })
				.where(eq(projectTask.id, task.id))
				.run();
		}),

	updateTask: ({ request, params }) =>
		withForm(request, (form) => {
			const task = taskOf(loadProject(params.id).id, form);
			db.update(projectTask)
				.set({
					label: requiredText(form, 'label', 'Tâche'),
					dueDate: date(form, 'dueDate', 'Échéance')
				})
				.where(eq(projectTask.id, task.id))
				.run();
		}),

	deleteTask: ({ request, params }) =>
		withForm(request, (form) => {
			const task = taskOf(loadProject(params.id).id, form);
			db.delete(projectTask).where(eq(projectTask.id, task.id)).run();
		}),

	addPhotos: ({ request, params }) =>
		withForm(request, async (form) => {
			const p = loadProject(params.id);
			const uploads = files(form, 'photos');
			if (!uploads.length) throw new FormError('Choisis au moins une photo.');
			const phase = oneOf(form, 'phase', PHOTO_PHASES, 'Étape');
			for (const file of uploads) {
				db.insert(photo)
					.values({ ...(await storePhoto(file)), projectId: p.id, phase })
					.run();
			}
			return { photosAdded: true };
		}),

	deletePhoto: ({ request, params }) =>
		withForm(request, async (form) => {
			const p = loadProject(params.id);
			const photoId = requiredInt(form, 'photoId', 'Photo');
			const owned = db
				.select({ id: photo.id })
				.from(photo)
				.where(and(eq(photo.id, photoId), eq(photo.projectId, p.id)))
				.get();
			if (owned) await deletePhoto(photoId);
		})
};
