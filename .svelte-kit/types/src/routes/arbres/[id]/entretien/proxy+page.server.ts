// @ts-nocheck
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { careRule, speciesTemplate } from '#lib/server/db/schema.ts';
import { ruleFields } from '#lib/server/care-rule-form.ts';
import { requiredInt, withForm } from '#lib/server/forms.ts';
import { displayName, getResolvedRules, getTemplateRules, getTree } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function loadTree(id: string) {
	const t = getTree(Number(id));
	if (!t) error(404, 'Arbre introuvable');
	return t;
}

export const load = ({ params }: Parameters<PageServerLoad>[0]) => {
	const t = loadTree(params.id);
	const template = t.speciesTemplateId
		? db.select().from(speciesTemplate).where(eq(speciesTemplate.id, t.speciesTemplateId)).get()
		: undefined;
	return {
		tree: { id: t.id, name: displayName(t) },
		template: template ?? null,
		rules: getResolvedRules(t)
	};
};

export const actions = {
	/** Hide an inherited rule for this tree (creates a disabled override). */
	hide: ({ request, params }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const t = loadTree(params.id);
			const ruleId = requiredInt(form, 'ruleId', 'Règle');
			const templateRule = getTemplateRules(t.speciesTemplateId).find((r) => r.id === ruleId);
			if (!templateRule) error(404, 'Règle introuvable');
			db.delete(careRule)
				.where(and(eq(careRule.treeId, t.id), eq(careRule.overridesRuleId, ruleId)))
				.run();
			db.insert(careRule)
				.values({
					...ruleFields(templateRule),
					treeId: t.id,
					overridesRuleId: ruleId,
					disabled: true
				})
				.run();
		}),
	/** Back to the template rule: remove the override (hidden or customized). */
	reset: ({ request, params }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const t = loadTree(params.id);
			const ruleId = requiredInt(form, 'ruleId', 'Règle');
			db.delete(careRule)
				.where(and(eq(careRule.treeId, t.id), eq(careRule.overridesRuleId, ruleId)))
				.run();
		})
};
;null as any as Actions;