import { t as error } from "../../../../../chunks/exports.js";
import { n as db, r as careRule, u as speciesTemplate } from "../../../../../chunks/db.js";
import { n as ruleFields } from "../../../../../chunks/care-rule-form.js";
import { f as withForm, l as requiredInt } from "../../../../../chunks/forms.js";
import { c as getTemplateRules, i as displayName, l as getTree, s as getResolvedRules } from "../../../../../chunks/trees.js";
import { and, eq } from "drizzle-orm";
// src/routes/arbres/[id]/entretien/+page.server.ts
function loadTree(id) {
	const t = getTree(Number(id));
	if (!t) error(404, "Arbre introuvable");
	return t;
}
var load = ({ params }) => {
	const t = loadTree(params.id);
	const template = t.speciesTemplateId ? db.select().from(speciesTemplate).where(eq(speciesTemplate.id, t.speciesTemplateId)).get() : void 0;
	return {
		tree: {
			id: t.id,
			name: displayName(t)
		},
		template: template ?? null,
		rules: getResolvedRules(t)
	};
};
var actions = {
	/** Hide an inherited rule for this tree (creates a disabled override). */
	hide: ({ request, params }) => withForm(request, (form) => {
		const t = loadTree(params.id);
		const ruleId = requiredInt(form, "ruleId", "Règle");
		const templateRule = getTemplateRules(t.speciesTemplateId).find((r) => r.id === ruleId);
		if (!templateRule) error(404, "Règle introuvable");
		db.delete(careRule).where(and(eq(careRule.treeId, t.id), eq(careRule.overridesRuleId, ruleId))).run();
		db.insert(careRule).values({
			...ruleFields(templateRule),
			treeId: t.id,
			overridesRuleId: ruleId,
			disabled: true
		}).run();
	}),
	/** Back to the template rule: remove the override (hidden or customized). */
	reset: ({ request, params }) => withForm(request, (form) => {
		const t = loadTree(params.id);
		const ruleId = requiredInt(form, "ruleId", "Règle");
		db.delete(careRule).where(and(eq(careRule.treeId, t.id), eq(careRule.overridesRuleId, ruleId))).run();
	})
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map