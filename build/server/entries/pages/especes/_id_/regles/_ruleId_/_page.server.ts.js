import { i as redirect, t as error } from "../../../../../../chunks/exports.js";
import { t as parseCareRuleForm } from "../../../../../../chunks/care-rule-form.js";
import { n as db, r as careRule, u as speciesTemplate } from "../../../../../../chunks/db.js";
import { f as withForm } from "../../../../../../chunks/forms.js";
import { and, eq } from "drizzle-orm";
// src/routes/especes/[id]/regles/[ruleId]/+page.server.ts
var NEW = "nouvelle";
function context(params) {
	const template = db.select().from(speciesTemplate).where(eq(speciesTemplate.id, Number(params.id))).get();
	if (!template) error(404, "Modèle introuvable");
	if (params.ruleId === NEW) return {
		template,
		rule: null
	};
	const rule = db.select().from(careRule).where(and(eq(careRule.id, Number(params.ruleId)), eq(careRule.speciesTemplateId, template.id))).get();
	if (!rule) error(404, "Règle introuvable");
	return {
		template,
		rule
	};
}
var load = ({ params }) => context(params);
var actions = {
	save: ({ request, params }) => withForm(request, (form) => {
		const { template, rule } = context(params);
		const values = parseCareRuleForm(form);
		if (rule) db.update(careRule).set(values).where(eq(careRule.id, rule.id)).run();
		else db.insert(careRule).values({
			...values,
			speciesTemplateId: template.id
		}).run();
		redirect(303, `/especes/${template.id}`);
	}),
	delete: ({ params }) => {
		const { template, rule } = context(params);
		if (rule) db.delete(careRule).where(eq(careRule.id, rule.id)).run();
		redirect(303, `/especes/${template.id}`);
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map