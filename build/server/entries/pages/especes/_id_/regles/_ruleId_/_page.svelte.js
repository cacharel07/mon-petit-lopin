import { a as head, l as attr, s as stringify, u as escape_html } from "../../../../../../chunks/server2.js";
import { t as RuleForm } from "../../../../../../chunks/RuleForm.js";
// src/routes/especes/[id]/regles/[ruleId]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("55ilj0", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Règle · ${escape_html(data.template.commonName)} · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back"${attr("href", `/especes/${stringify(data.template.id)}`)}>← ${escape_html(data.template.commonName)}</a> <h1>${escape_html(data.rule ? "Modifier la règle" : "Nouvelle règle")}</h1> <p class="muted">Modèle « ${escape_html(data.template.commonName)} » : s'applique à tous les arbres de ce modèle qui ne l'ont pas personnalisée.</p> <form method="POST" action="?/save" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		RuleForm($$renderer, { values: form?.values ?? data.rule ?? {} });
		$$renderer.push(`<!----> <div class="actions"><button class="btn primary" type="submit">Enregistrer</button> `);
		if (data.rule) $$renderer.push(`<!--[0--><button class="btn danger" type="submit" formaction="?/delete" formnovalidate="">Supprimer</button>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map