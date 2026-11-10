import { l as attr } from "./server2.js";
import { t as page } from "./state.js";
// src/lib/components/DoneButton.svelte
function DoneButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...props } = $$props;
		let sent = false;
		$$renderer.push(`<form method="POST" action="/echeances/fait"><input type="hidden" name="kind"${attr("value", props.kind)}/> `);
		if (props.kind === "care") $$renderer.push(`<!--[0--><input type="hidden" name="treeId"${attr("value", props.treeId)}/> <input type="hidden" name="ruleId"${attr("value", props.ruleId)}/>`);
		else $$renderer.push(`<!--[-1--><input type="hidden" name="taskId"${attr("value", props.taskId)}/>`);
		$$renderer.push(`<!--]--> <input type="hidden" name="redirectTo"${attr("value", page.url.pathname + page.url.search)}/> <button class="btn small done svelte-1411oew" type="submit"${attr("disabled", sent, true)}>✓ Fait</button></form>`);
	});
}
export { DoneButton as t };

//# sourceMappingURL=DoneButton.js.map