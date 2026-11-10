import { a as photo, c as projectTree, d as tree, f as treePollinator, i as intervention, n as db, o as project, p as zone, r as careRule, u as speciesTemplate } from "./db.js";
import { n as deletePhotoFiles } from "./photos.js";
import { and, asc, desc, eq, inArray, isNotNull, or } from "drizzle-orm";
// src/lib/domain/care-rules.ts
/**
* Resolve the rules of a tree.
*
* Returns every template rule (possibly overridden or hidden) followed by the
* tree-specific rules. Use `effectiveRules` to keep only those that apply.
* Overrides pointing to a rule that is not in the template (e.g. after the
* tree's species changed) are ignored.
*/
function resolveTreeRules(templateRules, treeRules) {
	const overrides = /* @__PURE__ */ new Map();
	const extras = [];
	for (const rule of treeRules) if (rule.overridesRuleId != null) overrides.set(rule.overridesRuleId, rule);
	else extras.push(rule);
	const resolved = templateRules.map((templateRule) => {
		const override = overrides.get(templateRule.id);
		if (!override) return {
			rule: templateRule,
			source: "template",
			templateRule,
			hidden: false
		};
		return {
			rule: override,
			source: "override",
			templateRule,
			hidden: override.disabled
		};
	});
	for (const rule of extras) resolved.push({
		rule,
		source: "tree",
		templateRule: null,
		hidden: rule.disabled
	});
	return resolved;
}
/** The rules that actually apply to the tree (hidden ones removed). */
function effectiveRules(templateRules, treeRules) {
	return resolveTreeRules(templateRules, treeRules).filter((r) => !r.hidden).map((r) => r.rule);
}
/** Sort key so a calendar reads from January to December. */
function compareByWindowStart(a, b) {
	return a.startMonth - b.startMonth || a.startDay - b.startDay;
}
// src/lib/server/trees.ts
var displayName = (t) => t.nickname ?? (t.variety ? `${t.commonName} ${t.variety}` : t.commonName);
function listZones() {
	return db.select().from(zone).orderBy(asc(zone.sortOrder), asc(zone.name)).all();
}
function listTemplates() {
	return db.select().from(speciesTemplate).orderBy(asc(speciesTemplate.commonName)).all();
}
function getTree(id) {
	return db.select().from(tree).where(eq(tree.id, id)).get();
}
function listTrees() {
	const rows = db.select({
		tree,
		zoneName: zone.name
	}).from(tree).leftJoin(zone, eq(tree.zoneId, zone.id)).orderBy(asc(tree.commonName), asc(tree.id)).all();
	const photos = db.select().from(photo).where(isNotNull(photo.treeId)).orderBy(desc(photo.takenAt), desc(photo.id)).all();
	const cover = /* @__PURE__ */ new Map();
	for (const p of photos) if (p.treeId && !cover.has(p.treeId)) cover.set(p.treeId, p);
	return rows.map(({ tree: t, zoneName }) => ({
		...t,
		name: displayName(t),
		zoneName,
		coverThumb: cover.get(t.id)?.thumbName ?? null
	}));
}
function getPollinatorIds(treeId) {
	return db.select({ id: treePollinator.pollinatorTreeId }).from(treePollinator).where(eq(treePollinator.treeId, treeId)).all().map((r) => r.id);
}
/** Replace the pollinator links of a tree (links are kept symmetrical). */
function setPollinators(treeId, pollinatorIds) {
	db.transaction((tx) => {
		tx.delete(treePollinator).where(or(eq(treePollinator.treeId, treeId), eq(treePollinator.pollinatorTreeId, treeId))).run();
		for (const other of new Set(pollinatorIds)) {
			if (other === treeId) continue;
			tx.insert(treePollinator).values({
				treeId,
				pollinatorTreeId: other
			}).run();
			tx.insert(treePollinator).values({
				treeId: other,
				pollinatorTreeId: treeId
			}).run();
		}
	});
}
function getTemplateRules(templateId) {
	if (templateId == null) return [];
	return db.select().from(careRule).where(eq(careRule.speciesTemplateId, templateId)).orderBy(asc(careRule.startMonth), asc(careRule.startDay)).all();
}
function getTreeOwnRules(treeId) {
	return db.select().from(careRule).where(eq(careRule.treeId, treeId)).all();
}
/** Every rule of the tree (inherited, overridden, hidden, own), sorted by window start. */
function getResolvedRules(t) {
	return resolveTreeRules(getTemplateRules(t.speciesTemplateId), getTreeOwnRules(t.id)).sort((a, b) => compareByWindowStart(a.rule, b.rule));
}
/** Drop overrides that pointed to the rules of a previous species template. */
function dropOverrides(treeId) {
	db.delete(careRule).where(and(eq(careRule.treeId, treeId), isNotNull(careRule.overridesRuleId))).run();
}
function getTreeDetail(id) {
	const t = getTree(id);
	if (!t) return null;
	const z = t.zoneId ? db.select().from(zone).where(eq(zone.id, t.zoneId)).get() : void 0;
	const template = t.speciesTemplateId ? db.select().from(speciesTemplate).where(eq(speciesTemplate.id, t.speciesTemplateId)).get() : void 0;
	const pollinatorIds = getPollinatorIds(id);
	const pollinators = pollinatorIds.length ? db.select().from(tree).where(inArray(tree.id, pollinatorIds)).all().map((p) => ({
		id: p.id,
		name: displayName(p)
	})) : [];
	const interventions = db.select().from(intervention).where(eq(intervention.treeId, id)).orderBy(desc(intervention.date), desc(intervention.id)).all();
	const interventionPhotos = interventions.length ? db.select().from(photo).where(inArray(photo.interventionId, interventions.map((i) => i.id))).orderBy(asc(photo.id)).all() : [];
	const photos = db.select().from(photo).where(eq(photo.treeId, id)).orderBy(desc(photo.takenAt), desc(photo.id)).all();
	const projects = db.select({
		id: project.id,
		title: project.title,
		status: project.status
	}).from(projectTree).innerJoin(project, eq(projectTree.projectId, project.id)).where(eq(projectTree.treeId, id)).all();
	return {
		tree: {
			...t,
			name: displayName(t)
		},
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
function treePhotos(treeId) {
	const interventionIds = db.select({ id: intervention.id }).from(intervention).where(eq(intervention.treeId, treeId)).all().map((r) => r.id);
	return db.select().from(photo).where(interventionIds.length ? or(eq(photo.treeId, treeId), inArray(photo.interventionId, interventionIds)) : eq(photo.treeId, treeId)).all();
}
async function deleteTree(treeId) {
	const photos = treePhotos(treeId);
	db.delete(tree).where(eq(tree.id, treeId)).run();
	await deletePhotoFiles(photos);
}
async function deleteIntervention(interventionId) {
	const photos = db.select().from(photo).where(eq(photo.interventionId, interventionId)).all();
	db.delete(intervention).where(eq(intervention.id, interventionId)).run();
	await deletePhotoFiles(photos);
}
async function deletePhoto(photoId) {
	const p = db.select().from(photo).where(eq(photo.id, photoId)).get();
	if (!p) return;
	db.delete(photo).where(eq(photo.id, photoId)).run();
	await deletePhotoFiles([p]);
}
export { dropOverrides as a, getTemplateRules as c, getTreeOwnRules as d, listTemplates as f, effectiveRules as g, setPollinators as h, displayName as i, getTree as l, listZones as m, deletePhoto as n, getPollinatorIds as o, listTrees as p, deleteTree as r, getResolvedRules as s, deleteIntervention as t, getTreeDetail as u };

//# sourceMappingURL=trees.js.map