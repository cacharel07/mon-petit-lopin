import { SPECIES_CATEGORIES } from '../domain/enums.ts';
import { bool, decimal, oneOf, requiredText, text } from './forms.ts';

export function parseTemplateForm(form: FormData) {
	return {
		commonName: requiredText(form, 'commonName', 'Nom commun'),
		latinName: text(form, 'latinName'),
		category: oneOf(form, 'category', SPECIES_CATEGORIES, 'Catégorie'),
		defaultSpacingM: decimal(form, 'defaultSpacingM', 'Espacement'),
		needsPollinator: bool(form, 'needsPollinator'),
		notes: text(form, 'notes')
	};
}
