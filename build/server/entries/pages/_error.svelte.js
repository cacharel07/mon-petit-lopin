import { a as head, u as escape_html } from "../../chunks/server2.js";
import { t as page } from "../../chunks/state.js";
// src/routes/+error.svelte
function _error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1j96wlh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Erreur · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<h1>${escape_html(page.status === 404 ? "Page introuvable" : "Une erreur est survenue")}</h1> <p class="muted">${escape_html(page.error?.message)}</p> <p><a class="btn" href="/">Retour au tableau de bord</a></p>`);
	});
}
export { _error as default };

//# sourceMappingURL=_error.svelte.js.map