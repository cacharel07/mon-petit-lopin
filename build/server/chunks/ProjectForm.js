import { i as ensure_array_like, l as attr, u as escape_html } from "./server2.js";
import { c as PROJECT_PRIORITIES, d as PROJECT_STATUS_LABELS, l as PROJECT_PRIORITY_LABELS, u as PROJECT_STATUSES } from "./enums.js";
import { t as centsToInput } from "./projects.js";
// src/lib/components/ProjectForm.svelte
function ProjectForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { values = {}, zones, trees, treeIds = [] } = $$props;
		const v = (name) => values[name] == null ? "" : String(values[name]);
		const money = (typed, cents) => values[typed] != null ? String(values[typed]) : centsToInput(values[cents]);
		$$renderer.push(`<label>Titre <input name="title"${attr("value", v("title"))} required=""/></label> <label>Description <textarea name="description" rows="3">`);
		const $$body = escape_html(v("description"));
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></label> <div class="grid2"><label>Statut `);
		$$renderer.select({
			name: "status",
			value: v("status") || "planned"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(PROJECT_STATUSES);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let s = each_array[$$index];
				$$renderer.option({ value: s }, ($$renderer) => {
					$$renderer.push(`${escape_html(PROJECT_STATUS_LABELS[s])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> <label>Priorité `);
		$$renderer.select({
			name: "priority",
			value: v("priority") || "medium"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(PROJECT_PRIORITIES);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let p = each_array_1[$$index_1];
				$$renderer.option({ value: p }, ($$renderer) => {
					$$renderer.push(`${escape_html(PROJECT_PRIORITY_LABELS[p])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label></div> <label>Zone `);
		$$renderer.select({
			name: "zoneId",
			value: v("zoneId")
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`— Aucune —`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(zones);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let z = each_array_2[$$index_2];
				$$renderer.option({ value: String(z.id) }, ($$renderer) => {
					$$renderer.push(`${escape_html(z.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> <div class="grid2"><label>Début prévu <input type="date" name="plannedStart"${attr("value", v("plannedStart"))}/></label> <label>Fin prévue <input type="date" name="plannedEnd"${attr("value", v("plannedEnd"))}/></label> <label>Début réel <input type="date" name="actualStart"${attr("value", v("actualStart"))}/></label> <label>Fin réelle <input type="date" name="actualEnd"${attr("value", v("actualEnd"))}/></label></div> <div class="grid2"><label>Budget estimé (€) <input name="budgetEstimated" inputmode="decimal"${attr("value", money("budgetEstimated", "budgetEstimatedCents"))}/></label> <label>Coût réel (€) <input name="budgetActual" inputmode="decimal"${attr("value", money("budgetActual", "budgetActualCents"))}/></label></div> `);
		if (trees.length) {
			$$renderer.push(`<!--[0--><details${attr("open", treeIds.length > 0, true)}><summary class="muted svelte-1z0mxuz">Arbres concernés (${escape_html(treeIds.length)})</summary> <!--[-->`);
			const each_array_3 = ensure_array_like(trees);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let t = each_array_3[$$index_3];
				$$renderer.push(`<label class="check"><input type="checkbox" name="treeIds"${attr("value", t.id)}${attr("checked", treeIds.includes(t.id), true)}/> ${escape_html(t.name)}</label>`);
			}
			$$renderer.push(`<!--]--></details>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label>Notes <textarea name="notes" rows="3">`);
		const $$body_1 = escape_html(v("notes"));
		if ($$body_1) $$renderer.push(`${$$body_1}`);
		$$renderer.push(`</textarea></label>`);
	});
}
export { ProjectForm as t };

//# sourceMappingURL=ProjectForm.js.map