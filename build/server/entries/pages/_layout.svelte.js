import { a as head, i as ensure_array_like, l as attr, r as derived, t as attr_class, u as escape_html } from "../../chunks/server2.js";
import { t as page } from "../../chunks/state.js";
// src/lib/assets/favicon.svg
var favicon_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3e%3ccircle%20cx='32'%20cy='26'%20r='20'%20fill='%234a7c3a'/%3e%3crect%20x='29'%20y='38'%20width='6'%20height='22'%20rx='2'%20fill='%237a5230'/%3e%3c/svg%3e";
// src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const links = [
			{
				href: "/",
				label: "Accueil",
				icon: "🏡"
			},
			{
				href: "/arbres",
				label: "Arbres",
				icon: "🌳"
			},
			{
				href: "/travaux",
				label: "Travaux",
				icon: "🛠️"
			},
			{
				href: "/plus",
				label: "Plus",
				icon: "☰"
			}
		];
		const isActive = (href) => href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href);
		const showNav = derived(() => !page.url.pathname.startsWith("/login"));
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.push(`<link rel="icon"${attr("href", favicon_default)}/> <link rel="apple-touch-icon" href="/apple-touch-icon.png"/> <meta name="theme-color" content="#4a7c3a"/>`);
		});
		$$renderer.push(`<main${attr_class("svelte-12qhfyh", void 0, { "with-nav": showNav() })}>`);
		children($$renderer);
		$$renderer.push(`<!----></main> `);
		if (showNav()) {
			$$renderer.push(`<!--[0--><nav class="svelte-12qhfyh"><!--[-->`);
			const each_array = ensure_array_like(links);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let link = each_array[$$index];
				$$renderer.push(`<a${attr("href", link.href)}${attr_class("svelte-12qhfyh", void 0, { "active": isActive(link.href) })}><span class="icon svelte-12qhfyh" aria-hidden="true">${escape_html(link.icon)}</span> <span>${escape_html(link.label)}</span></a>`);
			}
			$$renderer.push(`<!--]--></nav>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map