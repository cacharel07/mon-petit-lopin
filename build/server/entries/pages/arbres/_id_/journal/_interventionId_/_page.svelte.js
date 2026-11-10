import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, u as escape_html } from "../../../../../../chunks/server2.js";
import { n as PhotoGrid, t as PhotoInput } from "../../../../../../chunks/PhotoInput.js";
import { a as INTERVENTION_TYPE_LABELS, i as INTERVENTION_TYPES } from "../../../../../../chunks/enums.js";
// src/routes/arbres/[id]/journal/[interventionId]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const values = derived(() => form?.values ?? data.entry);
		head("1nvz7j1", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Journal · ${escape_html(data.tree.name)} · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back"${attr("href", `/arbres/${stringify(data.tree.id)}`)}>← ${escape_html(data.tree.name)}</a> <h1>Modifier l'intervention</h1> <form method="POST" action="?/save" enctype="multipart/form-data" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid2"><label>Date <input type="date" name="date"${attr("value", values().date)} required=""/></label> <label>Type `);
		$$renderer.select({
			name: "type",
			value: values().type
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(INTERVENTION_TYPES);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let type = each_array[$$index];
				$$renderer.option({ value: type }, ($$renderer) => {
					$$renderer.push(`${escape_html(INTERVENTION_TYPE_LABELS[type])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label></div> <label>Notes <textarea name="notes" rows="4">`);
		const $$body = escape_html(values().notes ?? "");
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></label> `);
		PhotoInput($$renderer, { label: "Ajouter des photos" });
		$$renderer.push(`<!----> <div class="actions"><button class="btn primary" type="submit">Enregistrer</button> <button class="btn danger" type="submit" formaction="?/delete" formnovalidate="">Supprimer</button></div></form> `);
		if (data.photos.length) {
			$$renderer.push(`<!--[0--><h2>Photos</h2> `);
			PhotoGrid($$renderer, { photos: data.photos });
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map