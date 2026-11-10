// @ts-nocheck
import { count, eq, max } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { project, tree, zone } from '#lib/server/db/schema.ts';
import { FormError, requiredInt, requiredText, text, withForm } from '#lib/server/forms.ts';
import { listZones } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

export const load = () => {
	const treeCounts = new Map(
		db
			.select({ zoneId: tree.zoneId, n: count() })
			.from(tree)
			.groupBy(tree.zoneId)
			.all()
			.map((r) => [r.zoneId, r.n])
	);
	const projectCounts = new Map(
		db
			.select({ zoneId: project.zoneId, n: count() })
			.from(project)
			.groupBy(project.zoneId)
			.all()
			.map((r) => [r.zoneId, r.n])
	);
	return {
		zones: listZones().map((z) => ({
			...z,
			trees: treeCounts.get(z.id) ?? 0,
			projects: projectCounts.get(z.id) ?? 0
		}))
	};
};

function assertUniqueName(name: string, exceptId?: number) {
	const existing = db.select().from(zone).where(eq(zone.name, name)).get();
	if (existing && existing.id !== exceptId) throw new FormError(`La zone « ${name} » existe déjà.`);
}

export const actions = {
	create: ({ request }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const name = requiredText(form, 'name', 'Nom');
			assertUniqueName(name);
			const last = db
				.select({ m: max(zone.sortOrder) })
				.from(zone)
				.get();
			db.insert(zone)
				.values({ name, description: text(form, 'description'), sortOrder: (last?.m ?? 0) + 1 })
				.run();
		}),
	update: ({ request }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const id = requiredInt(form, 'id', 'Zone');
			const name = requiredText(form, 'name', 'Nom');
			assertUniqueName(name, id);
			db.update(zone)
				.set({ name, description: text(form, 'description') })
				.where(eq(zone.id, id))
				.run();
		}),
	delete: ({ request }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			db.delete(zone)
				.where(eq(zone.id, requiredInt(form, 'id', 'Zone')))
				.run();
		})
};
;null as any as PageServerLoad;;null as any as Actions;