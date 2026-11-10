// @ts-nocheck
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { todayIso } from '#lib/domain/dates.ts';
import { datesForStatus } from '#lib/domain/projects.ts';
import { db } from '#lib/server/db/index.ts';
import { project } from '#lib/server/db/schema.ts';
import { withForm } from '#lib/server/forms.ts';
import {
	deleteProject,
	getProject,
	getProjectTreeIds,
	parseProjectForm,
	setProjectTrees
} from '#lib/server/projects.ts';
import { listTrees, listZones } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function loadProject(id: string) {
	const p = getProject(Number(id));
	if (!p) error(404, 'Projet introuvable');
	return p;
}

export const load = ({ params }: Parameters<PageServerLoad>[0]) => {
	const p = loadProject(params.id);
	return {
		project: p,
		treeIds: getProjectTreeIds(p.id),
		zones: listZones(),
		trees: listTrees().map((t) => ({ id: t.id, name: t.name }))
	};
};

export const actions = {
	save: ({ request, params }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const p = loadProject(params.id);
			const { values, treeIds } = parseProjectForm(form);
			// When the status changes, fill in the actual dates left empty.
			const dates =
				values.status !== p.status
					? datesForStatus(values, p.status, values.status, todayIso())
					: {};
			db.update(project)
				.set({ ...values, ...dates })
				.where(eq(project.id, p.id))
				.run();
			setProjectTrees(p.id, treeIds);
			redirect(303, `/travaux/${p.id}`);
		}),
	delete: async ({ params }: import('./$types').RequestEvent) => {
		await deleteProject(loadProject(params.id).id);
		redirect(303, '/travaux');
	}
};
;null as any as Actions;