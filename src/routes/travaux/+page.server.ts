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

export const load: PageServerLoad = ({ url }) => {
	const view = url.searchParams.get('vue') === 'kanban' ? 'kanban' : 'list';
	const param = url.searchParams.get('statut');
	const status = (PROJECT_STATUSES as readonly string[]).includes(param ?? '')
		? (param as ProjectStatus)
		: null;
	return { view, status, projects: listProjects(), today: todayIso() };
};

export const actions: Actions = {
	/** Move a project to another Kanban column. */
	move: ({ request }) =>
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
