import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, u as escape_html } from "../../../chunks/server2.js";
import { f as SPECIES_CATEGORIES, p as SPECIES_CATEGORY_LABELS } from "../../../chunks/enums.js";
// src/routes/especes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const catalogGroups = derived(() => SPECIES_CATEGORIES.map((category) => ({
			category,
			entries: data.catalog.filter((e) => e.category === category)
		})).filter((g) => g.entries.length));
		head("qsbwub", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Modèles d'espèces · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/plus">← Plus</a> <div class="page-header"><h1>Modèles d'espèces</h1> <a class="btn primary small svelte-qsbwub" href="/especes/nouveau">+ Nouveau</a></div> <p class="muted">Chaque modèle préremplit le calendrier d'entretien des arbres de cette espèce. Les valeurs
	proposées sont marquées « à vérifier » tant que tu ne les as pas validées.</p> <ul class="list">`);
		const each_array = ensure_array_like(data.templates);
		if (each_array.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let t = each_array[$$index];
				$$renderer.push(`<li><a class="card item svelte-qsbwub"${attr("href", `/especes/${stringify(t.id)}`)}><div><strong>${escape_html(t.commonName)}</strong> `);
				if (t.latinName) $$renderer.push(`<!--[0--><em class="muted">${escape_html(t.latinName)}</em>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="muted small svelte-qsbwub">${escape_html(SPECIES_CATEGORY_LABELS[t.category])} · ${escape_html(t.ruleCount)} règle${escape_html(t.ruleCount > 1 ? "s" : "")} ·
					${escape_html(t.treeCount)} arbre${escape_html(t.treeCount > 1 ? "s" : "")}</div> `);
				if (t.unverified) $$renderer.push(`<!--[0--><span class="badge warning">${escape_html(t.unverified)} à vérifier</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></a></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucun modèle.</li>`);
		$$renderer.push(`<!--]--></ul> `);
		if (data.catalog.length) {
			$$renderer.push(`<!--[0--><h2>Ajouter depuis le catalogue</h2> <p class="muted small svelte-qsbwub">Fiches pré-établies pour 850 m d'altitude : calendrier d'entretien, variétés et porte-greffes
		courants. Elles sont aussi proposées directement à la création d'un arbre.</p> `);
			if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <!--[-->`);
			const each_array_1 = ensure_array_like(catalogGroups());
			for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
				let g = each_array_1[$$index_2];
				$$renderer.push(`<h3 class="svelte-qsbwub">${escape_html(SPECIES_CATEGORY_LABELS[g.category])}</h3> <ul class="list"><!--[-->`);
				const each_array_2 = ensure_array_like(g.entries);
				for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
					let e = each_array_2[$$index_1];
					$$renderer.push(`<li class="card catalog-item svelte-qsbwub"><div><strong>${escape_html(e.commonName)}</strong> <em class="muted small svelte-qsbwub">${escape_html(e.latinName)}</em> `);
					if (e.altitudeWarning) $$renderer.push(`<!--[0--><div class="small warn svelte-qsbwub">⚠️ ${escape_html(e.altitudeWarning)}</div>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <form method="POST" action="?/import"><input type="hidden" name="key"${attr("value", e.key)}/> <button class="btn small svelte-qsbwub" type="submit">Ajouter</button></form></li>`);
				}
				$$renderer.push(`<!--]--></ul>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map