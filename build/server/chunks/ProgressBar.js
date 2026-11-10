import { l as attr, n as attr_style, s as stringify } from "./server2.js";
// src/lib/components/ProgressBar.svelte
function ProgressBar($$renderer, $$props) {
	let { value } = $$props;
	$$renderer.push(`<div class="bar svelte-1qjgclg" role="progressbar"${attr("aria-valuenow", value)}${attr("aria-valuemin", 0)}${attr("aria-valuemax", 100)}><div class="fill svelte-1qjgclg"${attr_style("", { width: `${stringify(value)}%` })}></div></div>`);
}
export { ProgressBar as t };

//# sourceMappingURL=ProgressBar.js.map