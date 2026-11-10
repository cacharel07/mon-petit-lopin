import { CARE_RULE_TYPES } from '../domain/enums.ts';
import { FormError, bool, int, oneOf, requiredInt, requiredText, text } from './forms.ts';

// Days per month, allowing Feb 29 (handled as Feb 28 in non-leap years).
const MAX_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function dayMonth(form: FormData, prefix: 'start' | 'end', label: string) {
	const month = requiredInt(form, `${prefix}Month`, `Mois de ${label}`);
	const day = requiredInt(form, `${prefix}Day`, `Jour de ${label}`);
	if (month < 1 || month > 12) throw new FormError(`Mois de ${label} invalide.`);
	if (day < 1 || day > MAX_DAYS[month - 1]) throw new FormError(`Jour de ${label} invalide.`);
	return { month, day };
}

/** Parse the care rule form shared by species templates and trees. */
export function parseCareRuleForm(form: FormData) {
	const start = dayMonth(form, 'start', 'début');
	const end = dayMonth(form, 'end', 'fin');
	const intervalDays = int(form, 'intervalDays', 'Fréquence');
	const minAgeYears = int(form, 'minAgeYears', 'Âge minimum');
	const maxAgeYears = int(form, 'maxAgeYears', 'Âge maximum');
	if (intervalDays !== null && intervalDays < 1) {
		throw new FormError('La fréquence doit être d’au moins 1 jour.');
	}
	if ((minAgeYears ?? 0) < 0 || (maxAgeYears ?? 1) < 1) throw new FormError('Âge invalide.');
	if (minAgeYears !== null && maxAgeYears !== null && minAgeYears >= maxAgeYears) {
		throw new FormError('L’âge minimum doit être inférieur à l’âge maximum.');
	}
	return {
		type: oneOf(form, 'type', CARE_RULE_TYPES, 'Type'),
		label: requiredText(form, 'label', 'Libellé'),
		startMonth: start.month,
		startDay: start.day,
		endMonth: end.month,
		endDay: end.day,
		intervalDays,
		minAgeYears,
		maxAgeYears,
		verified: bool(form, 'verified'),
		notes: text(form, 'notes')
	};
}

/** Copy of a rule's editable fields (used to prefill or create an override). */
export function ruleFields(rule: ReturnType<typeof parseCareRuleForm>) {
	const { type, label, startMonth, startDay, endMonth, endDay } = rule;
	const { intervalDays, minAgeYears, maxAgeYears, verified, notes } = rule;
	return {
		type,
		label,
		startMonth,
		startDay,
		endMonth,
		endDay,
		intervalDays,
		minAgeYears,
		maxAgeYears,
		verified,
		notes
	};
}
