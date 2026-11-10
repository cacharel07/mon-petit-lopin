import { a as head, i as ensure_array_like, l as attr, s as stringify, t as attr_class, u as escape_html } from "../../../../../chunks/server2.js";
import { r as CARE_RULE_TYPE_LABELS } from "../../../../../chunks/enums.js";
import { s as formatAge, u as formatWindow } from "../../../../../chunks/dates.js";
// src/routes/arbres/[id]/entretien/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const SOURCE_LABELS = {
			template: "du modèle",
			override: "personnalisée",
			tree: "propre à l’arbre"
		};
		head("pyvifn", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Entretien · ${escape_html(data.tree.name)} · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back"${attr("href", `/arbres/${stringify(data.tree.id)}`)}>← ${escape_html(data.tree.name)}</a> <h1>Calendrier d'entretien</h1> <p class="muted">`);
		if (data.template) $$renderer.push(`<!--[0-->Les règles viennent du modèle « <a${attr("href", `/especes/${stringify(data.template.id)}`)}>${escape_html(data.template.commonName)}</a> ». Tu peux personnaliser ou masquer une règle pour cet arbre seulement, ou ajouter des règles propres
		à l'arbre.`);
		else $$renderer.push(`<!--[-1-->Cet arbre n'a pas de modèle d'espèce : ajoute ses règles ci-dessous.`);
		$$renderer.push(`<!--]--></p> <ul class="list">`);
		const each_array = ensure_array_like(data.rules);
		if (each_array.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let r = each_array[$$index];
				const rule = r.rule;
				$$renderer.push(`<li${attr_class("card rule svelte-pyvifn", void 0, { "hidden": r.hidden })}><div class="head svelte-pyvifn"><strong class="svelte-pyvifn">${escape_html(rule.label)}</strong> <span class="badges svelte-pyvifn"><span class="badge">${escape_html(r.hidden ? "masquée" : SOURCE_LABELS[r.source])}</span> `);
				if (!rule.verified && !r.hidden) $$renderer.push(`<!--[0--><span class="badge warning">à vérifier</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></span></div> <div class="muted small svelte-pyvifn">${escape_html(CARE_RULE_TYPE_LABELS[rule.type])} · ${escape_html(formatWindow(rule))} `);
				if (rule.intervalDays) $$renderer.push(`<!--[0-->· tous les ${escape_html(rule.intervalDays)} jours`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (rule.minAgeYears != null) $$renderer.push(`<!--[0-->· dès ${escape_html(formatAge(rule.minAgeYears))}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (rule.maxAgeYears != null) $$renderer.push(`<!--[0-->· avant ${escape_html(formatAge(rule.maxAgeYears))}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="actions svelte-pyvifn">`);
				if (r.source === "template") $$renderer.push(`<!--[0--><a class="btn small svelte-pyvifn"${attr("href", `/arbres/${stringify(data.tree.id)}/entretien/nouvelle?remplace=${stringify(rule.id)}`)}>Personnaliser</a> <form method="POST" action="?/hide"><input type="hidden" name="ruleId"${attr("value", rule.id)}/> <button class="btn small svelte-pyvifn" type="submit">Masquer</button></form>`);
				else if (r.source === "override") {
					$$renderer.push("<!--[1-->");
					if (!r.hidden) $$renderer.push(`<!--[0--><a class="btn small svelte-pyvifn"${attr("href", `/arbres/${stringify(data.tree.id)}/entretien/${stringify(rule.id)}`)}>Modifier</a>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <form method="POST" action="?/reset"><input type="hidden" name="ruleId"${attr("value", r.templateRule?.id)}/> <button class="btn small svelte-pyvifn" type="submit">Revenir au modèle</button></form>`);
				} else $$renderer.push(`<!--[-1--><a class="btn small svelte-pyvifn"${attr("href", `/arbres/${stringify(data.tree.id)}/entretien/${stringify(rule.id)}`)}>Modifier</a>`);
				$$renderer.push(`<!--]--></div></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucune règle.</li>`);
		$$renderer.push(`<!--]--></ul> <p><a class="btn"${attr("href", `/arbres/${stringify(data.tree.id)}/entretien/nouvelle`)}>+ Ajouter une règle</a></p>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map