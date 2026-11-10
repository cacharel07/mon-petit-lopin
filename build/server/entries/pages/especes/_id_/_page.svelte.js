import { a as head, i as ensure_array_like, l as attr, s as stringify, u as escape_html } from "../../../../chunks/server2.js";
import { t as TemplateForm } from "../../../../chunks/TemplateForm.js";
import { r as CARE_RULE_TYPE_LABELS } from "../../../../chunks/enums.js";
import { s as formatAge, u as formatWindow } from "../../../../chunks/dates.js";
// src/routes/especes/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("1l2zhn", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.template.commonName)} · Modèles · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/especes">← Modèles</a> <h1>${escape_html(data.template.commonName)}</h1> <h2>Calendrier d'entretien</h2> <ul class="list">`);
		const each_array = ensure_array_like(data.rules);
		if (each_array.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let r = each_array[$$index];
				$$renderer.push(`<li class="card rule svelte-1l2zhn"><div class="head svelte-1l2zhn"><strong>${escape_html(r.label)}</strong> `);
				if (!r.verified) $$renderer.push(`<!--[0--><span class="badge warning">à vérifier</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="muted small svelte-1l2zhn">${escape_html(CARE_RULE_TYPE_LABELS[r.type])} · ${escape_html(formatWindow(r))} `);
				if (r.intervalDays) $$renderer.push(`<!--[0-->· tous les ${escape_html(r.intervalDays)} jours`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (r.minAgeYears != null) $$renderer.push(`<!--[0-->· dès ${escape_html(formatAge(r.minAgeYears))}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (r.maxAgeYears != null) $$renderer.push(`<!--[0-->· avant ${escape_html(formatAge(r.maxAgeYears))}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				if (r.notes) $$renderer.push(`<!--[0--><p class="notes small svelte-1l2zhn">${escape_html(r.notes)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="actions svelte-1l2zhn"><a class="btn small svelte-1l2zhn"${attr("href", `/especes/${stringify(data.template.id)}/regles/${stringify(r.id)}`)}>Modifier</a> `);
				if (!r.verified) $$renderer.push(`<!--[0--><form method="POST" action="?/verifyRule"><input type="hidden" name="ruleId"${attr("value", r.id)}/> <button class="btn small svelte-1l2zhn" type="submit">✓ Valider</button></form>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucune règle.</li>`);
		$$renderer.push(`<!--]--></ul> <p><a class="btn"${attr("href", `/especes/${stringify(data.template.id)}/regles/nouvelle`)}>+ Ajouter une règle</a></p> <h2>Informations</h2> <form method="POST" action="?/update" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form && "saved" in form) $$renderer.push(`<!--[0--><p class="muted">Enregistré ✓</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		TemplateForm($$renderer, { values: form?.values ?? data.template });
		$$renderer.push(`<!----> <div class="actions svelte-1l2zhn"><button class="btn primary" type="submit">Enregistrer</button> <button class="btn danger" type="submit" formaction="?/delete" formnovalidate="">Supprimer le modèle</button></div></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map