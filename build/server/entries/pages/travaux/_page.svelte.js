import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, t as attr_class, u as escape_html } from "../../../chunks/server2.js";
import { t as ProjectCard } from "../../../chunks/ProjectCard.js";
import { d as PROJECT_STATUS_LABELS, u as PROJECT_STATUSES } from "../../../chunks/enums.js";
// src/routes/travaux/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const filtered = derived(() => data.status ? data.projects.filter((p) => p.status === data.status) : data.projects);
		const count = (s) => data.projects.filter((p) => p.status === s).length;
		const neighbours = (s) => {
			const i = PROJECT_STATUSES.indexOf(s);
			return {
				prev: PROJECT_STATUSES[i - 1],
				next: PROJECT_STATUSES[i + 1]
			};
		};
		head("1uoazp6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Travaux · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<div class="page-header"><h1>Travaux</h1> <a class="btn primary small svelte-1uoazp6" href="/travaux/nouveau">+ Nouveau</a></div> <nav class="tabs svelte-1uoazp6" aria-label="Vue"><a href="/travaux"${attr_class("svelte-1uoazp6", void 0, { "active": data.view === "list" })}>Liste</a> <a href="/travaux?vue=kanban"${attr_class("svelte-1uoazp6", void 0, { "active": data.view === "kanban" })}>Kanban</a></nav> `);
		if (data.view === "list") {
			$$renderer.push(`<!--[0--><div class="chips svelte-1uoazp6"><a href="/travaux"${attr_class("chip svelte-1uoazp6", void 0, { "active": !data.status })}>Tous (${escape_html(data.projects.length)})</a> <!--[-->`);
			const each_array = ensure_array_like(PROJECT_STATUSES);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let s = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/travaux?statut=${stringify(s)}`)}${attr_class("chip svelte-1uoazp6", void 0, { "active": data.status === s })}>${escape_html(PROJECT_STATUS_LABELS[s])} (${escape_html(count(s))})</a>`);
			}
			$$renderer.push(`<!--]--></div> <ul class="list">`);
			const each_array_1 = ensure_array_like(filtered());
			if (each_array_1.length !== 0) {
				$$renderer.push("<!--[-->");
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let p = each_array_1[$$index_1];
					$$renderer.push(`<li>`);
					if (!data.status) $$renderer.push(`<!--[0--><span class="badge status svelte-1uoazp6">${escape_html(PROJECT_STATUS_LABELS[p.status])}</span>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					ProjectCard($$renderer, {
						project: p,
						today: data.today
					});
					$$renderer.push(`<!----></li>`);
				}
			} else $$renderer.push(`<!--[!--><li class="muted">Aucun projet.</li>`);
			$$renderer.push(`<!--]--></ul>`);
		} else {
			$$renderer.push(`<!--[-1--><div class="kanban svelte-1uoazp6"><!--[-->`);
			const each_array_2 = ensure_array_like(PROJECT_STATUSES);
			for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
				let s = each_array_2[$$index_3];
				const { prev, next } = neighbours(s);
				$$renderer.push(`<section class="column svelte-1uoazp6"><h2 class="svelte-1uoazp6">${escape_html(PROJECT_STATUS_LABELS[s])} <span class="muted">(${escape_html(count(s))})</span></h2> <ul class="list">`);
				const each_array_3 = ensure_array_like(data.projects.filter((p) => p.status === s));
				if (each_array_3.length !== 0) {
					$$renderer.push("<!--[-->");
					for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
						let p = each_array_3[$$index_2];
						$$renderer.push(`<li>`);
						ProjectCard($$renderer, {
							project: p,
							today: data.today
						});
						$$renderer.push(`<!----> <div class="move svelte-1uoazp6">`);
						if (prev) $$renderer.push(`<!--[0--><form method="POST" action="?/move&amp;vue=kanban"><input type="hidden" name="id"${attr("value", p.id)}/> <input type="hidden" name="status"${attr("value", prev)}/> <button class="btn link" type="submit">← ${escape_html(PROJECT_STATUS_LABELS[prev])}</button></form>`);
						else $$renderer.push(`<!--[-1--><span></span>`);
						$$renderer.push(`<!--]--> `);
						if (next) $$renderer.push(`<!--[0--><form method="POST" action="?/move&amp;vue=kanban"><input type="hidden" name="id"${attr("value", p.id)}/> <input type="hidden" name="status"${attr("value", next)}/> <button class="btn link" type="submit">${escape_html(PROJECT_STATUS_LABELS[next])} →</button></form>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div></li>`);
					}
				} else $$renderer.push(`<!--[!--><li class="muted small svelte-1uoazp6">Vide</li>`);
				$$renderer.push(`<!--]--></ul></section>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map