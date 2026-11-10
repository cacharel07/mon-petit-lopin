import { i as redirect } from "../../../chunks/exports.js";
import { d as tree, n as db, r as careRule } from "../../../chunks/db.js";
import { i as catalogEntry, n as importedCatalogKeys, t as ensureTemplateFromCatalog } from "../../../chunks/catalog-templates.js";
import { t as catalogForForms } from "../../../chunks/catalog-view.js";
import { f as withForm, t as FormError, u as requiredText } from "../../../chunks/forms.js";
import { f as listTemplates } from "../../../chunks/trees.js";
import { count, isNotNull } from "drizzle-orm";
// src/routes/especes/+page.server.ts
var load = () => {
	const rules = db.select({
		templateId: careRule.speciesTemplateId,
		verified: careRule.verified
	}).from(careRule).where(isNotNull(careRule.speciesTemplateId)).all();
	const trees = new Map(db.select({
		id: tree.speciesTemplateId,
		n: count()
	}).from(tree).groupBy(tree.speciesTemplateId).all().map((r) => [r.id, r.n]));
	const imported = importedCatalogKeys(db);
	return {
		catalog: catalogForForms().filter((e) => !imported.has(e.key)),
		templates: listTemplates().map((t) => {
			const own = rules.filter((r) => r.templateId === t.id);
			return {
				...t,
				ruleCount: own.length,
				unverified: own.filter((r) => !r.verified).length,
				treeCount: trees.get(t.id) ?? 0
			};
		})
	};
};
var actions = { 
/** Create a template (and its care rules) from a catalogue entry. */
import: ({ request }) => withForm(request, (form) => {
	const key = requiredText(form, "key", "Espèce");
	if (!catalogEntry(key)) throw new FormError("Espèce inconnue.");
	redirect(303, `/especes/${ensureTemplateFromCatalog(db, key)}`);
}) };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map