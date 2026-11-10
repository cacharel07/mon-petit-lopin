import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, u as escape_html } from "../../../../chunks/server2.js";
import { f as SPECIES_CATEGORIES, p as SPECIES_CATEGORY_LABELS } from "../../../../chunks/enums.js";
import { t as TreeForm } from "../../../../chunks/TreeForm.js";
// src/lib/components/SpeciesPicker.svelte
function SpeciesPicker($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Own templates that do not come from the catalogue. */
		let { catalog, ownTemplates } = $$props;
		let query = "";
		const matches = (...texts) => !query.trim();
		const groups = derived(() => SPECIES_CATEGORIES.map((category) => ({
			category,
			entries: catalog.filter((e) => e.category === category && matches(e.commonName, e.latinName, ...e.varieties.map((v) => v.name)))
		})).filter((g) => g.entries.length));
		const own = derived(() => ownTemplates.filter((t) => matches(t.commonName, t.latinName)));
		$$renderer.push(`<input type="search"${attr("value", query)} placeholder="Rechercher une espèce ou une variété…" aria-label="Rechercher une espèce"/> `);
		if (own().length) {
			$$renderer.push(`<!--[0--><h2>Mes modèles</h2> <div class="grid svelte-jqgbhw"><!--[-->`);
			const each_array = ensure_array_like(own());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let t = each_array[$$index];
				$$renderer.push(`<a class="card choice svelte-jqgbhw"${attr("href", `?espece=modele-${stringify(t.id)}`)}><strong>${escape_html(t.commonName)}</strong> `);
				if (t.latinName) $$renderer.push(`<!--[0--><em class="muted svelte-jqgbhw">${escape_html(t.latinName)}</em>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(groups());
		for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
			let g = each_array_1[$$index_2];
			$$renderer.push(`<h2>${escape_html(SPECIES_CATEGORY_LABELS[g.category])}</h2> <div class="grid svelte-jqgbhw"><!--[-->`);
			const each_array_2 = ensure_array_like(g.entries);
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let e = each_array_2[$$index_1];
				$$renderer.push(`<a class="card choice svelte-jqgbhw"${attr("href", `?espece=${stringify(e.key)}`)}><strong>${escape_html(e.commonName)}</strong> <em class="muted svelte-jqgbhw">${escape_html(e.latinName)}</em> `);
				if (e.altitudeWarning) $$renderer.push(`<!--[0--><span class="badge warning svelte-jqgbhw">altitude</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (!groups().length && !own().length) $$renderer.push(`<!--[0--><p class="muted">Aucune espèce ne correspond.</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <p class="free svelte-jqgbhw"><a class="btn" href="?espece=libre">Autre espèce (saisie libre)</a></p>`);
	});
}
// src/routes/arbres/nouveau/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const values = derived(() => form?.values ?? data.values);
		head("2klb1m", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Nouvel arbre · Mon petit lopin</title>`);
			});
		});
		if (values()) {
			$$renderer.push(`<!--[0--><a class="back" href="/arbres/nouveau">← Choisir une autre espèce</a> <h1>Nouvel arbre</h1> <form method="POST" class="card stack">`);
			if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			TreeForm($$renderer, {
				values: values(),
				zones: data.zones,
				templates: data.templates,
				catalog: data.catalog,
				otherTrees: data.otherTrees
			});
			$$renderer.push(`<!----> <button class="btn primary" type="submit">Créer la fiche</button></form>`);
		} else {
			$$renderer.push(`<!--[-1--><a class="back" href="/arbres">← Arbres</a> <h1>Quelle espèce ?</h1> <p class="muted">La fiche et son calendrier d'entretien seront préremplis (valeurs « à vérifier »).</p> `);
			SpeciesPicker($$renderer, {
				catalog: data.catalog,
				ownTemplates: data.templates.filter((t) => !t.catalogKey)
			});
			$$renderer.push(`<!---->`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map