import { f as SPECIES_CATEGORIES } from "./enums.js";
import { d as text, i as decimal, n as bool, s as oneOf, u as requiredText } from "./forms.js";
// src/lib/server/template-form.ts
function parseTemplateForm(form) {
	return {
		commonName: requiredText(form, "commonName", "Nom commun"),
		latinName: text(form, "latinName"),
		category: oneOf(form, "category", SPECIES_CATEGORIES, "Catégorie"),
		defaultSpacingM: decimal(form, "defaultSpacingM", "Espacement"),
		needsPollinator: bool(form, "needsPollinator"),
		notes: text(form, "notes")
	};
}
export { parseTemplateForm as t };

//# sourceMappingURL=template-form.js.map