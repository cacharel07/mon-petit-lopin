import { a as head, l as attr, r as derived, s as stringify, u as escape_html } from "../../../../../../chunks/server2.js";
import { t as RuleForm } from "../../../../../../chunks/RuleForm.js";
// src/routes/arbres/[id]/entretien/[ruleId]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const isOverride = derived(() => data.templateRule != null);
		const title = derived(() => data.rule ? "Modifier la règle" : isOverride() ? "Personnaliser la règle" : "Nouvelle règle");
		head("vqun9", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(title())} · ${escape_html(data.tree.name)} · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back"${attr("href", `/arbres/${stringify(data.tree.id)}/entretien`)}>← Calendrier de ${escape_html(data.tree.name)}</a> <h1>${escape_html(title())}</h1> `);
		if (isOverride()) $$renderer.push(`<!--[0--><p class="muted">Ces valeurs remplacent la règle « ${escape_html(data.templateRule?.label)} » du modèle, pour ${escape_html(data.tree.name)}
		seulement.</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST"${attr("action", !data.rule && data.templateRule ? `?/save&remplace=${data.templateRule.id}` : "?/save")} class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		RuleForm($$renderer, { values: form?.values ?? data.rule ?? data.templateRule ?? {} });
		$$renderer.push(`<!----> <div class="actions"><button class="btn primary" type="submit">Enregistrer</button> `);
		if (data.rule) $$renderer.push(`<!--[0--><button class="btn danger" type="submit" formaction="?/delete" formnovalidate="">${escape_html(isOverride() ? "Revenir au modèle" : "Supprimer")}</button>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map