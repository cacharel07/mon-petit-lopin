import { d as tree, n as db, o as project, p as zone } from "../../../chunks/db.js";
import { d as text, f as withForm, l as requiredInt, t as FormError, u as requiredText } from "../../../chunks/forms.js";
import { m as listZones } from "../../../chunks/trees.js";
import { count, eq, max } from "drizzle-orm";
// src/routes/zones/+page.server.ts
var load = () => {
	const treeCounts = new Map(db.select({
		zoneId: tree.zoneId,
		n: count()
	}).from(tree).groupBy(tree.zoneId).all().map((r) => [r.zoneId, r.n]));
	const projectCounts = new Map(db.select({
		zoneId: project.zoneId,
		n: count()
	}).from(project).groupBy(project.zoneId).all().map((r) => [r.zoneId, r.n]));
	return { zones: listZones().map((z) => ({
		...z,
		trees: treeCounts.get(z.id) ?? 0,
		projects: projectCounts.get(z.id) ?? 0
	})) };
};
function assertUniqueName(name, exceptId) {
	const existing = db.select().from(zone).where(eq(zone.name, name)).get();
	if (existing && existing.id !== exceptId) throw new FormError(`La zone « ${name} » existe déjà.`);
}
var actions = {
	create: ({ request }) => withForm(request, (form) => {
		const name = requiredText(form, "name", "Nom");
		assertUniqueName(name);
		const last = db.select({ m: max(zone.sortOrder) }).from(zone).get();
		db.insert(zone).values({
			name,
			description: text(form, "description"),
			sortOrder: (last?.m ?? 0) + 1
		}).run();
	}),
	update: ({ request }) => withForm(request, (form) => {
		const id = requiredInt(form, "id", "Zone");
		const name = requiredText(form, "name", "Nom");
		assertUniqueName(name, id);
		db.update(zone).set({
			name,
			description: text(form, "description")
		}).where(eq(zone.id, id)).run();
	}),
	delete: ({ request }) => withForm(request, (form) => {
		db.delete(zone).where(eq(zone.id, requiredInt(form, "id", "Zone"))).run();
	})
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map