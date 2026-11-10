import { a as head, l as attr, u as escape_html } from "../../../chunks/server2.js";
import { t as logo_default } from "../../../chunks/logo.js";
// src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { form } = $$props;
		head("1x05zx6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Connexion · Mon petit lopin</title>`);
			});
		});
		$$renderer.push(`<div class="login svelte-1x05zx6"><img class="logo svelte-1x05zx6"${attr("src", logo_default)} alt="Mon petit lopin" width="480" height="480"/> <form method="POST" class="card stack">`);
		if (form?.error) $$renderer.push(`<!--[0--><p class="error">${escape_html(form.error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label>Identifiant <input name="username" autocomplete="username"${attr("value", form?.username ?? "")} required=""/></label> <label>Mot de passe <input name="password" type="password" autocomplete="current-password" required=""/></label> <button class="btn primary" type="submit">Se connecter</button></form></div>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map