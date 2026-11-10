import { i as redirect, t as error } from "../../../../chunks/exports.js";
import { n as db, r as careRule, u as speciesTemplate } from "../../../../chunks/db.js";
import { f as withForm, l as requiredInt, t as FormError } from "../../../../chunks/forms.js";
import { t as parseTemplateForm } from "../../../../chunks/template-form.js";
import { c as getTemplateRules } from "../../../../chunks/trees.js";
import { and, eq } from "drizzle-orm";
// src/routes/especes/[id]/+page.server.ts
function getTemplate(id) {
	const t = db.select().from(speciesTemplate).where(eq(speciesTemplate.id, id)).get();
	if (!t) error(404, "Modèle introuvable");
	return t;
}
var load = ({ params }) => {
	const template = getTemplate(Number(params.id));
	return {
		template,
		rules: getTemplateRules(template.id)
	};
};
var ruleOfTemplate = (templateId, ruleId) => and(eq(careRule.id, ruleId), eq(careRule.speciesTemplateId, templateId));
var actions = {
	update: ({ request, params }) => withForm(request, (form) => {
		const id = getTemplate(Number(params.id)).id;
		const values = parseTemplateForm(form);
		try {
			db.update(speciesTemplate).set(values).where(eq(speciesTemplate.id, id)).run();
		} catch {
			throw new FormError(`Le modèle « ${values.commonName} » existe déjà.`);
		}
		return { saved: true };
	}),
	verifyRule: ({ request, params }) => withForm(request, (form) => {
		const ruleId = requiredInt(form, "ruleId", "Règle");
		db.update(careRule).set({ verified: true }).where(ruleOfTemplate(Number(params.id), ruleId)).run();
	}),
	delete: ({ params }) => {
		db.delete(speciesTemplate).where(eq(speciesTemplate.id, Number(params.id))).run();
		redirect(303, "/especes");
	}
};
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map