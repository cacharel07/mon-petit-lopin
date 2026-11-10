import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { effectiveRules } from '#lib/domain/care-rules.ts';
import { todayIso } from '#lib/domain/dates.ts';
import { CARE_RULE_TO_INTERVENTION } from '#lib/domain/enums.ts';
import { db } from '#lib/server/db/index.ts';
import { intervention, projectTask } from '#lib/server/db/schema.ts';
import { getTemplateRules, getTree, getTreeOwnRules } from '#lib/server/trees.ts';
import type { RequestHandler } from './$types';

const safeRedirect = (target: FormDataEntryValue | null) =>
	typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') ? target : '/';

/**
 * « Fait » button: records the intervention fulfilling a care rule (dated
 * today, linked to the rule) or ticks a project task, then goes back.
 */
export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const kind = form.get('kind');
	const today = todayIso();

	if (kind === 'care') {
		const t = getTree(Number(form.get('treeId')));
		if (!t || t.status !== 'planted') error(404, 'Arbre introuvable');
		const ruleId = Number(form.get('ruleId'));
		const rule = effectiveRules(getTemplateRules(t.speciesTemplateId), getTreeOwnRules(t.id)).find(
			(r) => r.id === ruleId
		);
		if (!rule) error(404, 'Règle introuvable');
		const notes = form.get('notes');
		db.insert(intervention)
			.values({
				treeId: t.id,
				careRuleId: rule.id,
				date: today,
				type: CARE_RULE_TO_INTERVENTION[rule.type],
				notes: typeof notes === 'string' && notes.trim() ? notes.trim() : rule.label
			})
			.run();
	} else if (kind === 'task') {
		db.update(projectTask)
			.set({ done: true, doneAt: today })
			.where(eq(projectTask.id, Number(form.get('taskId'))))
			.run();
	} else {
		error(400, 'Type inconnu');
	}

	redirect(303, safeRedirect(form.get('redirectTo')));
};
