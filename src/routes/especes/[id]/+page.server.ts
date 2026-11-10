import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { careRule, speciesTemplate } from '#lib/server/db/schema.ts';
import { FormError, requiredInt, withForm } from '#lib/server/forms.ts';
import { parseTemplateForm } from '#lib/server/template-form.ts';
import { getTemplateRules } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

function getTemplate(id: number) {
	const t = db.select().from(speciesTemplate).where(eq(speciesTemplate.id, id)).get();
	if (!t) error(404, 'Modèle introuvable');
	return t;
}

export const load: PageServerLoad = ({ params }) => {
	const template = getTemplate(Number(params.id));
	return { template, rules: getTemplateRules(template.id) };
};

const ruleOfTemplate = (templateId: number, ruleId: number) =>
	and(eq(careRule.id, ruleId), eq(careRule.speciesTemplateId, templateId));

export const actions: Actions = {
	update: ({ request, params }) =>
		withForm(request, (form) => {
			const id = getTemplate(Number(params.id)).id;
			const values = parseTemplateForm(form);
			try {
				db.update(speciesTemplate).set(values).where(eq(speciesTemplate.id, id)).run();
			} catch {
				throw new FormError(`Le modèle « ${values.commonName} » existe déjà.`);
			}
			return { saved: true };
		}),
	verifyRule: ({ request, params }) =>
		withForm(request, (form) => {
			const ruleId = requiredInt(form, 'ruleId', 'Règle');
			db.update(careRule)
				.set({ verified: true })
				.where(ruleOfTemplate(Number(params.id), ruleId))
				.run();
		}),
	delete: ({ params }) => {
		// Trees keep their own rules; their link to the template is set to null.
		db.delete(speciesTemplate)
			.where(eq(speciesTemplate.id, Number(params.id)))
			.run();
		redirect(303, '/especes');
	}
};
