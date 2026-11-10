import { r as careRule, u as speciesTemplate } from "./db.js";
import { eq } from "drizzle-orm";
// src/lib/server/catalog.ts
var youngWatering = (intervalDays = 10, maxAgeYears = 3) => ({
	type: "watering",
	label: "Arrosage du jeune arbre",
	start: [5, 15],
	end: [9, 15],
	intervalDays,
	maxAgeYears,
	notes: "Environ 20 à 30 L par arrosage, au pied, de préférence le soir. À espacer après une bonne pluie, à rapprocher en cas de sécheresse. Les premières années seulement."
});
var youngShrubWatering = (intervalDays = 7, maxAgeYears = 2) => ({
	type: "watering",
	label: "Arrosage de la jeune plantation",
	start: [6, 1],
	end: [8, 31],
	intervalDays,
	maxAgeYears,
	notes: "Environ 10 L par pied, au pied, le soir. À adapter à la météo."
});
var compost = {
	type: "fertilizing",
	label: "Apport de compost",
	start: [3, 15],
	end: [4, 30],
	notes: "Compost bien décomposé ou fumier composté au pied, sur la surface de la couronne."
};
var mulching = {
	type: "mulching",
	label: "Paillage",
	start: [5, 1],
	end: [5, 31],
	notes: "Pailler une fois le sol réchauffé (pas trop tôt en altitude). Garder le collet dégagé. Désherber le pied avant."
};
var copperAtLeafFall = {
	type: "treatment",
	label: "Cuivre à la chute des feuilles",
	start: [10, 15],
	end: [11, 30],
	notes: "Bouillie bordelaise à la chute des feuilles (chancres, maladies cryptogamiques)."
};
var winterFormation = (maxAgeYears = 4, notes) => ({
	type: "pruning_formation",
	label: "Taille de formation",
	start: [2, 15],
	end: [3, 31],
	maxAgeYears,
	notes: notes ?? "Hors période de gel, avant le débourrement. Construire la charpente : 3 à 4 branches principales bien réparties."
});
var hedgeTrim = {
	type: "pruning_summer",
	label: "Taille de la haie",
	start: [8, 15],
	end: [9, 30],
	minAgeYears: 1,
	notes: "Après la période de nidification des oiseaux (déconseillé de mi-mars à fin juillet). Tailler plus large à la base qu’au sommet."
};
var CATALOG = [
	{
		key: "pommier",
		commonName: "Pommier",
		latinName: "Malus domestica",
		category: "fruit_tree",
		defaultSpacingM: 6,
		needsPollinator: true,
		notes: `La plupart des variétés ont besoin d'un pollinisateur (autre pommier fleurissant en même temps). Espacement selon le porte-greffe : 2 à 3 m (M9), 3 à 4 m (M26), 4 à 5 m (MM106), 6 à 8 m (MM111 ou franc). Le porte-greffe détermine la taille adulte : vérifier l’étiquette de la pépinière.`,
		rootstocks: [
			"M9 (nain, 2 à 3 m)",
			"M26 (3 à 4 m)",
			"MM106 (demi-tige, 4 à 5 m)",
			"MM111 (vigoureux)",
			"Franc (haute tige, 6 à 8 m)"
		],
		varieties: [
			{
				name: "Reine des Reinettes",
				notes: "Bon pollinisateur. Floraison mi-saison. Récolte septembre."
			},
			{
				name: "Golden Delicious",
				notes: "Très bon pollinisateur pour la plupart des variétés. Récolte octobre."
			},
			{
				name: "Reinette grise du Canada",
				notes: "Triploïde : mauvais pollinisateur, a besoin de deux autres variétés. Rustique, garde bien."
			},
			{
				name: "Belle de Boskoop",
				notes: "Triploïde : mauvais pollinisateur. Vigoureuse, rustique. Récolte octobre."
			},
			{
				name: "Melrose",
				notes: "Bonne conservation. A besoin d’un pollinisateur. Récolte octobre."
			},
			{
				name: "Akane",
				notes: "Précoce (août-septembre), assez résistante à la tavelure."
			},
			{
				name: "Belchard (Chantecler)",
				notes: "Productive, bonne conservation. Récolte fin septembre."
			},
			{
				name: "Transparente blanche",
				notes: "Très précoce (juillet-août), très rustique, ne se conserve pas."
			}
		],
		rules: [
			winterFormation(),
			{
				type: "pruning_fruiting",
				label: "Taille de fructification",
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 4,
				notes: "Éclaircir le centre, renouveler les rameaux fruitiers, supprimer le bois mort."
			},
			{
				type: "pruning_summer",
				label: "Taille en vert",
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 2,
				notes: "Pincer ou raccourcir les pousses vigoureuses de l’année, supprimer les gourmands."
			},
			{
				type: "treatment",
				label: "Prévention tavelure au débourrement",
				start: [3, 20],
				end: [4, 30],
				notes: "Cuivre ou soufre au débourrement, surtout par printemps humide."
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [9, 1],
				end: [10, 31],
				notes: "Selon la variété. Les fruits mûrs se détachent en les soulevant."
			}
		]
	},
	{
		key: "poirier",
		commonName: "Poirier",
		latinName: "Pyrus communis",
		category: "fruit_tree",
		defaultSpacingM: 5,
		needsPollinator: true,
		notes: "Presque toujours besoin d'un pollinisateur compatible. Floraison précoce : sensible aux gelées tardives, préférer un emplacement abrité, pas en fond de cuvette.",
		altitudeWarning: "Floraison précoce : risque de gel des fleurs. Préférer des variétés tardives et un emplacement abrité.",
		rootstocks: [
			"Cognassier BA29 (moyen)",
			"Cognassier A (moyen)",
			"Franc (haute tige, vigoureux)"
		],
		varieties: [
			{
				name: "Conférence",
				notes: "Partiellement autofertile, bon pollinisateur. Récolte septembre."
			},
			{
				name: "Williams",
				notes: "Récolte fin août-septembre. Bon pollinisateur."
			},
			{
				name: "Beurré Hardy",
				notes: "Rustique et vigoureux. A besoin d’un pollinisateur. Récolte septembre."
			},
			{
				name: "Louise-Bonne d’Avranches",
				notes: "Rustique, productive. Récolte septembre."
			},
			{
				name: "Doyenné du Comice",
				notes: "Très bonne qualité mais exigeante en chaleur. A besoin d’un pollinisateur."
			},
			{
				name: "Comtesse de Paris",
				notes: "Variété d’hiver, bonne conservation."
			}
		],
		rules: [
			winterFormation(4, "Hors gel, avant le débourrement. Port naturellement érigé : ouvrir le centre."),
			{
				type: "pruning_fruiting",
				label: "Taille de fructification",
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 4,
				notes: "Conserver les dards et lambourdes, supprimer les rameaux mal placés."
			},
			{
				type: "pruning_summer",
				label: "Taille en vert",
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 2
			},
			{
				type: "treatment",
				label: "Prévention tavelure au débourrement",
				start: [3, 15],
				end: [4, 30],
				notes: "Cuivre au débourrement."
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [8, 15],
				end: [10, 15],
				notes: "Cueillir un peu avant maturité complète et laisser mûrir au frais."
			}
		]
	},
	{
		key: "cognassier",
		commonName: "Cognassier",
		latinName: "Cydonia oblonga",
		category: "fruit_tree",
		defaultSpacingM: 4,
		needsPollinator: false,
		notes: "Autofertile, peu exigeant. Fleurit tard, ce qui limite les dégâts du gel.",
		varieties: [{
			name: "Champion",
			notes: "Productif, gros fruits."
		}, {
			name: "Vranja",
			notes: "Très gros fruits parfumés."
		}],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille légère",
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 2,
				notes: "Supprimer le bois mort et aérer le centre ; le cognassier se taille peu."
			},
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [10, 1],
				end: [10, 31],
				notes: "Quand le duvet part facilement et que la couleur jaunit, avant les fortes gelées."
			}
		]
	},
	{
		key: "cerisier",
		commonName: "Cerisier",
		latinName: "Prunus avium",
		category: "fruit_tree",
		defaultSpacingM: 7,
		needsPollinator: true,
		notes: "Beaucoup de variétés sont autostériles (pollinisateur nécessaire) ; certaines sont autofertiles (Stella, Sunburst…). Le cerisier craint les grosses coupes en hiver (gommose) : tailler de préférence en été.",
		rootstocks: [
			"Gisela 5 (nain, 3 à 4 m)",
			"Sainte-Lucie SL64 (moyen)",
			"Merisier (haute tige)"
		],
		varieties: [
			{
				name: "Burlat",
				notes: "Précoce, autostérile : a besoin d’un pollinisateur."
			},
			{
				name: "Bigarreau Napoléon",
				notes: "Fruits fermes, autostérile."
			},
			{
				name: "Stella",
				notes: "Autofertile et bon pollinisateur universel."
			},
			{
				name: "Sunburst",
				notes: "Autofertile, gros fruits."
			},
			{
				name: "Summit",
				notes: "Gros fruits, autostérile."
			},
			{
				name: "Reverchon",
				notes: "Tardive, fruits fermes, autostérile."
			}
		],
		rules: [
			{
				type: "pruning_formation",
				label: "Taille de formation",
				start: [3, 15],
				end: [4, 15],
				maxAgeYears: 4,
				notes: "Coupes légères, par temps sec, à la reprise de végétation."
			},
			{
				type: "pruning_summer",
				label: "Taille après récolte",
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 3,
				notes: "Juste après la récolte : aérer, supprimer le bois mort et les branches mal placées. Cicatrisation plus rapide qu’en hiver."
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 1],
				end: [8, 15],
				notes: "Plus tardive qu’en plaine à cette altitude. Protéger des oiseaux si besoin."
			}
		]
	},
	{
		key: "griottier",
		commonName: "Griottier",
		latinName: "Prunus cerasus",
		category: "fruit_tree",
		defaultSpacingM: 4,
		needsPollinator: false,
		notes: "Cerises acidulées (confitures, clafoutis). Généralement autofertile, rustique et plus petit que le cerisier.",
		varieties: [{
			name: "Montmorency",
			notes: "Autofertile, très productive."
		}, {
			name: "Griotte du Nord",
			notes: "Autofertile, tardive, très rustique."
		}],
		rules: [
			{
				type: "pruning_summer",
				label: "Taille après récolte",
				start: [7, 15],
				end: [8, 31],
				minAgeYears: 2,
				notes: "Fructifie sur le bois de l’année précédente : renouveler les rameaux."
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 15],
				end: [8, 15]
			}
		]
	},
	{
		key: "prunier",
		commonName: "Prunier",
		latinName: "Prunus domestica",
		category: "fruit_tree",
		defaultSpacingM: 5,
		needsPollinator: false,
		notes: "Beaucoup de variétés sont autofertiles (Reine-Claude, Mirabelle, Quetsche) ; la production est souvent meilleure avec un second prunier. Tailler peu, hors hiver.",
		rootstocks: ["Saint-Julien A (moyen)", "Myrobolan (vigoureux)"],
		varieties: [
			{
				name: "Reine-Claude dorée",
				notes: "Partiellement autofertile. Récolte août."
			},
			{
				name: "Mirabelle de Nancy",
				notes: "Autofertile. Récolte fin août."
			},
			{
				name: "Quetsche d’Alsace",
				notes: "Autofertile, rustique. Récolte septembre."
			},
			{
				name: "Reine-Claude d’Oullins",
				notes: "Autofertile, gros fruits. Récolte août."
			},
			{
				name: "Président",
				notes: "Tardive (septembre-octobre), a besoin d’un pollinisateur."
			}
		],
		rules: [
			{
				type: "pruning_formation",
				label: "Taille de formation",
				start: [3, 15],
				end: [4, 30],
				maxAgeYears: 4,
				notes: "À la reprise de végétation, par temps sec (éviter l’hiver : risque de maladies)."
			},
			{
				type: "pruning_summer",
				label: "Taille d’entretien",
				start: [8, 15],
				end: [9, 15],
				minAgeYears: 4,
				notes: "Après la récolte : supprimer le bois mort et les branches qui se croisent."
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [8, 1],
				end: [9, 30]
			}
		]
	},
	{
		key: "abricotier",
		commonName: "Abricotier",
		latinName: "Prunus armeniaca",
		category: "fruit_tree",
		defaultSpacingM: 5,
		needsPollinator: false,
		notes: "Généralement autofertile. Craint l’humidité au pied et les gelées sur fleurs.",
		altitudeWarning: "Floraison très précoce : à 850 m, la récolte est aléatoire. Seulement en espalier contre un mur exposé au sud, ou avec une variété tardive.",
		varieties: [{
			name: "Bergeron",
			notes: "Floraison tardive, la plus adaptée aux régions froides."
		}, {
			name: "Polonais (Orangé de Provence)",
			notes: "Rustique, autofertile."
		}],
		rules: [
			{
				type: "pruning_formation",
				label: "Taille de formation",
				start: [4, 1],
				end: [4, 30],
				maxAgeYears: 4,
				notes: "Après la floraison, coupes légères."
			},
			{
				type: "pruning_summer",
				label: "Taille après récolte",
				start: [8, 1],
				end: [8, 31],
				minAgeYears: 4
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 20],
				end: [8, 31]
			}
		]
	},
	{
		key: "pecher",
		commonName: "Pêcher",
		latinName: "Prunus persica",
		category: "fruit_tree",
		defaultSpacingM: 5,
		needsPollinator: false,
		notes: "Autofertile. Sensible à la cloque : traitement au cuivre au gonflement des bourgeons. Fructifie sur les rameaux de l’année précédente, à renouveler chaque année.",
		altitudeWarning: "Floraison précoce et cloque fréquente en climat humide : préférer un emplacement abrité, une variété de pêche de vigne ou résistante à la cloque.",
		varieties: [
			{
				name: "Pêche de vigne",
				notes: "Rustique, se ressème, assez tolérante."
			},
			{
				name: "Amsden",
				notes: "Précoce, rustique."
			},
			{
				name: "Redwing",
				notes: "Bonne résistance à la cloque."
			}
		],
		rules: [
			{
				type: "treatment",
				label: "Cuivre contre la cloque",
				start: [2, 15],
				end: [3, 31],
				notes: "Au gonflement des bourgeons, avant l’ouverture, par temps sec."
			},
			{
				type: "pruning_fruiting",
				label: "Taille de fructification",
				start: [4, 1],
				end: [4, 30],
				minAgeYears: 2,
				notes: "En fin de floraison : raccourcir les rameaux qui ont porté, garder les jeunes."
			},
			copperAtLeafFall,
			youngWatering(),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [8, 15],
				end: [9, 30]
			}
		]
	},
	{
		key: "figuier",
		commonName: "Figuier",
		latinName: "Ficus carica",
		category: "fruit_tree",
		defaultSpacingM: 4,
		needsPollinator: false,
		notes: "Variétés « bifères » ou « unifères » ; à cette altitude, seules les figues d’automne mûrissent en général.",
		altitudeWarning: "Gèle vers −12 °C : contre un mur sud, avec protection du pied en hiver. Variétés rustiques uniquement.",
		varieties: [
			{
				name: "Brown Turkey",
				notes: "Une des plus rustiques, autofertile."
			},
			{
				name: "Dalmatie",
				notes: "Rustique, gros fruits."
			},
			{
				name: "Ronde de Bordeaux",
				notes: "Précoce, adaptée aux étés courts."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille de nettoyage",
				start: [4, 15],
				end: [5, 15],
				notes: "Après les gelées : supprimer le bois gelé et les rameaux mal placés."
			},
			{
				type: "other",
				label: "Protection hivernale du pied",
				start: [11, 1],
				end: [11, 30],
				notes: "Paillage épais (feuilles, paille) au pied, voile d’hivernage les premières années."
			},
			youngWatering(10, 2),
			{
				type: "harvest",
				label: "Récolte",
				start: [8, 20],
				end: [10, 15]
			}
		]
	},
	{
		key: "noisetier",
		commonName: "Noisetier",
		latinName: "Corylus avellana",
		category: "nut_tree",
		defaultSpacingM: 4,
		needsPollinator: true,
		notes: "Pollinisation par le vent, meilleure avec deux variétés ou un noisetier sauvage à proximité. Très rustique.",
		varieties: [
			{
				name: "Fertile de Coutard",
				notes: "Productive, bon pollinisateur."
			},
			{
				name: "Merveille de Bollwiller",
				notes: "Gros fruits, a besoin d’un pollinisateur."
			},
			{
				name: "Longue d’Espagne",
				notes: "Bon pollinisateur."
			},
			{
				name: "Cosford",
				notes: "Bon pollinisateur, fruits allongés."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Éclaircie et recépage",
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 3,
				notes: "Après la floraison (chatons) : supprimer les plus vieilles tiges et les rejets en excès, garder 5 à 8 tiges."
			},
			youngWatering(14, 2),
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [9, 1],
				end: [10, 15],
				notes: "Ramasser au sol quand les noisettes tombent seules."
			}
		]
	},
	{
		key: "noyer",
		commonName: "Noyer",
		latinName: "Juglans regia",
		category: "nut_tree",
		defaultSpacingM: 10,
		needsPollinator: false,
		notes: "Grand arbre (15 à 20 m) : prévoir l’espace. Partiellement autofertile, meilleure production avec un second noyer. Ne pas tailler en hiver ni au printemps (écoulements de sève).",
		altitudeWarning: "Jeunes pousses sensibles aux gelées tardives : choisir une variété à débourrement tardif (Franquette).",
		varieties: [
			{
				name: "Franquette",
				notes: "Débourrement tardif, la plus adaptée aux gelées de printemps."
			},
			{
				name: "Lara",
				notes: "Productive, débourrement moyen."
			},
			{
				name: "Fernor",
				notes: "Débourrement tardif, productive."
			}
		],
		rules: [
			{
				type: "pruning_summer",
				label: "Taille (fin d’été)",
				start: [8, 15],
				end: [9, 30],
				notes: "Uniquement si nécessaire : bois mort, branches basses. Jamais en hiver."
			},
			youngWatering(14, 3),
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [9, 20],
				end: [10, 31],
				notes: "Ramasser régulièrement les noix tombées, les sécher rapidement."
			}
		]
	},
	{
		key: "chataignier",
		commonName: "Châtaignier",
		latinName: "Castanea sativa",
		category: "nut_tree",
		defaultSpacingM: 10,
		needsPollinator: true,
		notes: "Sol acide obligatoire (pas de calcaire). Grand arbre. A besoin d’un pollinisateur (deux variétés ou châtaigniers proches).",
		varieties: [
			{
				name: "Bouche de Bétizac",
				notes: "Gros fruits, résistante au cynips. Mauvais pollinisateur."
			},
			{
				name: "Marigoule",
				notes: "Bon pollinisateur."
			},
			{
				name: "Marron de Lyon",
				notes: "Fruits de qualité, a besoin d’un pollinisateur."
			}
		],
		rules: [
			winterFormation(5, "Hors gel : former un tronc dégagé et une charpente équilibrée."),
			youngWatering(10, 3),
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [10, 1],
				end: [10, 31]
			}
		]
	},
	{
		key: "vigne",
		commonName: "Vigne",
		latinName: "Vitis vinifera",
		category: "fruit_tree",
		defaultSpacingM: 1.5,
		needsPollinator: false,
		notes: "Autofertile. Contre un mur ou une treille bien exposés. Fructifie sur les pousses de l’année.",
		altitudeWarning: "Préférer des variétés de table précoces ou des hybrides résistants aux maladies, au soleil et à l’abri.",
		varieties: [
			{
				name: "Muscat bleu",
				notes: "Hybride résistant au mildiou et à l’oïdium, raisin de table."
			},
			{
				name: "Chasselas doré",
				notes: "Précoce, à placer contre un mur chaud."
			},
			{
				name: "Vanessa",
				notes: "Raisin rose sans pépins, assez rustique."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille d’hiver",
				start: [2, 15],
				end: [3, 31],
				notes: "Après les fortes gelées, avant les pleurs : tailler à 2 yeux sur les sarments de l’an passé."
			},
			{
				type: "pruning_summer",
				label: "Ébourgeonnage et taille en vert",
				start: [6, 1],
				end: [7, 15],
				minAgeYears: 1,
				notes: "Supprimer les pousses sans grappes en excès, pincer au-dessus des grappes."
			},
			{
				type: "treatment",
				label: "Prévention du mildiou",
				start: [5, 20],
				end: [7, 31],
				intervalDays: 14,
				notes: "Bouillie bordelaise par temps humide, après une forte pluie. Inutile sur variété résistante."
			},
			youngShrubWatering(7, 2),
			{
				type: "harvest",
				label: "Vendange",
				start: [9, 15],
				end: [10, 15]
			}
		]
	},
	{
		key: "kiwai",
		commonName: "Kiwaï",
		latinName: "Actinidia arguta",
		category: "small_fruit",
		defaultSpacingM: 3,
		needsPollinator: true,
		notes: "Mini-kiwi à peau lisse, très rustique (jusqu’à −25 °C). Plantes mâles et femelles séparées (1 mâle pour 6 femelles), sauf variété autofertile (Issai). Liane vigoureuse : prévoir un support solide.",
		varieties: [
			{
				name: "Issai",
				notes: "Autofertile, compacte."
			},
			{
				name: "Weiki",
				notes: "Femelle, a besoin d’un mâle."
			},
			{
				name: "Mâle",
				notes: "Pollinisateur des pieds femelles."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille d’hiver",
				start: [1, 15],
				end: [2, 28],
				minAgeYears: 2,
				notes: "Avant la montée de sève : raccourcir les rameaux ayant fructifié."
			},
			{
				type: "pruning_summer",
				label: "Taille en vert",
				start: [6, 15],
				end: [7, 31],
				minAgeYears: 1,
				notes: "Pincer les pousses trop longues au-delà des fruits."
			},
			youngShrubWatering(7, 2),
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [9, 1],
				end: [10, 15]
			}
		]
	},
	{
		key: "framboisier",
		commonName: "Framboisier",
		latinName: "Rubus idaeus",
		category: "small_fruit",
		defaultSpacingM: .5,
		needsPollinator: false,
		notes: "Non remontant : fructifie une fois sur les cannes de l’an passé. Remontant : fructifie en fin d’été sur les cannes de l’année (et un peu au printemps suivant). Drageonne : contenir le rang.",
		varieties: [
			{
				name: "Malling Promise",
				notes: "Non remontant, précoce, rustique."
			},
			{
				name: "Heritage",
				notes: "Remontant, très productif."
			},
			{
				name: "Zeva",
				notes: "Remontant, gros fruits."
			},
			{
				name: "Fallgold",
				notes: "Remontant, framboises jaunes."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille des cannes",
				start: [2, 1],
				end: [3, 15],
				notes: "Remontant : couper toutes les cannes au ras du sol. Non remontant : supprimer les cannes sèches, garder 6 à 8 cannes par mètre."
			},
			{
				type: "pruning_summer",
				label: "Suppression des cannes ayant fructifié",
				start: [8, 1],
				end: [8, 31],
				notes: "Variétés non remontantes : couper au sol les cannes qui ont porté des fruits."
			},
			youngShrubWatering(7, 1),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 1],
				end: [9, 30]
			}
		]
	},
	{
		key: "groseillier",
		commonName: "Groseillier à grappes",
		latinName: "Ribes rubrum",
		category: "small_fruit",
		defaultSpacingM: 1.5,
		needsPollinator: false,
		notes: "Autofertile, très rustique, supporte la mi-ombre. Fructifie sur le bois de 2 à 3 ans.",
		varieties: [
			{
				name: "Jonkheer van Tets",
				notes: "Rouge, précoce, productive."
			},
			{
				name: "Versaillaise blanche",
				notes: "Groseilles blanches, douces."
			},
			{
				name: "Rovada",
				notes: "Rouge, tardive, longues grappes."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille d’hiver",
				start: [2, 1],
				end: [3, 15],
				minAgeYears: 2,
				notes: "Supprimer les branches de plus de 3 ans au ras du sol et aérer le centre."
			},
			youngShrubWatering(7, 2),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 1],
				end: [7, 31]
			}
		]
	},
	{
		key: "cassissier",
		commonName: "Cassissier",
		latinName: "Ribes nigrum",
		category: "small_fruit",
		defaultSpacingM: 1.5,
		needsPollinator: false,
		notes: "Très rustique. Fructifie surtout sur le bois de l’année précédente : renouveler chaque année un tiers des branches.",
		varieties: [
			{
				name: "Noir de Bourgogne",
				notes: "Variété de référence, très parfumée."
			},
			{
				name: "Andega",
				notes: "Productive, gros fruits."
			},
			{
				name: "Ben Sarek",
				notes: "Compacte, résistante à l’oïdium."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille d’hiver",
				start: [2, 1],
				end: [3, 15],
				minAgeYears: 2,
				notes: "Couper au ras du sol les plus vieilles branches (un tiers environ)."
			},
			youngShrubWatering(7, 2),
			compost,
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 1],
				end: [7, 31]
			}
		]
	},
	{
		key: "myrtillier",
		commonName: "Myrtillier",
		latinName: "Vaccinium corymbosum",
		category: "small_fruit",
		defaultSpacingM: 1.5,
		needsPollinator: true,
		notes: "Sol acide obligatoire (terre de bruyère). Meilleure production avec deux variétés. Arroser à l’eau de pluie.",
		varieties: [
			{
				name: "Bluecrop",
				notes: "Productive, mi-saison."
			},
			{
				name: "Duke",
				notes: "Précoce, floraison tardive (évite le gel)."
			},
			{
				name: "Patriot",
				notes: "Très rustique."
			}
		],
		rules: [
			{
				type: "pruning_winter",
				label: "Taille d’entretien",
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 3,
				notes: "Supprimer le bois mort et les plus vieilles branches peu productives."
			},
			{
				type: "mulching",
				label: "Paillage acide",
				start: [5, 1],
				end: [5, 31],
				notes: "Écorce de pin ou aiguilles de résineux pour garder le sol acide et frais."
			},
			youngShrubWatering(5, 3),
			{
				type: "harvest",
				label: "Récolte",
				start: [7, 15],
				end: [8, 31],
				notes: "Plusieurs passages, quand les baies sont bien bleues."
			}
		]
	},
	{
		key: "murier",
		commonName: "Mûrier sans épines",
		latinName: "Rubus fruticosus",
		category: "small_fruit",
		defaultSpacingM: 2,
		needsPollinator: false,
		notes: "Ronce cultivée, à palisser. Fructifie sur les cannes de l’année précédente.",
		varieties: [{
			name: "Thornfree",
			notes: "Sans épines, tardive."
		}, {
			name: "Loch Ness",
			notes: "Sans épines, port dressé, productive."
		}],
		rules: [
			{
				type: "pruning_summer",
				label: "Suppression des cannes ayant fructifié",
				start: [9, 15],
				end: [10, 31],
				notes: "Couper au sol les cannes qui ont porté, palisser les nouvelles."
			},
			youngShrubWatering(7, 1),
			mulching,
			{
				type: "harvest",
				label: "Récolte",
				start: [8, 1],
				end: [9, 30]
			}
		]
	},
	{
		key: "sureau",
		commonName: "Sureau noir",
		latinName: "Sambucus nigra",
		category: "shrub",
		defaultSpacingM: 3,
		needsPollinator: false,
		notes: "Très rustique et facile. Fleurs (sirop, beignets) et baies cuites (confitures).",
		rules: [
			{
				type: "pruning_winter",
				label: "Taille d’éclaircie",
				start: [2, 1],
				end: [3, 15],
				minAgeYears: 2,
				notes: "Supprimer les vieilles branches et le bois mort."
			},
			{
				type: "harvest",
				label: "Récolte des fleurs",
				start: [6, 1],
				end: [6, 30]
			},
			{
				type: "harvest",
				label: "Récolte des baies",
				start: [8, 15],
				end: [9, 30],
				notes: "Baies à consommer cuites uniquement."
			}
		]
	},
	{
		key: "amelanchier",
		commonName: "Amélanchier",
		latinName: "Amelanchier lamarckii",
		category: "shrub",
		defaultSpacingM: 3,
		needsPollinator: false,
		notes: "Arbuste très rustique, floraison blanche au printemps, petites baies comestibles en juin-juillet, beau feuillage d’automne.",
		rules: [
			{
				type: "pruning_winter",
				label: "Taille légère",
				start: [2, 15],
				end: [3, 31],
				minAgeYears: 3,
				notes: "Uniquement le bois mort et les branches mal placées."
			},
			youngShrubWatering(10, 2),
			{
				type: "harvest",
				label: "Récolte des baies",
				start: [6, 15],
				end: [7, 31]
			}
		]
	},
	{
		key: "sumac",
		commonName: "Sumac de Virginie",
		latinName: "Rhus typhina",
		category: "ornamental",
		defaultSpacingM: 4,
		needsPollinator: false,
		notes: "Très rustique et peu exigeant. Drageonne fortement : prévoir de supprimer les rejets, ou poser une barrière anti-rhizomes. Sève irritante : porter des gants.",
		rules: [
			{
				type: "pruning_winter",
				label: "Taille légère",
				start: [2, 15],
				end: [3, 31],
				notes: "Facultative : supprimer le bois mort et équilibrer la silhouette."
			},
			{
				type: "other",
				label: "Suppression des drageons",
				start: [6, 1],
				end: [9, 30],
				intervalDays: 45,
				minAgeYears: 1,
				notes: "Arracher les rejets au plus près de la racine plutôt que de les couper."
			},
			{
				type: "watering",
				label: "Arrosage de la première année",
				start: [6, 1],
				end: [8, 31],
				intervalDays: 14,
				maxAgeYears: 1,
				notes: "Résiste bien à la sécheresse une fois installé."
			}
		]
	},
	{
		key: "lilas",
		commonName: "Lilas",
		latinName: "Syringa vulgaris",
		category: "ornamental",
		defaultSpacingM: 2.5,
		needsPollinator: false,
		notes: "Très rustique. Fleurit sur le bois de l’année précédente : tailler juste après la floraison. Drageonne.",
		rules: [{
			type: "pruning_summer",
			label: "Taille après floraison",
			start: [6, 1],
			end: [6, 30],
			minAgeYears: 2,
			notes: "Couper les fleurs fanées, supprimer quelques vieilles branches et les drageons."
		}, youngShrubWatering(10, 2)]
	},
	{
		key: "rosier",
		commonName: "Rosier",
		latinName: "Rosa",
		category: "shrub",
		defaultSpacingM: 1,
		needsPollinator: false,
		notes: "Préférer des variétés rustiques et résistantes aux maladies. Butter le pied en hiver les premières années.",
		rules: [
			{
				type: "pruning_winter",
				label: "Taille de printemps",
				start: [3, 25],
				end: [4, 25],
				notes: "Quand les grosses gelées sont passées (floraison du forsythia). Couper au-dessus d’un œil extérieur."
			},
			{
				type: "pruning_summer",
				label: "Suppression des fleurs fanées",
				start: [6, 15],
				end: [9, 15],
				intervalDays: 21,
				notes: "Favorise la remontée des fleurs sur les variétés remontantes."
			},
			compost,
			mulching,
			youngShrubWatering(7, 1)
		]
	},
	{
		key: "bouleau",
		commonName: "Bouleau verruqueux",
		latinName: "Betula pendula",
		category: "ornamental",
		defaultSpacingM: 6,
		needsPollinator: false,
		notes: "Très rustique, croissance rapide, écorce blanche. Ne pas tailler au printemps (pleurs de sève).",
		rules: [{
			type: "pruning_summer",
			label: "Taille (bois mort)",
			start: [8, 1],
			end: [9, 30],
			notes: "Uniquement si nécessaire."
		}, youngWatering(10, 2)]
	},
	{
		key: "cornouiller",
		commonName: "Cornouiller à bois coloré",
		latinName: "Cornus alba",
		category: "ornamental",
		defaultSpacingM: 1.5,
		needsPollinator: false,
		notes: "Rameaux rouges ou jaunes en hiver, plus colorés sur le bois jeune : recéper régulièrement.",
		rules: [{
			type: "pruning_winter",
			label: "Recépage",
			start: [3, 1],
			end: [3, 31],
			minAgeYears: 2,
			notes: "Couper un tiers des tiges (ou toutes, tous les 2 ans) à 10 cm du sol."
		}, youngShrubWatering(10, 1)]
	},
	{
		key: "viorne",
		commonName: "Viorne obier",
		latinName: "Viburnum opulus",
		category: "shrub",
		defaultSpacingM: 2,
		needsPollinator: false,
		notes: "Indigène, très rustique, fleurs blanches et baies rouges appréciées des oiseaux. Haie libre.",
		rules: [{
			type: "pruning_summer",
			label: "Taille après floraison",
			start: [6, 15],
			end: [7, 15],
			minAgeYears: 2,
			notes: "Légère : équilibrer et supprimer le bois mort."
		}, youngShrubWatering(10, 1)]
	},
	{
		key: "charme",
		commonName: "Charme (haie)",
		latinName: "Carpinus betulus",
		category: "hedge",
		defaultSpacingM: .6,
		needsPollinator: false,
		notes: "Haie champêtre très rustique, garde ses feuilles sèches l’hiver (charmille). Planter 2 à 3 plants par mètre.",
		rules: [
			hedgeTrim,
			youngShrubWatering(10, 2),
			mulching
		]
	},
	{
		key: "hetre",
		commonName: "Hêtre (haie)",
		latinName: "Fagus sylvatica",
		category: "hedge",
		defaultSpacingM: .6,
		needsPollinator: false,
		notes: "Haie dense qui garde ses feuilles sèches en hiver. Supporte bien l’altitude.",
		rules: [
			hedgeTrim,
			youngShrubWatering(10, 2),
			mulching
		]
	},
	{
		key: "erable-champetre",
		commonName: "Érable champêtre",
		latinName: "Acer campestre",
		category: "hedge",
		defaultSpacingM: 1,
		needsPollinator: false,
		notes: "En haie ou en petit arbre. Très rustique, beau feuillage jaune à l’automne.",
		rules: [hedgeTrim, youngShrubWatering(10, 2)]
	}
];
function catalogEntry(key) {
	return key ? CATALOG.find((e) => e.key === key) : void 0;
}
// src/lib/server/catalog-templates.ts
/**
* Id of the species template for a catalogue entry, creating it (with its
* care rules, all « à vérifier ») on first use. A template that already has
* the same common name is linked to the entry instead of being duplicated.
*/
function ensureTemplateFromCatalog(db, key) {
	const entry = catalogEntry(key);
	if (!entry) throw new Error(`Unknown catalogue entry: ${key}`);
	const linked = db.select({ id: speciesTemplate.id }).from(speciesTemplate).where(eq(speciesTemplate.catalogKey, key)).get();
	if (linked) return linked.id;
	const sameName = db.select({ id: speciesTemplate.id }).from(speciesTemplate).where(eq(speciesTemplate.commonName, entry.commonName)).get();
	if (sameName) {
		db.update(speciesTemplate).set({ catalogKey: key }).where(eq(speciesTemplate.id, sameName.id)).run();
		return sameName.id;
	}
	return db.transaction((tx) => {
		const id = tx.insert(speciesTemplate).values({
			catalogKey: entry.key,
			commonName: entry.commonName,
			latinName: entry.latinName,
			category: entry.category,
			defaultSpacingM: entry.defaultSpacingM,
			needsPollinator: entry.needsPollinator,
			notes: templateNotes(entry)
		}).returning({ id: speciesTemplate.id }).get().id;
		for (const r of entry.rules) tx.insert(careRule).values({
			speciesTemplateId: id,
			type: r.type,
			label: r.label,
			startMonth: r.start[0],
			startDay: r.start[1],
			endMonth: r.end[0],
			endDay: r.end[1],
			intervalDays: r.intervalDays ?? null,
			minAgeYears: r.minAgeYears ?? null,
			maxAgeYears: r.maxAgeYears ?? null,
			verified: false,
			notes: r.notes ?? null
		}).run();
		return id;
	});
}
function templateNotes(entry) {
	return entry.altitudeWarning ? `⚠️ ${entry.altitudeWarning}\n\n${entry.notes}` : entry.notes;
}
/** Catalogue keys already linked to a template. */
function importedCatalogKeys(db) {
	return new Set(db.select({ key: speciesTemplate.catalogKey }).from(speciesTemplate).all().map((r) => r.key).filter((k) => k != null));
}
export { catalogEntry as i, importedCatalogKeys as n, CATALOG as r, ensureTemplateFromCatalog as t };

//# sourceMappingURL=catalog-templates.js.map