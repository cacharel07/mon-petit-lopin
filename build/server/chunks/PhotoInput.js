import { c as formatDate } from "./dates.js";
import { i as ensure_array_like, l as attr, s as stringify, u as escape_html } from "./server2.js";
// src/lib/components/PhotoGrid.svelte
function PhotoGrid($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { photos, deleteAction = "?/deletePhoto", showDates = true } = $$props;
		if (photos.length) {
			$$renderer.push(`<!--[0--><div class="photo-grid"><!--[-->`);
			const each_array = ensure_array_like(photos);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let p = each_array[$$index];
				$$renderer.push(`<figure><a${attr("href", `/photos/${stringify(p.fileName)}`)} target="_blank" rel="noopener"><img${attr("src", `/photos/${stringify(p.thumbName)}`)}${attr("alt", p.caption ?? "Photo")} loading="lazy"/></a> <figcaption><span>${escape_html(showDates ? formatDate(p.takenAt) : "")}</span> `);
				if (deleteAction) $$renderer.push(`<!--[0--><form method="POST"${attr("action", deleteAction)}><input type="hidden" name="photoId"${attr("value", p.id)}/> <button class="btn link" type="submit" aria-label="Supprimer la photo">✕</button></form>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></figcaption></figure>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
// src/lib/components/PhotoInput.svelte
function PhotoInput($$renderer, $$props) {
	let { name = "photos", label = "Photos" } = $$props;
	$$renderer.push(`<label>${escape_html(label)} <input${attr("name", name)} type="file" accept="image/*" multiple=""/></label>`);
}
export { PhotoGrid as n, PhotoInput as t };

//# sourceMappingURL=PhotoInput.js.map