import { t as error } from "../../../../chunks/exports.js";
import { h as todayIso } from "../../../../chunks/dates.js";
import { o as PHOTO_PHASES, u as PROJECT_STATUSES } from "../../../../chunks/enums.js";
import { n as datesForStatus } from "../../../../chunks/projects.js";
import { a as photo, n as db, o as project, s as projectTask } from "../../../../chunks/db.js";
import { a as files, f as withForm, l as requiredInt, r as date, s as oneOf, t as FormError, u as requiredText } from "../../../../chunks/forms.js";
import { i as storePhoto } from "../../../../chunks/photos.js";
import { n as getProject, r as getProjectDetail } from "../../../../chunks/projects2.js";
import { n as deletePhoto } from "../../../../chunks/trees.js";
import { and, eq, max } from "drizzle-orm";
// src/routes/travaux/[id]/+page.server.ts
function loadProject(id) {
	const p = getProject(Number(id));
	if (!p) error(404, "Projet introuvable");
	return p;
}
var load = ({ params }) => {
	const detail = getProjectDetail(Number(params.id));
	if (!detail) error(404, "Projet introuvable");
	return {
		...detail,
		today: todayIso()
	};
};
function taskOf(projectId, form) {
	const taskId = requiredInt(form, "taskId", "Tâche");
	const task = db.select().from(projectTask).where(and(eq(projectTask.id, taskId), eq(projectTask.projectId, projectId))).get();
	if (!task) throw new FormError("Tâche introuvable.");
	return task;
}
var actions = {
	setStatus: ({ request, params }) => withForm(request, (form) => {
		const p = loadProject(params.id);
		const to = oneOf(form, "status", PROJECT_STATUSES, "Statut");
		db.update(project).set({
			status: to,
			...datesForStatus(p, p.status, to, todayIso())
		}).where(eq(project.id, p.id)).run();
	}),
	addTask: ({ request, params }) => withForm(request, (form) => {
		const p = loadProject(params.id);
		const last = db.select({ m: max(projectTask.sortOrder) }).from(projectTask).where(eq(projectTask.projectId, p.id)).get();
		db.insert(projectTask).values({
			projectId: p.id,
			label: requiredText(form, "label", "Tâche"),
			dueDate: date(form, "dueDate", "Échéance"),
			sortOrder: (last?.m ?? 0) + 1
		}).run();
		return { taskAdded: true };
	}),
	toggleTask: ({ request, params }) => withForm(request, (form) => {
		const task = taskOf(loadProject(params.id).id, form);
		db.update(projectTask).set({
			done: !task.done,
			doneAt: task.done ? null : todayIso()
		}).where(eq(projectTask.id, task.id)).run();
	}),
	updateTask: ({ request, params }) => withForm(request, (form) => {
		const task = taskOf(loadProject(params.id).id, form);
		db.update(projectTask).set({
			label: requiredText(form, "label", "Tâche"),
			dueDate: date(form, "dueDate", "Échéance")
		}).where(eq(projectTask.id, task.id)).run();
	}),
	deleteTask: ({ request, params }) => withForm(request, (form) => {
		const task = taskOf(loadProject(params.id).id, form);
		db.delete(projectTask).where(eq(projectTask.id, task.id)).run();
	}),
	addPhotos: ({ request, params }) => withForm(request, async (form) => {
		const p = loadProject(params.id);
		const uploads = files(form, "photos");
		if (!uploads.length) throw new FormError("Choisis au moins une photo.");
		const phase = oneOf(form, "phase", PHOTO_PHASES, "Étape");
		for (const file of uploads) db.insert(photo).values({
			...await storePhoto(file),
			projectId: p.id,
			phase
		}).run();
		return { photosAdded: true };
	}),
	deletePhoto: ({ request, params }) => withForm(request, async (form) => {
		const p = loadProject(params.id);
		const photoId = requiredInt(form, "photoId", "Photo");
		if (db.select({ id: photo.id }).from(photo).where(and(eq(photo.id, photoId), eq(photo.projectId, p.id))).get()) await deletePhoto(photoId);
	})
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map