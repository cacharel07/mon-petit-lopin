import { a as head, l as attr, s as stringify, u as escape_html } from "../../../../../chunks/server2.js";
import { t as TreeForm } from "../../../../../chunks/TreeForm.js";
// src/routes/arbres/[id]/modifier/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("1di2cyy", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Modifier · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back"${attr("href", `/arbres/${stringify(data.tree.id)}`)}>← Retour à la fiche</a> <h1>Modifier la fiche</h1> <form method="POST" action="?/save" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		TreeForm($$renderer, {
			values: form?.values ?? data.tree,
			zones: data.zones,
			templates: data.templates,
			catalog: data.catalog,
			otherTrees: data.otherTrees,
			pollinatorIds: data.pollinatorIds
		});
		$$renderer.push(`<!----> <p class="muted small svelte-1di2cyy">Changer de modèle d'espèce supprime les personnalisations des règles héritées (les règles
		propres à l'arbre sont conservées).</p> <div class="actions"><button class="btn primary" type="submit">Enregistrer</button></div> <hr class="svelte-1di2cyy"/> <button class="btn danger" type="submit" formaction="?/delete" formnovalidate="">Supprimer l'arbre</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map