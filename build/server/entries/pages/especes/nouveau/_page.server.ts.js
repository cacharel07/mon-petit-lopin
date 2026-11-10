import { i as redirect } from "../../../../chunks/exports.js";
import { n as db, u as speciesTemplate } from "../../../../chunks/db.js";
import { f as withForm, t as FormError } from "../../../../chunks/forms.js";
import { t as parseTemplateForm } from "../../../../chunks/template-form.js";
// src/routes/especes/nouveau/+page.server.ts
var actions = { default: ({ request }) => withForm(request, (form) => {
	const values = parseTemplateForm(form);
	let id;
	try {
		id = db.insert(speciesTemplate).values(values).returning({ id: speciesTemplate.id }).get().id;
	} catch {
		throw new FormError(`Le modèle « ${values.commonName} » existe déjà.`);
	}
	redirect(303, `/especes/${id}`);
}) };
export { actions };

//# sourceMappingURL=_page.server.ts.js.map