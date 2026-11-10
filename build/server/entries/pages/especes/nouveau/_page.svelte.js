import { a as head, u as escape_html } from "../../../../chunks/server2.js";
import { t as TemplateForm } from "../../../../chunks/TemplateForm.js";
// src/routes/especes/nouveau/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { form } = $$props;
		head("12bvfdx", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Nouveau modèle · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/especes">← Modèles</a> <h1>Nouveau modèle d'espèce</h1> <form method="POST" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		TemplateForm($$renderer, { values: form?.values });
		$$renderer.push(`<!----> <button class="btn primary" type="submit">Créer</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map