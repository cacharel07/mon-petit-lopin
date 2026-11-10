import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, t as attr_class, u as escape_html } from "../../chunks/server2.js";
import { t as dueText } from "../../chunks/due-text.js";
import { t as DoneButton } from "../../chunks/DoneButton.js";
import { t as ProjectCard } from "../../chunks/ProjectCard.js";
import { t as logo_default } from "../../chunks/logo.js";
import { c as formatDate } from "../../chunks/dates.js";
// src/lib/components/DueRow.svelte
function DueRow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item, today } = $$props;
		const ICONS = {
			pruning: "✂️",
			watering: "💧",
			fertilizing: "🌿",
			mulching: "🍂",
			treatment: "🧪",
			harvest: "🧺",
			planting: "🌱",
			observation: "👀",
			other: "🌱"
		};
		const icon = derived(() => item.kind === "care" ? ICONS[item.interventionType] : "🛠️");
		const canMarkDone = derived(() => item.kind === "project_task" || item.kind === "care" && (item.intervalDays != null || item.status !== "upcoming"));
		const href = derived(() => item.kind === "care" ? `/arbres/${item.treeId}` : `/travaux/${item.projectId}`);
		$$renderer.push(`<li class="card row svelte-z1c66"><span class="icon svelte-z1c66" aria-hidden="true">${escape_html(icon())}</span> <a class="text svelte-z1c66"${attr("href", href())}><strong>${escape_html(item.label)}</strong> <span class="muted small svelte-z1c66">${escape_html(item.kind === "care" ? item.treeName : item.projectTitle)} `);
		if (item.kind === "care" && !item.verified) $$renderer.push(`<!--[0--><span class="badge warning svelte-z1c66">à vérifier</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></span> <span${attr_class(`small status-${stringify(item.status)}`, "svelte-z1c66")}>${escape_html(dueText(item, today))}</span></a> `);
		if (canMarkDone()) {
			$$renderer.push("<!--[0-->");
			if (item.kind === "care") {
				$$renderer.push("<!--[0-->");
				DoneButton($$renderer, {
					kind: "care",
					treeId: item.treeId,
					ruleId: item.ruleId
				});
			} else if (item.taskId != null) {
				$$renderer.push("<!--[1-->");
				DoneButton($$renderer, {
					kind: "task",
					taskId: item.taskId
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></li>`);
	});
}
// src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const g = derived(() => data.groups);
		const nothing = derived(() => !g().overdue.length && !g().thisWeek.length && !g().thisMonth.length);
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<header class="brand svelte-1uha8ag"><img class="logo svelte-1uha8ag"${attr("src", logo_default)} alt="Mon petit lopin" width="480" height="480"/> <div><h1 class="svelte-1uha8ag">Tableau de bord</h1> <p class="muted today svelte-1uha8ag">${escape_html(formatDate(data.today))}</p></div></header> `);
		if (data.toPlant || data.unverified) {
			$$renderer.push(`<!--[0--><div class="hints svelte-1uha8ag">`);
			if (data.toPlant) $$renderer.push(`<!--[0--><a class="card hint svelte-1uha8ag" href="/arbres">🌱 ${escape_html(data.toPlant)} arbre${escape_html(data.toPlant > 1 ? "s" : "")} à planter</a>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.unverified) $$renderer.push(`<!--[0--><a class="card hint svelte-1uha8ag" href="/especes">📖 ${escape_html(data.unverified)} règle${escape_html(data.unverified > 1 ? "s" : "")} d'entretien à vérifier</a>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (g().overdue.length) {
			$$renderer.push(`<!--[0--><section><h2 class="status-overdue">En retard (${escape_html(g().overdue.length)})</h2> <ul class="list overdue svelte-1uha8ag"><!--[-->`);
			const each_array = ensure_array_like(g().overdue);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				DueRow($$renderer, {
					item,
					today: data.today
				});
			}
			$$renderer.push(`<!--]--></ul></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section><h2>Cette semaine</h2> <ul class="list">`);
		const each_array_1 = ensure_array_like(g().thisWeek);
		if (each_array_1.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let item = each_array_1[$$index_1];
				DueRow($$renderer, {
					item,
					today: data.today
				});
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Rien à faire cette semaine.</li>`);
		$$renderer.push(`<!--]--></ul></section> <section><h2>Ce mois-ci</h2> <ul class="list">`);
		const each_array_2 = ensure_array_like(g().thisMonth);
		if (each_array_2.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let item = each_array_2[$$index_2];
				DueRow($$renderer, {
					item,
					today: data.today
				});
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Rien d'autre ce mois-ci.</li>`);
		$$renderer.push(`<!--]--></ul></section> `);
		if (nothing()) $$renderer.push(`<!--[0--><p class="muted">Tout est à jour 🌤️</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section><h2>Travaux en cours</h2> <ul class="list">`);
		const each_array_3 = ensure_array_like(data.inProgress);
		if (each_array_3.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let project = each_array_3[$$index_3];
				$$renderer.push(`<li>`);
				ProjectCard($$renderer, {
					project,
					today: data.today
				});
				$$renderer.push(`<!----></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucun projet en cours. <a href="/travaux">Voir les travaux</a></li>`);
		$$renderer.push(`<!--]--></ul></section>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map