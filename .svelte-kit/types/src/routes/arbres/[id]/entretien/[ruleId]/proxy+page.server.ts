// @ts-nocheck
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { parseCareRuleForm } from '#lib/server/care-rule-form.ts';
import { db } from '#lib/server/db/index.ts';
import { careRule } from '#lib/server/db/schema.ts';
import { withForm } from '#lib/server/forms.ts';
import { displayName, getTemplateRules, getTree } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

const NEW = 'nouvelle';

/**
 * /arbres/:id/entretien/nouvelle             → new tree-only rule
 * /arbres/:id/entretien/nouvelle?remplace=X  → customize template rule X
 * /arbres/:id/entretien/:ruleId              → edit a rule owned by the tree
 */
function context(params: { id: string; ruleId: string }, url: URL) {
	const t = getTree(Number(params.id));
	if (!t) error(404, 'Arbre introuvable');

	if (params.ruleId === NEW) {
		const replaces = url.searchParams.get('remplace');
		const templateRule = replaces
			? getTemplateRules(t.speciesTemplateId).find((r) => r.id === Number(replaces))
			: null;
		if (replaces && !templateRule) error(404, 'Règle du modèle introuvable');
		return { tree: t, rule: null, templateRule: templateRule ?? null };
	}

	const rule = db
		.select()
		.from(careRule)
		.where(and(eq(careRule.id, Number(params.ruleId)), eq(careRule.treeId, t.id)))
		.get();
	if (!rule) error(404, 'Règle introuvable');
	const templateRule = rule.overridesRuleId
		? (getTemplateRules(t.speciesTemplateId).find((r) => r.id === rule.overridesRuleId) ?? null)
		: null;
	return { tree: t, rule, templateRule };
}

export const load = ({ params, url }: Parameters<PageServerLoad>[0]) => {
	const { tree, rule, templateRule } = context(params, url);
	return { tree: { id: tree.id, name: displayName(tree) }, rule, templateRule };
};

export const actions = {
	save: ({ request, params, url }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const { tree, rule, templateRule } = context(params, url);
			const values = parseCareRuleForm(form);
			if (rule) {
				db.update(careRule).set(values).where(eq(careRule.id, rule.id)).run();
			} else {
				if (templateRule) {
					db.delete(careRule)
						.where(and(eq(careRule.treeId, tree.id), eq(careRule.overridesRuleId, templateRule.id)))
						.run();
				}
				db.insert(careRule)
					.values({ ...values, treeId: tree.id, overridesRuleId: templateRule?.id ?? null })
					.run();
			}
			redirect(303, `/arbres/${tree.id}/entretien`);
		}),
	delete: ({ params, url }: import('./$types').RequestEvent) => {
		const { tree, rule } = context(params, url);
		if (rule) db.delete(careRule).where(eq(careRule.id, rule.id)).run();
		redirect(303, `/arbres/${tree.id}/entretien`);
	}
};
;null as any as Actions;