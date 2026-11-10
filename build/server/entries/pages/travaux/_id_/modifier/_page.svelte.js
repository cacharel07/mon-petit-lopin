import { a as head, l as attr, s as stringify, u as escape_html } from "../../../../../chunks/server2.js";
import { t as ProjectForm } from "../../../../../chunks/ProjectForm.js";
// src/routes/travaux/[id]/modifier/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("u26f6g", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Modifier · ${escape_html(data.project.title)} · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back"${attr("href", `/travaux/${stringify(data.project.id)}`)}>← ${escape_html(data.project.title)}</a> <h1>Modifier le projet</h1> <form method="POST" action="?/save" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		ProjectForm($$renderer, {
			values: form?.values ?? data.project,
			zones: data.zones,
			trees: data.trees,
			treeIds: data.treeIds
		});
		$$renderer.push(`<!----> <button class="btn primary" type="submit">Enregistrer</button> <hr class="svelte-u26f6g"/> <button class="btn danger" type="submit" formaction="?/delete" formnovalidate="">Supprimer le projet</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map