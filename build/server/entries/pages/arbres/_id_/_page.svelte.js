import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, t as attr_class, u as escape_html } from "../../../../chunks/server2.js";
import { a as INTERVENTION_TYPE_LABELS, d as PROJECT_STATUS_LABELS, h as TREE_STATUS_LABELS, i as INTERVENTION_TYPES, r as CARE_RULE_TYPE_LABELS } from "../../../../chunks/enums.js";
import { c as formatDate, s as formatAge, u as formatWindow } from "../../../../chunks/dates.js";
import { t as DoneButton } from "../../../../chunks/DoneButton.js";
import { n as PhotoGrid, t as PhotoInput } from "../../../../chunks/PhotoInput.js";
// src/lib/components/CareCalendar.svelte
function CareCalendar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Current status of each rule (by rule id), with a « Fait » button when actionable. */
		let { rules, sourceLabels, statuses, treeId } = $$props;
		function ageText(r) {
			if (r.minAgeYears != null && r.maxAgeYears != null) return `de ${formatAge(r.minAgeYears)} à ${formatAge(r.maxAgeYears)}`;
			if (r.minAgeYears != null) return `à partir de ${formatAge(r.minAgeYears)}`;
			if (r.maxAgeYears != null) return r.maxAgeYears === 1 ? "la première année" : `les ${r.maxAgeYears} premières années`;
			return null;
		}
		if (rules.length === 0) $$renderer.push(`<!--[0--><p class="muted svelte-r6a1nt">Aucune règle d'entretien.</p>`);
		else {
			$$renderer.push(`<!--[-1--><ul class="list"><!--[-->`);
			const each_array = ensure_array_like(rules);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let r = each_array[$$index];
				$$renderer.push(`<li class="card rule svelte-r6a1nt"><div class="head svelte-r6a1nt"><strong>${escape_html(r.label)}</strong> <span class="badges svelte-r6a1nt">`);
				if (sourceLabels?.get(r.id)) $$renderer.push(`<!--[0--><span class="badge">${escape_html(sourceLabels.get(r.id))}</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (!r.verified) $$renderer.push(`<!--[0--><span class="badge warning">à vérifier</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></span></div> <div class="muted small svelte-r6a1nt">${escape_html(CARE_RULE_TYPE_LABELS[r.type])} · ${escape_html(formatWindow(r))} `);
				if (r.intervalDays) $$renderer.push(`<!--[0-->· tous les ${escape_html(r.intervalDays)} jours`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (ageText(r)) $$renderer.push(`<!--[0-->· ${escape_html(ageText(r))}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				if (statuses?.[r.id]) {
					$$renderer.push("<!--[0-->");
					const st = statuses[r.id];
					$$renderer.push(`<div class="status svelte-r6a1nt"><span${attr_class(`status-${stringify(st.status)} small`, "svelte-r6a1nt")}>${escape_html(st.text)}</span> `);
					if (treeId && (st.status === "due" || st.status === "overdue")) {
						$$renderer.push("<!--[0-->");
						DoneButton($$renderer, {
							kind: "care",
							treeId,
							ruleId: r.id
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				} else if (statuses) $$renderer.push(`<!--[1--><div class="status svelte-r6a1nt"><span class="muted small svelte-r6a1nt">Pas d'échéance dans l'année à venir (âge ou plantation)</span></div>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (r.notes) $$renderer.push(`<!--[0--><details class="small svelte-r6a1nt"><summary class="muted svelte-r6a1nt">Conseils</summary> <p class="notes svelte-r6a1nt">${escape_html(r.notes)}</p></details>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
// src/routes/arbres/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const t = derived(() => data.tree);
		const cover = derived(() => data.photos[0] ?? null);
		const activeRules = derived(() => data.rules.filter((r) => !r.hidden).map((r) => r.rule));
		const sourceLabels = derived(() => new Map(data.rules.filter((r) => r.source !== "template").map((r) => [r.rule.id, r.source === "override" ? "personnalisée" : "propre à l’arbre"])));
		const fullName = derived(() => [t().commonName, t().variety].filter(Boolean).join(" "));
		const subtitle = derived(() => [
			t().nickname ? fullName() : null,
			data.ageYears != null ? `planté il y a ${formatAge(data.ageYears)}` : TREE_STATUS_LABELS[t().status],
			data.zone?.name
		].filter(Boolean).join(" · "));
		let submitting = false;
		head("1pw4quw", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(t().name)} · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/arbres">← Arbres</a> <div class="page-header"><h1>${escape_html(t().name)}</h1> <a class="btn small svelte-1pw4quw"${attr("href", `/arbres/${stringify(t().id)}/modifier`)}>Modifier</a></div> <p class="muted subtitle svelte-1pw4quw">${escape_html(subtitle())}</p> `);
		if (cover()) $$renderer.push(`<!--[0--><a${attr("href", `/photos/${stringify(cover().fileName)}`)} target="_blank" rel="noopener"><img class="cover svelte-1pw4quw"${attr("src", `/photos/${stringify(cover().fileName)}`)}${attr("alt", t().name)}/></a>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().status === "purchased") $$renderer.push(`<!--[0--><form method="POST" action="?/markPlanted" class="card stack planted svelte-1pw4quw"><strong>🌱 Pas encore planté</strong> <label>Date de plantation <input type="date" name="date"${attr("value", data.today)}/></label> <label>Notes <input name="notes" placeholder="emplacement, amendement…"/></label> <button class="btn primary" type="submit">Marquer comme planté</button></form>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2>Ajouter au journal</h2> <form method="POST" action="?/addIntervention" enctype="multipart/form-data" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (form && "added" in form && form.added === "intervention") $$renderer.push(`<!--[0--><p class="muted">Ajouté au journal ✓</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid2"><label>Date <input type="date" name="date"${attr("value", data.today)} required=""/></label> <label>Type <select name="type"><!--[-->`);
		const each_array = ensure_array_like(INTERVENTION_TYPES);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let type = each_array[$$index];
			$$renderer.option({ value: type }, ($$renderer) => {
				$$renderer.push(`${escape_html(INTERVENTION_TYPE_LABELS[type])}`);
			});
		}
		$$renderer.push(`<!--]--></select></label></div> <label>Notes <textarea name="notes" rows="2"></textarea></label> `);
		PhotoInput($$renderer, {});
		$$renderer.push(`<!----> <button class="btn primary" type="submit"${attr("disabled", submitting, true)}>${escape_html("Ajouter")}</button></form> <h2>Journal</h2> <ul class="list">`);
		const each_array_1 = ensure_array_like(data.interventions);
		if (each_array_1.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let i = each_array_1[$$index_1];
				$$renderer.push(`<li class="card entry svelte-1pw4quw"><div class="entry-head svelte-1pw4quw"><span><strong>${escape_html(INTERVENTION_TYPE_LABELS[i.type])}</strong> · ${escape_html(formatDate(i.date))}</span> <a class="btn link"${attr("href", `/arbres/${stringify(t().id)}/journal/${stringify(i.id)}`)}>Modifier</a></div> `);
				if (i.notes) $$renderer.push(`<!--[0--><p class="notes svelte-1pw4quw">${escape_html(i.notes)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				PhotoGrid($$renderer, {
					photos: i.photos,
					deleteAction: null,
					showDates: false
				});
				$$renderer.push(`<!----></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucune intervention enregistrée.</li>`);
		$$renderer.push(`<!--]--></ul> <div class="page-header"><h2>Calendrier d'entretien</h2> <a class="btn link"${attr("href", `/arbres/${stringify(t().id)}/entretien`)}>Personnaliser</a></div> `);
		if (data.template) $$renderer.push(`<!--[0--><p class="muted small svelte-1pw4quw">Hérité du modèle « ${escape_html(data.template.commonName)} ».</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().status !== "planted") $$renderer.push(`<!--[0--><p class="muted small svelte-1pw4quw">Les échéances commenceront une fois l'arbre planté.</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		CareCalendar($$renderer, {
			rules: activeRules(),
			sourceLabels: sourceLabels(),
			statuses: data.statuses,
			treeId: t().id
		});
		$$renderer.push(`<!----> <h2>Fiche</h2> <div class="card"><dl class="facts">`);
		if (t().species) $$renderer.push(`<!--[0--><dt>Espèce</dt> <dd><em>${escape_html(t().species)}</em></dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().variety) $$renderer.push(`<!--[0--><dt>Variété</dt> <dd>${escape_html(t().variety)}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().rootstock) $$renderer.push(`<!--[0--><dt>Porte-greffe</dt> <dd>${escape_html(t().rootstock)}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().purchaseDate) $$renderer.push(`<!--[0--><dt>Achat</dt> <dd>${escape_html(formatDate(t().purchaseDate))}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().nursery) $$renderer.push(`<!--[0--><dt>Pépinière</dt> <dd>${escape_html(t().nursery)}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().plantingDate) $$renderer.push(`<!--[0--><dt>Plantation</dt> <dd>${escape_html(formatDate(t().plantingDate))}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().recommendedSpacingM) $$renderer.push(`<!--[0--><dt>Distance</dt> <dd>${escape_html(t().recommendedSpacingM)} m</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <dt>Pollinisateur</dt> <dd>`);
		if (t().pollinatorRequired) {
			$$renderer.push(`<!--[0-->nécessaire `);
			if (data.pollinators.length) {
				$$renderer.push(`<!--[0-->· <!--[-->`);
				const each_array_2 = ensure_array_like(data.pollinators);
				for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
					let p = each_array_2[i];
					$$renderer.push(`<!---->${escape_html(i ? ", " : "")}<a${attr("href", `/arbres/${stringify(p.id)}`)}>${escape_html(p.name)}</a>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push(`<!--[-1-->non nécessaire`);
		$$renderer.push(`<!--]--></dd> `);
		if (t().pollinationNotes) $$renderer.push(`<!--[0--><dt>Compatibles</dt> <dd class="notes">${escape_html(t().pollinationNotes)}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></dl> `);
		if (data.template?.notes) $$renderer.push(`<!--[0--><details class="species-notes svelte-1pw4quw"><summary class="svelte-1pw4quw">Conseils pour l'espèce (${escape_html(data.template.commonName)})</summary> <p class="notes">${escape_html(data.template.notes)}</p></details>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().nurseryAdvice) $$renderer.push(`<!--[0--><h3 class="svelte-1pw4quw">Conseils de la pépinière</h3> <p class="notes">${escape_html(t().nurseryAdvice)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (t().notes) $$renderer.push(`<!--[0--><h3 class="svelte-1pw4quw">Notes</h3> <p class="notes">${escape_html(t().notes)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (data.projects.length) {
			$$renderer.push(`<!--[0--><h2>Travaux liés</h2> <ul class="list"><!--[-->`);
			const each_array_3 = ensure_array_like(data.projects);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let p = each_array_3[$$index_3];
				$$renderer.push(`<li><a${attr("href", `/travaux/${stringify(p.id)}`)}>${escape_html(p.title)}</a> <span class="muted small svelte-1pw4quw">· ${escape_html(PROJECT_STATUS_LABELS[p.status])}</span></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2>Photos (${escape_html(data.photos.length)})</h2> `);
		PhotoGrid($$renderer, { photos: data.photos });
		$$renderer.push(`<!----> <form method="POST" action="?/addPhotos" enctype="multipart/form-data" class="card stack upload svelte-1pw4quw">`);
		if (form && "added" in form && form.added === "photos") $$renderer.push(`<!--[0--><p class="muted">Photos ajoutées ✓</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		PhotoInput($$renderer, { label: "Ajouter des photos de suivi" });
		$$renderer.push(`<!----> <button class="btn" type="submit">Envoyer</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map