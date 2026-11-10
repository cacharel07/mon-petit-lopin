import { l as attr, r as derived, s as stringify, t as attr_class, u as escape_html } from "./server2.js";
import { l as formatShortDate } from "./dates.js";
import { l as PROJECT_PRIORITY_LABELS } from "./enums.js";
import { t as ProgressBar } from "./ProgressBar.js";
// src/lib/components/ProjectCard.svelte
function ProjectCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { project: p, today } = $$props;
		const late = derived(() => p.status !== "done" && p.plannedEnd != null && p.plannedEnd < today);
		$$renderer.push(`<a class="card project svelte-oviq8z"${attr("href", `/travaux/${stringify(p.id)}`)}><div class="top svelte-oviq8z">`);
		if (p.coverThumb) $$renderer.push(`<!--[0--><img${attr("src", `/photos/${stringify(p.coverThumb)}`)} alt="" loading="lazy" class="svelte-oviq8z"/>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text svelte-oviq8z"><strong>${escape_html(p.title)}</strong> <span class="muted small svelte-oviq8z">${escape_html([p.zoneName, p.priority === "high" ? `priorité ${PROJECT_PRIORITY_LABELS.high.toLowerCase()}` : null].filter(Boolean).join(" · "))}</span> `);
		if (p.status === "done" && p.actualEnd) $$renderer.push(`<!--[0--><span class="muted small svelte-oviq8z">Terminé le ${escape_html(formatShortDate(p.actualEnd, Number(today.slice(0, 4))))}</span>`);
		else if (p.plannedEnd) $$renderer.push(`<!--[1--><span${attr_class("small svelte-oviq8z", void 0, {
			"status-overdue": late(),
			"muted": !late()
		})}>${escape_html(late() ? "En retard · " : "")}fin prévue ${escape_html(formatShortDate(p.plannedEnd, Number(today.slice(0, 4))))}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> `);
		if (p.status !== "planned" || p.taskCount) {
			$$renderer.push(`<!--[0--><div class="progress svelte-oviq8z">`);
			ProgressBar($$renderer, { value: p.progress });
			$$renderer.push(`<!----> <span class="muted small svelte-oviq8z">${escape_html(p.taskCount ? `${p.doneCount}/${p.taskCount}` : `${p.progress} %`)}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></a>`);
	});
}
export { ProjectCard as t };

//# sourceMappingURL=ProjectCard.js.map