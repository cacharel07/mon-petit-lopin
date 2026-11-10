import { i as ensure_array_like, l as attr, u as escape_html } from "./server2.js";
import { n as CARE_RULE_TYPES, r as CARE_RULE_TYPE_LABELS } from "./enums.js";
import { t as MONTH_NAMES } from "./dates.js";
// src/lib/components/RuleForm.svelte
function RuleForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { values = {} } = $$props;
		const v = (name) => values[name] == null ? "" : String(values[name]);
		const checked = (name) => values[name] === true || values[name] === "on";
		$$renderer.push(`<label>Type `);
		$$renderer.select({
			name: "type",
			value: v("type") || "pruning_formation"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(CARE_RULE_TYPES);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let type = each_array[$$index];
				$$renderer.option({ value: type }, ($$renderer) => {
					$$renderer.push(`${escape_html(CARE_RULE_TYPE_LABELS[type])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> <label>Libellé <input name="label"${attr("value", v("label"))} required="" placeholder="ex. Taille de formation"/></label> <fieldset class="svelte-1wc9si8"><legend class="svelte-1wc9si8">Période</legend> <div class="row svelte-1wc9si8"><span class="muted">Du</span> <input name="startDay" type="number" min="1" max="31" inputmode="numeric"${attr("value", v("startDay") || "1")} aria-label="Jour de début"/> `);
		$$renderer.select({
			name: "startMonth",
			value: v("startMonth") || "3",
			"aria-label": "Mois de début"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(MONTH_NAMES);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let name = each_array_1[i];
				$$renderer.option({ value: String(i + 1) }, ($$renderer) => {
					$$renderer.push(`${escape_html(name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div class="row svelte-1wc9si8"><span class="muted">au</span> <input name="endDay" type="number" min="1" max="31" inputmode="numeric"${attr("value", v("endDay") || "31")} aria-label="Jour de fin"/> `);
		$$renderer.select({
			name: "endMonth",
			value: v("endMonth") || "3",
			"aria-label": "Mois de fin"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(MONTH_NAMES);
			for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
				let name = each_array_2[i];
				$$renderer.option({ value: String(i + 1) }, ($$renderer) => {
					$$renderer.push(`${escape_html(name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div></fieldset> <label>Répéter tous les … jours (vide = une fois dans la période) <input name="intervalDays" type="number" min="1" inputmode="numeric"${attr("value", v("intervalDays"))}/></label> <div class="grid2"><label>À partir de (ans) <input name="minAgeYears" type="number" min="0" inputmode="numeric"${attr("value", v("minAgeYears"))}/></label> <label>Avant (ans) <input name="maxAgeYears" type="number" min="1" inputmode="numeric"${attr("value", v("maxAgeYears"))}/></label></div> <p class="muted hint svelte-1wc9si8">Âge depuis la plantation. Ex. « avant 3 ans » = les trois premières années seulement.</p> <label>Notes <textarea name="notes" rows="3">`);
		const $$body = escape_html(v("notes"));
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></label> <label class="check"><input type="checkbox" name="verified"${attr("checked", checked("verified"), true)}/> Valeurs vérifiées</label>`);
	});
}
export { RuleForm as t };

//# sourceMappingURL=RuleForm.js.map