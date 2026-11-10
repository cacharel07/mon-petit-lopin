import { i as ensure_array_like, l as attr, r as derived, s as stringify, u as escape_html } from "./server2.js";
import { h as TREE_STATUS_LABELS, m as TREE_STATUSES } from "./enums.js";
// src/lib/components/TreeForm.svelte
function TreeForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Built-in catalogue; entries without template are offered as `catalog:<key>`. */
		let { values = {}, zones, templates, catalog, otherTrees, pollinatorIds = [] } = $$props;
		const v = (name) => values[name] == null ? "" : String(values[name]);
		let templateRef = v("speciesTemplateId");
		let commonName = v("commonName");
		let species = v("species");
		let variety = v("variety");
		let spacing = v("recommendedSpacingM");
		let pollinationNotes = v("pollinationNotes");
		let pollinatorRequired = values.pollinatorRequired === true || values.pollinatorRequired === "on";
		const linkedKeys = derived(() => new Set(templates.map((t) => t.catalogKey).filter(Boolean)));
		const pendingCatalog = derived(() => catalog.filter((e) => !linkedKeys().has(e.key)));
		/** Catalogue entry behind the selected template, if any. */
		const entry = derived(() => {
			const key = templateRef.startsWith("catalog:") ? templateRef.slice(8) : templates.find((t) => String(t.id) === templateRef)?.catalogKey;
			return catalog.find((e) => e.key === key) ?? null;
		});
		const varietyNote = derived(() => entry()?.varieties.find((x) => x.name === variety)?.notes ?? null);
		function onTemplateChange() {
			const t = templates.find((t) => String(t.id) === templateRef);
			const source = t ? {
				name: t.commonName,
				latin: t.latinName,
				pollinator: t.needsPollinator,
				spacing: t.defaultSpacingM
			} : entry() ? {
				name: entry().commonName,
				latin: entry().latinName,
				pollinator: entry().needsPollinator,
				spacing: entry().defaultSpacingM
			} : null;
			if (!source) return;
			if (!commonName) commonName = source.name;
			if (!species && source.latin) species = source.latin;
			if (!spacing && source.spacing) spacing = String(source.spacing);
			if (source.pollinator) pollinatorRequired = true;
		}
		$$renderer.push(`<label>Espèce `);
		$$renderer.select({
			name: "speciesTemplateId",
			value: templateRef,
			onchange: onTemplateChange
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`— Aucun modèle —`);
			});
			if (templates.length) {
				$$renderer.push(`<!--[0--><optgroup label="Mes modèles"><!--[-->`);
				const each_array = ensure_array_like(templates);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let t = each_array[$$index];
					$$renderer.option({ value: String(t.id) }, ($$renderer) => {
						$$renderer.push(`${escape_html(t.commonName)}`);
					});
				}
				$$renderer.push(`<!--]--></optgroup>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			if (pendingCatalog().length) {
				$$renderer.push(`<!--[0--><optgroup label="Catalogue"><!--[-->`);
				const each_array_1 = ensure_array_like(pendingCatalog());
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let e = each_array_1[$$index_1];
					$$renderer.option({ value: `catalog:${stringify(e.key)}` }, ($$renderer) => {
						$$renderer.push(`${escape_html(e.commonName)}`);
					});
				}
				$$renderer.push(`<!--]--></optgroup>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> `);
		if (entry()?.altitudeWarning) $$renderer.push(`<!--[0--><p class="altitude svelte-1y0c9l2">⚠️ ${escape_html(entry().altitudeWarning)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label>Nom commun <input name="commonName"${attr("value", commonName)} required="" placeholder="ex. Pommier"/></label> <div class="grid2"><label>Espèce <input name="species"${attr("value", species)} placeholder="ex. Malus domestica"/></label> <label>Variété <input name="variety"${attr("value", variety)} list="variety-options" placeholder="ex. Reinette" autocomplete="off"/></label></div> `);
		if (entry()?.varieties.length) {
			$$renderer.push(`<!--[0--><datalist id="variety-options"><!--[-->`);
			const each_array_2 = ensure_array_like(entry().varieties);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let x = each_array_2[$$index_2];
				$$renderer.option({ value: x.name }, ($$renderer) => {
					$$renderer.push(`${escape_html(x.notes)}`);
				});
			}
			$$renderer.push(`<!--]--></datalist>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (varietyNote()) $$renderer.push(`<!--[0--><p class="muted hint svelte-1y0c9l2">${escape_html(varietyNote())}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label>Nom perso <input name="nickname"${attr("value", v("nickname"))} placeholder="ex. Le vieux pommier"/></label> <div class="grid2"><label>Statut `);
		$$renderer.select({
			name: "status",
			value: v("status") || "planted"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_3 = ensure_array_like(TREE_STATUSES);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let s = each_array_3[$$index_3];
				$$renderer.option({ value: s }, ($$renderer) => {
					$$renderer.push(`${escape_html(TREE_STATUS_LABELS[s])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> <label>Zone `);
		$$renderer.select({
			name: "zoneId",
			value: v("zoneId")
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`— Aucune —`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_4 = ensure_array_like(zones);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let z = each_array_4[$$index_4];
				$$renderer.option({ value: String(z.id) }, ($$renderer) => {
					$$renderer.push(`${escape_html(z.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label></div> <div class="grid2"><label>Date d'achat <input name="purchaseDate" type="date"${attr("value", v("purchaseDate"))}/></label> <label>Date de plantation <input name="plantingDate" type="date"${attr("value", v("plantingDate"))}/></label></div> <label>Lieu d'achat (pépinière) <input name="nursery"${attr("value", v("nursery"))}/></label> <div class="grid2"><label>Porte-greffe <input name="rootstock"${attr("value", v("rootstock"))} list="rootstock-options" placeholder="ex. MM106" autocomplete="off"/></label> <label>Distance conseillée (m) <input name="recommendedSpacingM" inputmode="decimal"${attr("value", spacing)} placeholder="ex. 6"/></label></div> `);
		if (entry()?.rootstocks.length) {
			$$renderer.push(`<!--[0--><datalist id="rootstock-options"><!--[-->`);
			const each_array_5 = ensure_array_like(entry().rootstocks);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let r = each_array_5[$$index_5];
				$$renderer.option({ value: r }, ($$renderer) => {});
			}
			$$renderer.push(`<!--]--></datalist>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label class="check"><input type="checkbox" name="pollinatorRequired"${attr("checked", pollinatorRequired, true)}/> Pollinisateur nécessaire</label> `);
		if (otherTrees.length) {
			$$renderer.push(`<!--[0--><fieldset class="svelte-1y0c9l2"><legend class="svelte-1y0c9l2">Pollinisé par (arbres du terrain)</legend> <!--[-->`);
			const each_array_6 = ensure_array_like(otherTrees);
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let t = each_array_6[$$index_6];
				$$renderer.push(`<label class="check"><input type="checkbox" name="pollinatorIds"${attr("value", t.id)}${attr("checked", pollinatorIds.includes(t.id), true)}/> ${escape_html(t.name)}</label>`);
			}
			$$renderer.push(`<!--]--></fieldset>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label>Pollinisateurs compatibles (notes) <textarea name="pollinationNotes" rows="2">`);
		const $$body = escape_html(pollinationNotes);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></label> <label>Conseils de la pépinière <textarea name="nurseryAdvice" rows="3">`);
		const $$body_1 = escape_html(v("nurseryAdvice"));
		if ($$body_1) $$renderer.push(`${$$body_1}`);
		$$renderer.push(`</textarea></label> <label>Notes <textarea name="notes" rows="3">`);
		const $$body_2 = escape_html(v("notes"));
		if ($$body_2) $$renderer.push(`${$$body_2}`);
		$$renderer.push(`</textarea></label>`);
	});
}
export { TreeForm as t };

//# sourceMappingURL=TreeForm.js.map