import { TREE_STATUSES } from '../domain/enums.ts';
import { bool, date, decimal, int, oneOf, requiredText, text } from './forms.ts';

export function parseTreeForm(form: FormData) {
	return {
		tree: {
			speciesTemplateId: int(form, 'speciesTemplateId', "Modèle d'espèce"),
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
