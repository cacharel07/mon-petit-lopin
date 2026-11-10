// src/lib/domain/enums.ts
/**
* Enumerations shared by the database schema and the UI.
* Keys are English (stored in DB), labels are French (displayed).
*/
var TREE_STATUSES = [
	"purchased",
	"planted",
	"dead",
	"removed"
];
var TREE_STATUS_LABELS = {
	purchased: "Acheté, à planter",
	planted: "Planté",
	dead: "Mort",
	removed: "Retiré"
};
var SPECIES_CATEGORIES = [
	"fruit_tree",
	"nut_tree",
	"small_fruit",
	"ornamental",
	"hedge",
	"shrub",
	"other"
];
var SPECIES_CATEGORY_LABELS = {
	fruit_tree: "Fruitier",
	nut_tree: "Fruit à coque",
	small_fruit: "Petit fruit",
	ornamental: "Ornemental",
	hedge: "Haie",
	shrub: "Arbuste",
	other: "Autre"
};
var CARE_RULE_TYPES = [
	"pruning_formation",
	"pruning_fruiting",
	"pruning_summer",
	"pruning_winter",
	"watering",
	"fertilizing",
	"mulching",
	"treatment",
	"harvest",
	"other"
];
var CARE_RULE_TYPE_LABELS = {
	pruning_formation: "Taille de formation",
	pruning_fruiting: "Taille de fructification",
	pruning_summer: "Taille en vert",
	pruning_winter: "Taille d'hiver",
	watering: "Arrosage",
	fertilizing: "Fertilisation",
	mulching: "Paillage",
	treatment: "Traitement préventif",
	harvest: "Récolte",
	other: "Autre"
};
var INTERVENTION_TYPES = [
	"pruning",
	"watering",
	"fertilizing",
	"mulching",
	"treatment",
	"harvest",
	"planting",
	"observation",
	"other"
];
var INTERVENTION_TYPE_LABELS = {
	pruning: "Taille",
	watering: "Arrosage",
	fertilizing: "Fertilisation",
	mulching: "Paillage",
	treatment: "Traitement",
	harvest: "Récolte",
	planting: "Plantation",
	observation: "Observation",
	other: "Autre"
};
/** Which intervention type fulfils a care rule of a given type. */
var CARE_RULE_TO_INTERVENTION = {
	pruning_formation: "pruning",
	pruning_fruiting: "pruning",
	pruning_summer: "pruning",
	pruning_winter: "pruning",
	watering: "watering",
	fertilizing: "fertilizing",
	mulching: "mulching",
	treatment: "treatment",
	harvest: "harvest",
	other: "other"
};
var PROJECT_STATUSES = [
	"planned",
	"in_progress",
	"done"
];
var PROJECT_STATUS_LABELS = {
	planned: "À venir",
	in_progress: "En cours",
	done: "Terminé"
};
var PROJECT_PRIORITIES = [
	"low",
	"medium",
	"high"
];
var PROJECT_PRIORITY_LABELS = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute"
};
var PHOTO_PHASES = [
	"before",
	"during",
	"after"
];
var PHOTO_PHASE_LABELS = {
	before: "Avant",
	during: "Pendant",
	after: "Après"
};
export { INTERVENTION_TYPE_LABELS as a, PROJECT_PRIORITIES as c, PROJECT_STATUS_LABELS as d, SPECIES_CATEGORIES as f, TREE_STATUS_LABELS as h, INTERVENTION_TYPES as i, PROJECT_PRIORITY_LABELS as l, TREE_STATUSES as m, CARE_RULE_TYPES as n, PHOTO_PHASES as o, SPECIES_CATEGORY_LABELS as p, CARE_RULE_TYPE_LABELS as r, PHOTO_PHASE_LABELS as s, CARE_RULE_TO_INTERVENTION as t, PROJECT_STATUSES as u };

//# sourceMappingURL=enums.js.map