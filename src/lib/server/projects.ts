import { asc, desc, eq, inArray, isNotNull } from 'drizzle-orm';
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from '../domain/enums.ts';
import { parseEuros, projectProgress } from '../domain/projects.ts';
import { db } from './db/index.ts';
import { photo, project, projectTask, projectTree, tree, zone, type Photo } from './db/schema.ts';
import { FormError, date, int, oneOf, requiredText, text } from './forms.ts';
import { deletePhotoFiles } from './photos.ts';
import { displayName } from './trees.ts';

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 } as const;

export function listProjects() {
	const rows = db
		.select({ project, zoneName: zone.name })
		.from(project)
		.leftJoin(zone, eq(project.zoneId, zone.id))
		.orderBy(asc(project.kanbanOrder), desc(project.id))
		.all();
	const tasks = db.select().from(projectTask).all();
	const photos = db
		.select()
		.from(photo)
		.where(isNotNull(photo.projectId))
		.orderBy(desc(photo.takenAt), desc(photo.id))
		.all();
	const cover = new Map<number, Photo>();
	for (const p of photos) if (p.projectId && !cover.has(p.projectId)) cover.set(p.projectId, p);

	return rows
		.map(({ project: p, zoneName }) => {
			const own = tasks.filter((t) => t.projectId === p.id);
			return {
				...p,
				zoneName,
				taskCount: own.length,
				doneCount: own.filter((t) => t.done).length,
				progress: projectProgress(own, p.status),
				coverThumb: cover.get(p.id)?.thumbName ?? null
			};
		})
		.sort(
			(a, b) =>
				PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
				(a.plannedEnd ?? '9999').localeCompare(b.plannedEnd ?? '9999') ||
				b.id - a.id
		);
}

export function getProject(id: number) {
	return db.select().from(project).where(eq(project.id, id)).get();
}

export function getProjectTreeIds(projectId: number) {
	return db
		.select({ id: projectTree.treeId })
		.from(projectTree)
		.where(eq(projectTree.projectId, projectId))
		.all()
		.map((r) => r.id);
}

export function setProjectTrees(projectId: number, treeIds: number[]) {
	db.transaction((tx) => {
		tx.delete(projectTree).where(eq(projectTree.projectId, projectId)).run();
		for (const treeId of new Set(treeIds)) {
			tx.insert(projectTree).values({ projectId, treeId }).run();
		}
	});
}

export function getProjectDetail(id: number) {
	const p = getProject(id);
	if (!p) return null;
	const z = p.zoneId ? db.select().from(zone).where(eq(zone.id, p.zoneId)).get() : undefined;
	const tasks = db
		.select()
		.from(projectTask)
		.where(eq(projectTask.projectId, id))
		.orderBy(asc(projectTask.done), asc(projectTask.sortOrder), asc(projectTask.id))
		.all();
	const treeIds = getProjectTreeIds(id);
	const trees = treeIds.length
		? db
				.select()
				.from(tree)
				.where(inArray(tree.id, treeIds))
				.all()
				.map((t) => ({ id: t.id, name: displayName(t), status: t.status }))
		: [];
	const photos = db
		.select()
		.from(photo)
		.where(eq(photo.projectId, id))
		.orderBy(asc(photo.takenAt), asc(photo.id))
		.all();
	return {
		project: p,
		zone: z ?? null,
		tasks,
		trees,
		photos,
		progress: projectProgress(tasks, p.status)
	};
}

export async function deleteProject(id: number) {
	const photos = db.select().from(photo).where(eq(photo.projectId, id)).all();
	db.delete(project).where(eq(project.id, id)).run();
	await deletePhotoFiles(photos);
}

function euros(form: FormData, name: string, label: string): number | null {
	const cents = parseEuros(text(form, name));
	if (cents !== null && Number.isNaN(cents))
		throw new FormError(`« ${label} » n'est pas un montant valide.`);
	return cents;
}

export function parseProjectForm(form: FormData) {
	const values = {
		title: requiredText(form, 'title', 'Titre'),
		description: text(form, 'description'),
		zoneId: int(form, 'zoneId', 'Zone'),
		status: oneOf(form, 'status', PROJECT_STATUSES, 'Statut'),
		priority: oneOf(form, 'priority', PROJECT_PRIORITIES, 'Priorité'),
		plannedStart: date(form, 'plannedStart', 'Début prévu'),
		plannedEnd: date(form, 'plannedEnd', 'Fin prévue'),
		actualStart: date(form, 'actualStart', 'Début réel'),
		actualEnd: date(form, 'actualEnd', 'Fin réelle'),
		budgetEstimatedCents: euros(form, 'budgetEstimated', 'Budget estimé'),
		budgetActualCents: euros(form, 'budgetActual', 'Coût réel'),
		notes: text(form, 'notes')
	};
	if (values.plannedStart && values.plannedEnd && values.plannedEnd < values.plannedStart) {
		throw new FormError('La fin prévue est avant le début prévu.');
	}
	if (values.actualStart && values.actualEnd && values.actualEnd < values.actualStart) {
		throw new FormError('La fin réelle est avant le début réel.');
	}
	const treeIds = form
		.getAll('treeIds')
		.map(Number)
		.filter((n) => Number.isInteger(n));
	return { values, treeIds };
}
