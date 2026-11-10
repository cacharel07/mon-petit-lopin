import type { CareRuleType, SpeciesCategory } from '../../domain/enums.ts';

/*
 * Initial data. Care values are SUGGESTIONS for a mid-mountain climate
 * (Haute-Loire, ~850 m: late frosts until mid-May, cold winters, vegetation
 * 2 to 3 weeks behind the lowlands). Every rule is seeded with
 * `verified: false` and shown as « à vérifier » until validated in the app.
 */

export interface SeedRule {
	type: CareRuleType;
	label: string;
	start: [month: number, day: number];
	end: [month: number, day: number];
	intervalDays?: number;
	minAgeYears?: number;
	maxAgeYears?: number;
	notes?: string;
}

export interface SeedTemplate {
	commonName: string;
	latinName: string;
	category: SpeciesCategory;
	defaultSpacingM: number;
	needsPollinator: boolean;
	notes: string;
	rules: SeedRule[];
}

const youngTreeWatering = (intervalDays = 10, maxAgeYears = 3): SeedRule => ({
	type: 'watering',
	label: 'Arrosage du jeune arbre',
	start: [5, 15],
	end: [9, 15],
	intervalDays,
	maxAgeYears,
	notes:
		'Environ 20 à 30 L par arrosage, au pied, de préférence le soir. À espacer après une bonne pluie, à rapprocher en cas de sécheresse. Les 2 à 3 premières années seulement.'
});

const compost: SeedRule = {
	type: 'fertilizing',
	label: 'Apport de compost',
	start: [3, 15],
	end: [4, 30],
	notes: 'Compost bien décomposé ou fumier composté au pied, sur la surface de la couronne.'
};

const mulching: SeedRule = {
	type: 'mulching',
	label: 'Paillage',
	start: [5, 1],
	end: [5, 31],
	notes:
		'Pailler une fois le sol réchauffé (pas trop tôt en altitude). Garder le collet dégagé. Désherber le pied avant.'
};

const copperAtLeafFall: SeedRule = {
	type: 'treatment',
	label: 'Cuivre à la chute des feuilles',
	start: [10, 15],
	end: [11, 30],
	notes: 'Bouillie bordelaise à la chute des feuilles (chancres, maladies cryptogamiques).'
};

export const SPECIES_TEMPLATES: SeedTemplate[] = [
	{
		commonName: 'Pommier',
		latinName: 'Malus domestica',
		category: 'fruit_tree',
		defaultSpacingM: 6,
		needsPollinator: true,
		notes:
			"La plupart des variétés ont besoin d'un pollinisateur (autre pommier fleurissant en même temps). Espacement selon le porte-greffe : 2 à 3 m (M9), 4 à 5 m (MM106), 6 à 8 m (franc).",
		rules: [
			{
				type: 'pruning_formation',
				label: 'Taille de formation',
				start: [2, 15],
				end: [3, 31],
				maxAgeYears: 4,
				notes:
					'Hors période de gel, avant le débourrement. Construire la charpente : 3 à 4 branches principales bien réparties.'
			},
			{
				type: 'pruning_fruiting',
				label: 'Taille de fructification',
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 4,
				notes: 'Éclaircir le centre, renouveler les rameaux fruitiers, supprimer le bois mort.'
			},
			{
				type: 'pruning_summer',
				label: 'Taille en vert',
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 2,
				notes: 'Pincer ou raccourcir les pousses vigoureuses de l’année, supprimer les gourmands.'
			},
			{
				type: 'treatment',
				label: 'Prévention tavelure au débourrement',
				start: [3, 20],
				end: [4, 30],
				notes: 'Cuivre ou soufre au débourrement, surtout par printemps humide.'
			},
			copperAtLeafFall,
			youngTreeWatering(),
			compost,
			mulching,
			{
				type: 'harvest',
				label: 'Récolte',
				start: [9, 1],
				end: [10, 31],
				notes: 'Selon la variété. Les fruits mûrs se détachent en les soulevant.'
			}
		]
	},
	{
		commonName: 'Cerisier',
		latinName: 'Prunus avium',
		category: 'fruit_tree',
		defaultSpacingM: 7,
		needsPollinator: true,
		notes:
			'Beaucoup de variétés sont autostériles (pollinisateur nécessaire) ; certaines sont autofertiles (Stella, Sunburst…). Le cerisier craint les grosses coupes en hiver (gommose) : tailler de préférence en été.',
		rules: [
			{
				type: 'pruning_formation',
				label: 'Taille de formation',
				start: [3, 15],
				end: [4, 15],
				maxAgeYears: 4,
				notes: 'Coupes légères, par temps sec, à la reprise de végétation.'
			},
			{
				type: 'pruning_summer',
				label: 'Taille après récolte',
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 3,
				notes:
					'Juste après la récolte : aérer, supprimer le bois mort et les branches mal placées. Cicatrisation plus rapide qu’en hiver.'
			},
			copperAtLeafFall,
			youngTreeWatering(),
			compost,
			mulching,
			{
				type: 'harvest',
				label: 'Récolte',
				start: [7, 1],
				end: [8, 15],
				notes: 'Plus tardive qu’en plaine à cette altitude. Protéger des oiseaux si besoin.'
			}
		]
	},
	{
		commonName: 'Poirier',
		latinName: 'Pyrus communis',
		category: 'fruit_tree',
		defaultSpacingM: 5,
		needsPollinator: true,
		notes:
			"Presque toujours besoin d'un pollinisateur compatible. Floraison précoce : sensible aux gelées tardives, préférer un emplacement abrité, pas en fond de cuvette.",
		rules: [
			{
				type: 'pruning_formation',
				label: 'Taille de formation',
				start: [2, 15],
				end: [3, 31],
				maxAgeYears: 4,
				notes: 'Hors gel, avant le débourrement. Port naturellement érigé : ouvrir le centre.'
			},
			{
				type: 'pruning_fruiting',
				label: 'Taille de fructification',
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 4,
				notes: 'Conserver les dards et lambourdes, supprimer les rameaux mal placés.'
			},
			{
				type: 'pruning_summer',
				label: 'Taille en vert',
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 2
			},
			{
				type: 'treatment',
				label: 'Prévention tavelure au débourrement',
				start: [3, 15],
				end: [4, 30],
				notes: 'Cuivre au débourrement.'
			},
			copperAtLeafFall,
			youngTreeWatering(),
			compost,
			mulching,
			{
				type: 'harvest',
				label: 'Récolte',
				start: [8, 15],
				end: [10, 15],
				notes: 'Cueillir un peu avant maturité complète et laisser mûrir au frais.'
			}
		]
	},
	{
		commonName: 'Noisetier',
		latinName: 'Corylus avellana',
		category: 'nut_tree',
		defaultSpacingM: 4,
		needsPollinator: true,
		notes:
			'Pollinisation par le vent, meilleure avec deux variétés ou un noisetier sauvage à proximité. Très rustique.',
		rules: [
			{
				type: 'pruning_winter',
				label: 'Éclaircie et recépage',
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 3,
				notes:
					'Après la floraison (chatons) : supprimer les plus vieilles tiges et les rejets en excès, garder 5 à 8 tiges.'
			},
			youngTreeWatering(14, 2),
			mulching,
			{
				type: 'harvest',
				label: 'Récolte',
				start: [9, 1],
				end: [10, 15],
				notes: 'Ramasser au sol quand les noisettes tombent seules.'
			}
		]
	},
	{
		commonName: 'Sumac de Virginie',
		latinName: 'Rhus typhina',
		category: 'ornamental',
		defaultSpacingM: 4,
		needsPollinator: false,
		notes:
			'Très rustique et peu exigeant. Drageonne fortement : prévoir de supprimer les rejets, ou poser une barrière anti-rhizomes. Sève irritante : porter des gants.',
		rules: [
			{
				type: 'pruning_winter',
				label: 'Taille légère',
				start: [2, 15],
				end: [3, 31],
				notes: 'Facultative : supprimer le bois mort et équilibrer la silhouette.'
			},
			{
				type: 'other',
				label: 'Suppression des drageons',
				start: [6, 1],
				end: [9, 30],
				intervalDays: 45,
				minAgeYears: 1,
				notes: 'Arracher les rejets au plus près de la racine plutôt que de les couper.'
			},
			{
				type: 'watering',
				label: 'Arrosage de la première année',
				start: [6, 1],
				end: [8, 31],
				intervalDays: 14,
				maxAgeYears: 1,
				notes: 'Résiste bien à la sécheresse une fois installé.'
			}
		]
	}
];

export const ZONES = [
	'Devant la maison',
	'Terrasse',
	'Verger',
	'Terrain de pétanque',
	'Fond près de l’abri'
];
