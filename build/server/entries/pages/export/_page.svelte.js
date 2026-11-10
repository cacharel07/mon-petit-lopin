import { a as head, i as ensure_array_like, l as attr, s as stringify, u as escape_html } from "../../../chunks/server2.js";
// src/routes/export/+page.svelte
function _page($$renderer) {
	const TABLES = [
		["tree", "Arbres"],
		["intervention", "Journal des interventions"],
		["care_rule", "Règles d'entretien"],
		["species_template", "Modèles d'espèces"],
		["project", "Projets de travaux"],
		["project_task", "Tâches des projets"],
		["zone", "Zones"],
		["photo", "Photos (métadonnées)"],
		["tree_pollinator", "Liens de pollinisation"],
		["project_tree", "Liens projets – arbres"]
	];
	head("12eq3u7", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Export · Mon petit lopin</title>`);
		});
	});
	$$renderer.push(`<a class="back" href="/plus">← Plus</a> <h1>Exporter mes données</h1> <p class="muted">Pour sauvegarder ou quitter l'application à tout moment.</p> <ul class="list"><li><a class="card item svelte-12eq3u7" href="/export/lopin.zip" download=""><strong>📦 Archive complète (ZIP)</strong> <span class="muted small svelte-12eq3u7">Toutes les données (JSON + CSV) et toutes les photos.</span></a></li> <li><a class="card item svelte-12eq3u7" href="/export/lopin.json" download=""><strong>🗂️ Données (JSON)</strong> <span class="muted small svelte-12eq3u7">Toutes les tables, sans les photos.</span></a></li></ul> <h2>Tableaux (CSV)</h2> <ul class="list"><!--[-->`);
	const each_array = ensure_array_like(TABLES);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let [table, label] = each_array[$$index];
		$$renderer.push(`<li><a${attr("href", `/export/csv/${stringify(table)}`)} download="">${escape_html(label)}</a></li>`);
	}
	$$renderer.push(`<!--]--></ul>`);
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map