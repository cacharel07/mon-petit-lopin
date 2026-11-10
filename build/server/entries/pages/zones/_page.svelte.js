import { a as head, i as ensure_array_like, l as attr, u as escape_html } from "../../../chunks/server2.js";
// src/routes/zones/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		head("1pz9s3k", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Zones · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/plus">← Plus</a> <h1>Zones du terrain</h1> `);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <ul class="list">`);
		const each_array = ensure_array_like(data.zones);
		if (each_array.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let z = each_array[$$index];
				$$renderer.push(`<li class="card"><details><summary class="svelte-1pz9s3k"><strong>${escape_html(z.name)}</strong> <span class="muted small svelte-1pz9s3k">· ${escape_html(z.trees)} arbre${escape_html(z.trees > 1 ? "s" : "")} · ${escape_html(z.projects)} projet${escape_html(z.projects > 1 ? "s" : "")}</span> `);
				if (z.description) $$renderer.push(`<!--[0--><div class="muted small svelte-1pz9s3k">${escape_html(z.description)}</div>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></summary> <form method="POST" action="?/update" class="stack edit svelte-1pz9s3k"><input type="hidden" name="id"${attr("value", z.id)}/> <label>Nom <input name="name"${attr("value", z.name)} required=""/></label> <label>Description <input name="description"${attr("value", z.description ?? "")}/></label> <div class="actions"><button class="btn primary" type="submit">Enregistrer</button> <button class="btn danger" type="submit" formaction="?/delete">Supprimer</button></div></form></details></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucune zone pour l'instant.</li>`);
		$$renderer.push(`<!--]--></ul> <h2>Ajouter une zone</h2> <form method="POST" action="?/create" class="card stack"><label>Nom <input name="name" required="" placeholder="ex. Potager"/></label> <label>Description <input name="description"/></label> <button class="btn primary" type="submit">Ajouter</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map