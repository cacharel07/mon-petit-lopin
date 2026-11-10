import { a as head, u as escape_html } from "../../../../chunks/server2.js";
import { t as ProjectForm } from "../../../../chunks/ProjectForm.js";
// src/routes/travaux/nouveau/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("1uvuwyg", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Nouveau projet · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/travaux">← Travaux</a> <h1>Nouveau projet</h1> <form method="POST" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		ProjectForm($$renderer, {
			values: form?.values,
			zones: data.zones,
			trees: data.trees
		});
		$$renderer.push(`<!----> <button class="btn primary" type="submit">Créer</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map