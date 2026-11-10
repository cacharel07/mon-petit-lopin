import { i as ensure_array_like, l as attr, u as escape_html } from "./server2.js";
import { f as SPECIES_CATEGORIES, p as SPECIES_CATEGORY_LABELS } from "./enums.js";
// src/lib/components/TemplateForm.svelte
function TemplateForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { values = {} } = $$props;
		const v = (name) => values[name] == null ? "" : String(values[name]);
		$$renderer.push(`<label>Nom commun <input name="commonName"${attr("value", v("commonName"))} required=""/></label> <label>Nom latin <input name="latinName"${attr("value", v("latinName"))}/></label> <div class="grid2"><label>Catégorie `);
		$$renderer.select({
			name: "category",
			value: v("category") || "fruit_tree"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(SPECIES_CATEGORIES);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let c = each_array[$$index];
				$$renderer.option({ value: c }, ($$renderer) => {
					$$renderer.push(`${escape_html(SPECIES_CATEGORY_LABELS[c])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> <label>Espacement (m) <input name="defaultSpacingM" inputmode="decimal"${attr("value", v("defaultSpacingM"))}/></label></div> <label class="check"><input type="checkbox" name="needsPollinator"${attr("checked", values.needsPollinator === true || values.needsPollinator === "on", true)}/> Pollinisateur nécessaire</label> <label>Notes <textarea name="notes" rows="4">`);
		const $$body = escape_html(v("notes"));
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></label>`);
	});
}
export { TemplateForm as t };

//# sourceMappingURL=TemplateForm.js.map