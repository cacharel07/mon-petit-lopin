// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { todayIso } from '#lib/domain/dates.ts';
import { PROJECT_STATUSES, type ProjectStatus } from '#lib/domain/enums.ts';
import { datesForStatus } from '#lib/domain/projects.ts';
import { db } from '#lib/server/db/index.ts';
import { project } from '#lib/server/db/schema.ts';
import { oneOf, requiredInt, withForm } from '#lib/server/forms.ts';
import { getProject, listProjects } from '#lib/server/projects.ts';
import type { Actions, PageServerLoad } from './$types';

export const load = ({ url }: Parameters<PageServerLoad>[0]) => {
	const view = url.searchParams.get('vue') === 'kanban' ? 'kanban' : 'list';
	const param = url.searchParams.get('statut');
	const status = (PROJECT_STATUSES as readonly string[]).includes(param ?? '')
		? (param as ProjectStatus)
		: null;
	return { view, status, projects: listProjects(), today: todayIso() };
};

export const actions = {
	/** Move a project to another Kanban column. */
	move: ({ request }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const p = getProject(requiredInt(form, 'id', 'Projet'));
			if (!p) return;
			const to = oneOf(form, 'status', PROJECT_STATUSES, 'Statut');
			db.update(project)
				.set({ status: to, ...datesForStatus(p, p.status, to, todayIso()) })
				.where(eq(project.id, p.id))
				.run();
			redirect(303, '/travaux?vue=kanban');
		})
};
;null as any as Actions;