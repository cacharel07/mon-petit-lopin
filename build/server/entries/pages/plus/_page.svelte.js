import { a as head, l as attr, u as escape_html } from "../../../chunks/server2.js";
// src/routes/plus/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let importing = false;
		head("49c109", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Plus · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<h1>Plus</h1> <ul class="list"><li><a class="card menu svelte-49c109" href="/zones">📍 Zones du terrain</a></li> <li><a class="card menu svelte-49c109" href="/especes">📖 Modèles d'espèces</a></li> <li><a class="card menu svelte-49c109" href="/export">📦 Exporter mes données</a></li></ul> `);
		if (data.canSeed) $$renderer.push(`<!--[0--><form method="POST" action="?/seed" class="card stack seed svelte-49c109"><strong>🌱 Base vide</strong> <p class="muted svelte-49c109">Importer les données initiales : mes 9 arbres, les zones, les modèles d'espèces (règles
			d'entretien « à vérifier ») et les 3 projets de travaux. Les dates approximatives pourront
			être corrigées ensuite.</p> <button class="btn primary" type="submit"${attr("disabled", importing, true)}>${escape_html("Importer les données initiales")}</button></form>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST" action="/logout" class="logout svelte-49c109"><button class="btn" type="submit">Se déconnecter</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map