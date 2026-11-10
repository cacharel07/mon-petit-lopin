import { m as TREE_STATUSES } from "./enums.js";
import { i as catalogEntry, t as ensureTemplateFromCatalog } from "./catalog-templates.js";
import { n as db } from "./db.js";
import { d as text, i as decimal, n as bool, o as int, r as date, s as oneOf, t as FormError, u as requiredText } from "./forms.js";
// src/lib/server/tree-form.ts
/**
* The species select holds either a template id or `catalog:<key>` for a
* catalogue entry not imported yet; the template is then created on save.
*/
function templateId(form) {
	const value = text(form, "speciesTemplateId");
	if (value?.startsWith("catalog:")) {
		const key = value.slice(8);
		if (!catalogEntry(key)) throw new FormError("Modèle d'espèce inconnu.");
		return ensureTemplateFromCatalog(db, key);
	}
	return int(form, "speciesTemplateId", "Modèle d'espèce");
}
function parseTreeForm(form) {
	return {
		tree: {
			speciesTemplateId: templateId(form),
			zoneId: int(form, "zoneId", "Zone"),
			commonName: requiredText(form, "commonName", "Nom commun"),
			species: text(form, "species"),
			variety: text(form, "variety"),
			nickname: text(form, "nickname"),
			status: oneOf(form, "status", TREE_STATUSES, "Statut"),
			purchaseDate: date(form, "purchaseDate", "Date d'achat"),
			nursery: text(form, "nursery"),
			plantingDate: date(form, "plantingDate", "Date de plantation"),
			rootstock: text(form, "rootstock"),
			pollinatorRequired: bool(form, "pollinatorRequired"),
			pollinationNotes: text(form, "pollinationNotes"),
			recommendedSpacingM: decimal(form, "recommendedSpacingM", "Distance conseillée"),
			nurseryAdvice: text(form, "nurseryAdvice"),
			notes: text(form, "notes")
		},
		pollinatorIds: form.getAll("pollinatorIds").map(Number).filter((n) => Number.isInteger(n))
	};
}
export { parseTreeForm as t };

//# sourceMappingURL=tree-form.js.map