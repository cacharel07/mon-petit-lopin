// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { todayIso } from '#lib/domain/dates.ts';
import { datesForStatus } from '#lib/domain/projects.ts';
import { db } from '#lib/server/db/index.ts';
import { project } from '#lib/server/db/schema.ts';
import { withForm } from '#lib/server/forms.ts';
import { parseProjectForm, setProjectTrees } from '#lib/server/projects.ts';
import { listTrees, listZones } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

export const load = () => ({
	zones: listZones(),
	trees: listTrees().map((t) => ({ id: t.id, name: t.name }))
});

export const actions = {
	default: ({ request }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const { values, treeIds } = parseProjectForm(form);
			const dates = datesForStatus(values, 'planned', values.status, todayIso());
			const id = db
				.insert(project)
				.values({ ...values, ...dates })
				.returning({ id: project.id })
				.get().id;
			setProjectTrees(id, treeIds);
			redirect(303, `/travaux/${id}`);
		})
};
;null as any as PageServerLoad;;null as any as Actions;