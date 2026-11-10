import { and, asc, desc, eq, inArray, isNotNull, or } from 'drizzle-orm';
import { compareByWindowStart, resolveTreeRules } from '../domain/care-rules.ts';
import { db } from './db/index.ts';
import {
	careRule,
	intervention,
	photo,
	project,
	projectTree,
	speciesTemplate,
	tree,
	treePollinator,
	zone,
	type CareRule,
	type Photo,
	type Tree
} from './db/schema.ts';
import { deletePhotoFiles } from './photos.ts';

export const displayName = (t: Pick<Tree, 'nickname' | 'commonName' | 'variety'>) =>
	t.nickname ?? (t.variety ? `${t.commonName} ${t.variety}` : t.commonName);

export function listZones() {
	return db.select().from(zone).orderBy(asc(zone.sortOrder), asc(zone.name)).all();
}

export function listTemplates() {
	return db.select().from(speciesTemplate).orderBy(asc(speciesTemplate.commonName)).all();
}

export function getTree(id: number) {
	return db.select().from(tree).where(eq(tree.id, id)).get();
}

export function listTrees() {
	const rows = db
		.select({ tree, zoneName: zone.name })
		.from(tree)
		.leftJoin(zone, eq(tree.zoneId, zone.id))
		.orderBy(asc(tree.commonName), asc(tree.id))
		.all();

	// Latest photo of each tree, used as a cover.
	const photos = db
		.select()
		.from(photo)
		.where(isNotNull(photo.treeId))
		.orderBy(desc(photo.takenAt), desc(photo.id))
		.all();
	const cover = new Map<number, Photo>();
	for (const p of photos) if (p.treeId && !cover.has(p.treeId)) cover.set(p.treeId, p);

	return rows.map(({ tree: t, zoneName }) => ({
		...t,
		name: displayName(t),
		zoneName,
		coverThumb: cover.get(t.id)?.thumbName ?? null
	}));
}

export function getPollinatorIds(treeId: number): number[] {
	return db
		.select({ id: treePollinator.pollinatorTreeId })
		.from(treePollinator)
		.where(eq(treePollinator.treeId, treeId))
		.all()
		.map((r) => r.id);
}

/** Replace the pollinator links of a tree (links are kept symmetrical). */
export function setPollinators(treeId: number, pollinatorIds: number[]) {
	db.transaction((tx) => {
		tx.delete(treePollinator)
			.where(or(eq(treePollinator.treeId, treeId), eq(treePollinator.pollinatorTreeId, treeId)))
			.run();
		for (const other of new Set(pollinatorIds)) {
			if (other === treeId) continue;
			tx.insert(treePollinator).values({ treeId, pollinatorTreeId: other }).run();
			tx.insert(treePollinator).values({ treeId: other, pollinatorTreeId: treeId }).run();
		}
	});
}

export function getTemplateRules(templateId: number | null): CareRule[] {
	if (templateId == null) return [];
	return db
		.select()
		.from(careRule)
		.where(eq(careRule.speciesTemplateId, templateId))
		.orderBy(asc(careRule.startMonth), asc(careRule.startDay))
		.all();
}

export function getTreeOwnRules(treeId: number): CareRule[] {
	return db.select().from(careRule).where(eq(careRule.treeId, treeId)).all();
}

/** Every rule of the tree (inherited, overridden, hidden, own), sorted by window start. */
export function getResolvedRules(t: Tree) {
	return resolveTreeRules(getTemplateRules(t.speciesTemplateId), getTreeOwnRules(t.id)).sort(
		(a, b) => compareByWindowStart(a.rule, b.rule)
	);
}

/** Drop overrides that pointed to the rules of a previous species template. */
export function dropOverrides(treeId: number) {
	db.delete(careRule)
		.where(and(eq(careRule.treeId, treeId), isNotNull(careRule.overridesRuleId)))
		.run();
}

export function getTreeDetail(id: number) {
	const t = getTree(id);
	if (!t) return null;

	const z = t.zoneId ? db.select().from(zone).where(eq(zone.id, t.zoneId)).get() : undefined;
	const template = t.speciesTemplateId
		? db.select().from(speciesTemplate).where(eq(speciesTemplate.id, t.speciesTemplateId)).get()
		: undefined;

	const pollinatorIds = getPollinatorIds(id);
	const pollinators = pollinatorIds.length
		? db
				.select()
				.from(tree)
				.where(inArray(tree.id, pollinatorIds))
				.all()
				.map((p) => ({ id: p.id, name: displayName(p) }))
		: [];

	const interventions = db
		.select()
		.from(intervention)
		.where(eq(intervention.treeId, id))
		.orderBy(desc(intervention.date), desc(intervention.id))
		.all();
	const interventionPhotos = interventions.length
		? db
				.select()
				.from(photo)
				.where(
					inArray(
						photo.interventionId,
						interventions.map((i) => i.id)
					)
				)
				.orderBy(asc(photo.id))
				.all()
		: [];

	const photos = db
		.select()
		.from(photo)
		.where(eq(photo.treeId, id))
		.orderBy(desc(photo.takenAt), desc(photo.id))
		.all();

	const projects = db
		.select({ id: project.id, title: project.title, status: project.status })
		.from(projectTree)
		.innerJoin(project, eq(projectTree.projectId, project.id))
		.where(eq(projectTree.treeId, id))
		.all();

	return {
		tree: { ...t, name: displayName(t) },
		projects,
		zone: z ?? null,
		template: template ?? null,
		pollinators,
		rules: getResolvedRules(t),
		interventions: interventions.map((i) => ({
			...i,
			photos: interventionPhotos.filter((p) => p.interventionId === i.id)
		})),
		photos
	};
}

/** All photos attached to a tree or to its interventions. */
function treePhotos(treeId: number) {
	const interventionIds = db
		.select({ id: intervention.id })
		.from(intervention)
		.where(eq(intervention.treeId, treeId))
		.all()
		.map((r) => r.id);
	return db
		.select()
		.from(photo)
		.where(
			interventionIds.length
				? or(eq(photo.treeId, treeId), inArray(photo.interventionId, interventionIds))
				: eq(photo.treeId, treeId)
		)
		.all();
}

export async function deleteTree(treeId: number) {
	const photos = treePhotos(treeId);
	db.delete(tree).where(eq(tree.id, treeId)).run();
	await deletePhotoFiles(photos);
}

export async function deleteIntervention(interventionId: number) {
	const photos = db.select().from(photo).where(eq(photo.interventionId, interventionId)).all();
	db.delete(intervention).where(eq(intervention.id, interventionId)).run();
	await deletePhotoFiles(photos);
}

export async function deletePhoto(photoId: number) {
	const p = db.select().from(photo).where(eq(photo.id, photoId)).get();
	if (!p) return;
	db.delete(photo).where(eq(photo.id, photoId)).run();
	await deletePhotoFiles([p]);
}
