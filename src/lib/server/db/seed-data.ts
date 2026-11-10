/*
 * Initial data of the garden. Species sheets come from the built-in
 * catalogue (src/lib/server/catalog.ts).
 */

/** Catalogue entries imported by the seed (the species of the garden). */
export const SEED_SPECIES = ['pommier', 'cerisier', 'poirier', 'noisetier', 'sumac'] as const;

export const ZONES = [
	'Devant la maison',
	'Terrasse',
	'Verger',
	'Terrain de pétanque',
	'Fond près de l’abri'
];
