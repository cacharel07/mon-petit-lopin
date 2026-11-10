import { i as redirect, t as error } from "../../../../../../chunks/exports.js";
import { t as parseCareRuleForm } from "../../../../../../chunks/care-rule-form.js";
import { n as db, r as careRule } from "../../../../../../chunks/db.js";
import { f as withForm } from "../../../../../../chunks/forms.js";
import { c as getTemplateRules, i as displayName, l as getTree } from "../../../../../../chunks/trees.js";
import { and, eq } from "drizzle-orm";
// src/routes/arbres/[id]/entretien/[ruleId]/+page.server.ts
var NEW = "nouvelle";
/**
* /arbres/:id/entretien/nouvelle             → new tree-only rule
* /arbres/:id/entretien/nouvelle?remplace=X  → customize template rule X
* /arbres/:id/entretien/:ruleId              → edit a rule owned by the tree
*/
function context(params, url) {
	const t = getTree(Number(params.id));
	if (!t) error(404, "Arbre introuvable");
	if (params.ruleId === NEW) {
		const replaces = url.searchParams.get("remplace");
		const templateRule = replaces ? getTemplateRules(t.speciesTemplateId).find((r) => r.id === Number(replaces)) : null;
		if (replaces && !templateRule) error(404, "Règle du modèle introuvable");
		return {
			tree: t,
			rule: null,
			templateRule: templateRule ?? null
		};
	}
	const rule = db.select().from(careRule).where(and(eq(careRule.id, Number(params.ruleId)), eq(careRule.treeId, t.id))).get();
	if (!rule) error(404, "Règle introuvable");
	return {
		tree: t,
		rule,
		templateRule: rule.overridesRuleId ? getTemplateRules(t.speciesTemplateId).find((r) => r.id === rule.overridesRuleId) ?? null : null
	};
}
var load = ({ params, url }) => {
	const { tree, rule, templateRule } = context(params, url);
	return {
		tree: {
			id: tree.id,
			name: displayName(tree)
		},
		rule,
		templateRule
	};
};
var actions = {
	save: ({ request, params, url }) => withForm(request, (form) => {
		const { tree, rule, templateRule } = context(params, url);
		const values = parseCareRuleForm(form);
		if (rule) db.update(careRule).set(values).where(eq(careRule.id, rule.id)).run();
		else {
			if (templateRule) db.delete(careRule).where(and(eq(careRule.treeId, tree.id), eq(careRule.overridesRuleId, templateRule.id))).run();
			db.insert(careRule).values({
				...values,
				treeId: tree.id,
				overridesRuleId: templateRule?.id ?? null
			}).run();
		}
		redirect(303, `/arbres/${tree.id}/entretien`);
	}),
	delete: ({ params, url }) => {
		const { tree, rule } = context(params, url);
		if (rule) db.delete(careRule).where(eq(careRule.id, rule.id)).run();
		redirect(303, `/arbres/${tree.id}/entretien`);
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map