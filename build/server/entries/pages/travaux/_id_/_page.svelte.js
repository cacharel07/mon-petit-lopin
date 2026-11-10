import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, t as attr_class, u as escape_html } from "../../../../chunks/server2.js";
import { n as PhotoGrid, t as PhotoInput } from "../../../../chunks/PhotoInput.js";
import { t as ProgressBar } from "../../../../chunks/ProgressBar.js";
import { c as formatDate, l as formatShortDate } from "../../../../chunks/dates.js";
import { d as PROJECT_STATUS_LABELS, h as TREE_STATUS_LABELS, l as PROJECT_PRIORITY_LABELS, o as PHOTO_PHASES, s as PHOTO_PHASE_LABELS, u as PROJECT_STATUSES } from "../../../../chunks/enums.js";
import { r as formatEuros } from "../../../../chunks/projects.js";
// src/routes/travaux/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		const p = derived(() => data.project);
		const year = derived(() => Number(data.today.slice(0, 4)));
		const doneCount = derived(() => data.tasks.filter((t) => t.done).length);
		const photosByPhase = derived(() => [...PHOTO_PHASES, null].map((phase) => ({
			phase,
			photos: data.photos.filter((ph) => ph.phase === phase)
		})));
		let uploading = false;
		head("76awnm", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(p().title)} · Travaux · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<a class="back" href="/travaux">← Travaux</a> <div class="page-header"><h1>${escape_html(p().title)}</h1> <a class="btn small svelte-76awnm"${attr("href", `/travaux/${stringify(p().id)}/modifier`)}>Modifier</a></div> <form method="POST" action="?/setStatus" class="statuses svelte-76awnm"><!--[-->`);
		const each_array = ensure_array_like(PROJECT_STATUSES);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let s = each_array[$$index];
			$$renderer.push(`<button${attr_class("btn small svelte-76awnm", void 0, { "primary": p().status === s })} name="status"${attr("value", s)} type="submit">${escape_html(PROJECT_STATUS_LABELS[s])}</button>`);
		}
		$$renderer.push(`<!--]--></form> <div class="progress svelte-76awnm">`);
		ProgressBar($$renderer, { value: data.progress });
		$$renderer.push(`<!----> <span class="muted">${escape_html(data.progress)} %</span></div> `);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2>Checklist `);
		if (data.tasks.length) $$renderer.push(`<!--[0--><span class="muted">(${escape_html(doneCount())}/${escape_html(data.tasks.length)})</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></h2> <ul class="list tasks">`);
		const each_array_1 = ensure_array_like(data.tasks);
		if (each_array_1.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let t = each_array_1[$$index_1];
				$$renderer.push(`<li${attr_class("card task svelte-76awnm", void 0, { "done": t.done })}><form method="POST" action="?/toggleTask"><input type="hidden" name="taskId"${attr("value", t.id)}/> <button class="tick svelte-76awnm" type="submit"${attr("aria-label", t.done ? "Décocher" : "Cocher")}>${escape_html(t.done ? "☑" : "☐")}</button></form> <details class="svelte-76awnm"><summary class="svelte-76awnm"><span class="label svelte-76awnm">${escape_html(t.label)}</span> `);
				if (t.dueDate && !t.done) $$renderer.push(`<!--[0--><span${attr_class("small svelte-76awnm", void 0, {
					"status-overdue": t.dueDate < data.today,
					"muted": t.dueDate >= data.today
				})}>· ${escape_html(formatShortDate(t.dueDate, year()))}</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></summary> <form method="POST" action="?/updateTask" class="stack edit svelte-76awnm"><input type="hidden" name="taskId"${attr("value", t.id)}/> <label>Tâche <input name="label"${attr("value", t.label)} required=""/></label> <label>Échéance <input type="date" name="dueDate"${attr("value", t.dueDate ?? "")}/></label> <div class="actions"><button class="btn small primary svelte-76awnm" type="submit">Enregistrer</button> <button class="btn small danger svelte-76awnm" type="submit" formaction="?/deleteTask" formnovalidate="">Supprimer</button></div></form></details></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucune tâche.</li>`);
		$$renderer.push(`<!--]--></ul> <form method="POST" action="?/addTask" class="add-task svelte-76awnm"><input name="label" placeholder="Nouvelle tâche" required="" aria-label="Nouvelle tâche"/> <input type="date" name="dueDate" aria-label="Échéance (facultative)" class="svelte-76awnm"/> <button class="btn primary svelte-76awnm" type="submit">Ajouter</button></form> <h2>Informations</h2> <div class="card"><dl class="facts"><dt>Priorité</dt> <dd>${escape_html(PROJECT_PRIORITY_LABELS[p().priority])}</dd> `);
		if (data.zone) $$renderer.push(`<!--[0--><dt>Zone</dt> <dd>${escape_html(data.zone.name)}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (p().plannedStart || p().plannedEnd) $$renderer.push(`<!--[0--><dt>Prévu</dt> <dd>${escape_html([formatDate(p().plannedStart), formatDate(p().plannedEnd)].filter(Boolean).join(" → "))}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (p().actualStart || p().actualEnd) $$renderer.push(`<!--[0--><dt>Réel</dt> <dd>${escape_html([formatDate(p().actualStart), formatDate(p().actualEnd)].filter(Boolean).join(" → "))}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (p().budgetEstimatedCents != null) $$renderer.push(`<!--[0--><dt>Budget</dt> <dd>${escape_html(formatEuros(p().budgetEstimatedCents))}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (p().budgetActualCents != null) $$renderer.push(`<!--[0--><dt>Coût réel</dt> <dd>${escape_html(formatEuros(p().budgetActualCents))}</dd>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></dl> `);
		if (p().description) $$renderer.push(`<!--[0--><p class="notes">${escape_html(p().description)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (p().notes) $$renderer.push(`<!--[0--><h3 class="svelte-76awnm">Notes</h3> <p class="notes">${escape_html(p().notes)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (data.trees.length) {
			$$renderer.push(`<!--[0--><h2>Arbres concernés</h2> <ul class="list"><!--[-->`);
			const each_array_2 = ensure_array_like(data.trees);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let t = each_array_2[$$index_2];
				$$renderer.push(`<li><a${attr("href", `/arbres/${stringify(t.id)}`)}>${escape_html(t.name)}</a> <span class="muted small svelte-76awnm">· ${escape_html(TREE_STATUS_LABELS[t.status])}</span></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2>Photos (${escape_html(data.photos.length)})</h2> <!--[-->`);
		const each_array_3 = ensure_array_like(photosByPhase());
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let group = each_array_3[$$index_3];
			if (group.photos.length) {
				$$renderer.push(`<!--[0--><h3 class="svelte-76awnm">${escape_html(group.phase ? PHOTO_PHASE_LABELS[group.phase] : "Autres")}</h3> `);
				PhotoGrid($$renderer, { photos: group.photos });
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--> <form method="POST" action="?/addPhotos" enctype="multipart/form-data" class="card stack upload svelte-76awnm">`);
		if (form && "photosAdded" in form) $$renderer.push(`<!--[0--><p class="muted">Photos ajoutées ✓</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label>Étape `);
		$$renderer.select({
			name: "phase",
			value: p().status === "planned" ? "before" : p().status === "done" ? "after" : "during"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_4 = ensure_array_like(PHOTO_PHASES);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let ph = each_array_4[$$index_4];
				$$renderer.option({ value: ph }, ($$renderer) => {
					$$renderer.push(`${escape_html(PHOTO_PHASE_LABELS[ph])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</label> `);
		PhotoInput($$renderer, {});
		$$renderer.push(`<!----> <button class="btn" type="submit"${attr("disabled", uploading, true)}>${escape_html("Envoyer")}</button></form>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map