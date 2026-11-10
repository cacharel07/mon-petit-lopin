import { TREE_STATUSES } from '../domain/enums.ts';
import { catalogEntry } from './catalog.ts';
import { ensureTemplateFromCatalog } from './catalog-templates.ts';
import { db } from './db/index.ts';
import { FormError, bool, date, decimal, int, oneOf, requiredText, text } from './forms.ts';

/**
 * The species select holds either a template id or `catalog:<key>` for a
 * catalogue entry not imported yet; the template is then created on save.
 */
function templateId(form: FormData): number | null {
	const value = text(form, 'speciesTemplateId');
	if (value?.startsWith('catalog:')) {
		const key = value.slice('catalog:'.length);
		if (!catalogEntry(key)) throw new FormError("Modèle d'espèce inconnu.");
		return ensureTemplateFromCatalog(db, key);
	}
	return int(form, 'speciesTemplateId', "Modèle d'espèce");
}

export function parseTreeForm(form: FormData) {
	return {
		tree: {
			speciesTemplateId: templateId(form),
			zoneId: int(form, 'zoneId', 'Zone'),
			commonName: requiredText(form, 'commonName', 'Nom commun'),
			species: text(form, 'species'),
			variety: text(form, 'variety'),
			nickname: text(form, 'nickname'),
			status: oneOf(form, 'status', TREE_STATUSES, 'Statut'),
			purchaseDate: date(form, 'purchaseDate', "Date d'achat"),
			nursery: text(form, 'nursery'),
			plantingDate: date(form, 'plantingDate', 'Date de plantation'),
			rootstock: text(form, 'rootstock'),
			pollinatorRequired: bool(form, 'pollinatorRequired'),
			pollinationNotes: text(form, 'pollinationNotes'),
			recommendedSpacingM: decimal(form, 'recommendedSpacingM', 'Distance conseillée'),
			nurseryAdvice: text(form, 'nurseryAdvice'),
			notes: text(form, 'notes')
		},
		pollinatorIds: form
			.getAll('pollinatorIds')
			.map(Number)
			.filter((n) => Number.isInteger(n))
	};
}
