import { r as CATALOG } from "./catalog-templates.js";
// src/lib/server/catalog-view.ts
/** Serializable catalogue data for forms and pickers. */
function catalogForForms() {
	return CATALOG.map((e) => ({
		key: e.key,
		commonName: e.commonName,
		latinName: e.latinName,
		category: e.category,
		needsPollinator: e.needsPollinator,
		defaultSpacingM: e.defaultSpacingM,
		altitudeWarning: e.altitudeWarning ?? null,
		varieties: e.varieties ?? [],
		rootstocks: e.rootstocks ?? []
	}));
}
export { catalogForForms as t };

//# sourceMappingURL=catalog-view.js.map