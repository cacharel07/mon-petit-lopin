import { a as head, i as ensure_array_like, l as attr, r as derived, s as stringify, u as escape_html } from "../../../chunks/server2.js";
import { s as formatAge } from "../../../chunks/dates.js";
import { h as TREE_STATUS_LABELS } from "../../../chunks/enums.js";
// src/lib/components/TreeCard.svelte
function TreeCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { tree } = $$props;
		const subtitle = derived(() => [
			tree.nickname ? [tree.commonName, tree.variety].filter(Boolean).join(" ") : null,
			tree.zoneName,
			tree.ageYears != null ? `planté il y a ${formatAge(tree.ageYears)}` : null,
			tree.status !== "planted" ? TREE_STATUS_LABELS[tree.status] : null
		].filter(Boolean).join(" · "));
		$$renderer.push(`<a class="card tree svelte-xxlyni"${attr("href", `/arbres/${stringify(tree.id)}`)}>`);
		if (tree.coverThumb) $$renderer.push(`<!--[0--><img${attr("src", `/photos/${stringify(tree.coverThumb)}`)} alt="" loading="lazy" class="svelte-xxlyni"/>`);
		else $$renderer.push(`<!--[-1--><span class="placeholder svelte-xxlyni" aria-hidden="true">🌳</span>`);
		$$renderer.push(`<!--]--> <span class="text svelte-xxlyni"><strong>${escape_html(tree.name)}</strong> `);
		if (subtitle()) $$renderer.push(`<!--[0--><span class="muted svelte-xxlyni">${escape_html(subtitle())}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></span></a>`);
	});
}
// src/routes/arbres/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("ydx1ds", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Arbres · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<div class="page-header"><h1>Arbres</h1> <a class="btn primary small" href="/arbres/nouveau">+ Ajouter</a></div> `);
		if (data.purchased.length) {
			$$renderer.push(`<!--[0--><h2>À planter (${escape_html(data.purchased.length)})</h2> <ul class="list"><!--[-->`);
			const each_array = ensure_array_like(data.purchased);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let tree = each_array[$$index];
				$$renderer.push(`<li>`);
				TreeCard($$renderer, { tree });
				$$renderer.push(`<!----></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2>Plantés (${escape_html(data.planted.length)})</h2> <ul class="list">`);
		const each_array_1 = ensure_array_like(data.planted);
		if (each_array_1.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let tree = each_array_1[$$index_1];
				$$renderer.push(`<li>`);
				TreeCard($$renderer, { tree });
				$$renderer.push(`<!----></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="muted">Aucun arbre planté pour l'instant.</li>`);
		$$renderer.push(`<!--]--></ul> `);
		if (data.gone.length) {
			$$renderer.push(`<!--[0--><details class="svelte-ydx1ds"><summary class="svelte-ydx1ds"><h2 class="svelte-ydx1ds">Morts ou retirés (${escape_html(data.gone.length)})</h2></summary> <ul class="list"><!--[-->`);
			const each_array_2 = ensure_array_like(data.gone);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let tree = each_array_2[$$index_2];
				$$renderer.push(`<li>`);
				TreeCard($$renderer, { tree });
				$$renderer.push(`<!----></li>`);
			}
			$$renderer.push(`<!--]--></ul></details>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map