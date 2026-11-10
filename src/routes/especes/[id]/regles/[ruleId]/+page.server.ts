import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { parseCareRuleForm } from '#lib/server/care-rule-form.ts';
import { db } from '#lib/server/db/index.ts';
import { careRule, speciesTemplate } from '#lib/server/db/schema.ts';
import { withForm } from '#lib/server/forms.ts';
import type { Actions, PageServerLoad } from './$types';

const NEW = 'nouvelle';

function context(params: { id: string; ruleId: string }) {
	const template = db
		.select()
		.from(speciesTemplate)
		.where(eq(speciesTemplate.id, Number(params.id)))
		.get();
	if (!template) error(404, 'Modèle introuvable');
	if (params.ruleId === NEW) return { template, rule: null };
	const rule = db
		.select()
		.from(careRule)
		.where(and(eq(careRule.id, Number(params.ruleId)), eq(careRule.speciesTemplateId, template.id)))
		.get();
	if (!rule) error(404, 'Règle introuvable');
	return { template, rule };
}

export const load: PageServerLoad = ({ params }) => context(params);

export const actions: Actions = {
	save: ({ request, params }) =>
		withForm(request, (form) => {
			const { template, rule } = context(params);
			const values = parseCareRuleForm(form);
			if (rule) db.update(careRule).set(values).where(eq(careRule.id, rule.id)).run();
			else
				db.insert(careRule)
					.values({ ...values, speciesTemplateId: template.id })
					.run();
			redirect(303, `/especes/${template.id}`);
		}),
	delete: ({ params }) => {
		const { template, rule } = context(params);
		// Tree overrides of this rule are removed by cascade.
		if (rule) db.delete(careRule).where(eq(careRule.id, rule.id)).run();
		redirect(303, `/especes/${template.id}`);
	}
};
