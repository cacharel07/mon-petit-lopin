// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { db } from '#lib/server/db/index.ts';
import { speciesTemplate } from '#lib/server/db/schema.ts';
import { FormError, withForm } from '#lib/server/forms.ts';
import { parseTemplateForm } from '#lib/server/template-form.ts';
import type { Actions } from './$types';

export const actions = {
	default: ({ request }: import('./$types').RequestEvent) =>
		withForm(request, (form) => {
			const values = parseTemplateForm(form);
			let id: number;
			try {
				id = db
					.insert(speciesTemplate)
					.values(values)
					.returning({ id: speciesTemplate.id })
					.get().id;
			} catch {
				throw new FormError(`Le modèle « ${values.commonName} » existe déjà.`);
			}
			redirect(303, `/especes/${id}`);
		})
};
;null as any as Actions;