/**
 * Enumerations shared by the database schema and the UI.
 * Keys are English (stored in DB), labels are French (displayed).
 */

export const TREE_STATUSES = ['purchased', 'planted', 'dead', 'removed'] as const;
export type TreeStatus = (typeof TREE_STATUSES)[number];
export const TREE_STATUS_LABELS: Record<TreeStatus, string> = {
	purchased: 'Acheté, à planter',
	planted: 'Planté',
	dead: 'Mort',
	removed: 'Retiré'
};

export const SPECIES_CATEGORIES = [
	'fruit_tree',
	'nut_tree',
	'ornamental',
	'shrub',
	'other'
] as const;
export type SpeciesCategory = (typeof SPECIES_CATEGORIES)[number];
export const SPECIES_CATEGORY_LABELS: Record<SpeciesCategory, string> = {
	fruit_tree: 'Fruitier',
	nut_tree: 'Fruit à coque',
	ornamental: 'Ornemental',
	shrub: 'Arbuste',
	other: 'Autre'
};

export const CARE_RULE_TYPES = [
	'pruning_formation',
	'pruning_fruiting',
	'pruning_summer',
	'pruning_winter',
	'watering',
	'fertilizing',
	'mulching',
	'treatment',
	'harvest',
	'other'
] as const;
export type CareRuleType = (typeof CARE_RULE_TYPES)[number];
export const CARE_RULE_TYPE_LABELS: Record<CareRuleType, string> = {
	pruning_formation: 'Taille de formation',
	pruning_fruiting: 'Taille de fructification',
	pruning_summer: 'Taille en vert',
	pruning_winter: "Taille d'hiver",
	watering: 'Arrosage',
	fertilizing: 'Fertilisation',
	mulching: 'Paillage',
	treatment: 'Traitement préventif',
	harvest: 'Récolte',
	other: 'Autre'
};

export const INTERVENTION_TYPES = [
	'pruning',
	'watering',
	'fertilizing',
	'mulching',
	'treatment',
	'harvest',
	'planting',
	'observation',
	'other'
] as const;
export type InterventionType = (typeof INTERVENTION_TYPES)[number];
export const INTERVENTION_TYPE_LABELS: Record<InterventionType, string> = {
	pruning: 'Taille',
	watering: 'Arrosage',
	fertilizing: 'Fertilisation',
	mulching: 'Paillage',
	treatment: 'Traitement',
	harvest: 'Récolte',
	planting: 'Plantation',
	observation: 'Observation',
	other: 'Autre'
};

/** Which intervention type fulfils a care rule of a given type. */
export const CARE_RULE_TO_INTERVENTION: Record<CareRuleType, InterventionType> = {
	pruning_formation: 'pruning',
	pruning_fruiting: 'pruning',
	pruning_summer: 'pruning',
	pruning_winter: 'pruning',
	watering: 'watering',
	fertilizing: 'fertilizing',
	mulching: 'mulching',
	treatment: 'treatment',
	harvest: 'harvest',
	other: 'other'
};

export const PROJECT_STATUSES = ['planned', 'in_progress', 'done'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
	planned: 'À venir',
	in_progress: 'En cours',
	done: 'Terminé'
};

export const PROJECT_PRIORITIES = ['low', 'medium', 'high'] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];
export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
	low: 'Basse',
	medium: 'Moyenne',
	high: 'Haute'
};

export const PHOTO_PHASES = ['before', 'during', 'after'] as const;
export type PhotoPhase = (typeof PHOTO_PHASES)[number];
export const PHOTO_PHASE_LABELS: Record<PhotoPhase, string> = {
	before: 'Avant',
	during: 'Pendant',
	after: 'Après'
};
