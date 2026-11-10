import { CATALOG } from './catalog.ts';

/** Serializable catalogue data for forms and pickers. */
export function catalogForForms() {
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

export type CatalogOption = ReturnType<typeof catalogForForms>[number];
