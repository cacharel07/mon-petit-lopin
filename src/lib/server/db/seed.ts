import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.ts';
import { SPECIES_TEMPLATES, ZONES } from './seed-data.ts';

type Db = BetterSQLite3Database<typeof schema>;

const APPROX = 'Date approximative, à corriger.';

/**
 * Insert the initial data (real trees and projects of the garden).
 * Refuses to run on a database that already contains data.
 */
/** True when there is nothing the seed could conflict with (or overwrite). */
export function isDatabaseEmpty(db: Db): boolean {
	return [schema.zone, schema.tree, schema.speciesTemplate, schema.project].every(
		(table) => db.select({ id: table.id }).from(table).limit(1).all().length === 0
	);
}

export function seed(db: Db) {
	if (!isDatabaseEmpty(db)) {
		throw new Error('La base contient déjà des données : seed annulé.');
	}

	db.transaction((tx) => {
		// Zones
		const zoneIds = new Map<string, number>();
		ZONES.forEach((name, i) => {
			const row = tx
				.insert(schema.zone)
				.values({ name, sortOrder: i })
				.returning({ id: schema.zone.id })
				.get();
			zoneIds.set(name, row.id);
		});

		// Species templates and their care rules
		const templateIds = new Map<string, number>();
		for (const t of SPECIES_TEMPLATES) {
			const row = tx
				.insert(schema.speciesTemplate)
				.values({
					commonName: t.commonName,
					latinName: t.latinName,
					category: t.category,
					defaultSpacingM: t.defaultSpacingM,
					needsPollinator: t.needsPollinator,
					notes: t.notes
				})
				.returning({ id: schema.speciesTemplate.id })
				.get();
			templateIds.set(t.commonName, row.id);
			for (const r of t.rules) {
				tx.insert(schema.careRule)
					.values({
						speciesTemplateId: row.id,
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
					})
					.run();
			}
		}

		const template = (name: string) => {
			const t = SPECIES_TEMPLATES.find((s) => s.commonName === name)!;
			return {
				speciesTemplateId: templateIds.get(name)!,
				commonName: name,
				species: t.latinName,
				pollinatorRequired: t.needsPollinator
			};
		};
		const addTree = (
			values: Omit<typeof schema.tree.$inferInsert, 'commonName'> & { commonName: string }
		) => tx.insert(schema.tree).values(values).returning({ id: schema.tree.id }).get().id;

		// Trees planted in 2023
		const oldApple = addTree({
			...template('Pommier'),
			nickname: 'Le premier pommier',
			status: 'planted',
			plantingDate: '2023-03-15',
			notes: `Planté en 2023. ${APPROX}`
		});
		addTree({
			...template('Cerisier'),
			status: 'planted',
			plantingDate: '2023-03-15',
			notes: `Planté en 2023. ${APPROX}`
		});

		// Bought in November 2026, to be planted
		const bought = { status: 'purchased' as const, purchaseDate: '2026-11-01' };
		const boughtNote = `Acheté en novembre 2026. ${APPROX}`;
		const pear1 = addTree({
			...template('Poirier'),
			...bought,
			nickname: 'Poirier n°1',
			recommendedSpacingM: 4.5,
			nurseryAdvice: 'Planter les deux poiriers à 3 à 6 m l’un de l’autre.',
			notes: boughtNote
		});
		const pear2 = addTree({
			...template('Poirier'),
			...bought,
			nickname: 'Poirier n°2',
			recommendedSpacingM: 4.5,
			nurseryAdvice: 'Planter les deux poiriers à 3 à 6 m l’un de l’autre.',
			notes: boughtNote
		});
		const newApple = addTree({
			...template('Pommier'),
			...bought,
			nickname: 'Le deuxième pommier',
			recommendedSpacingM: 6,
			nurseryAdvice: 'Planter à environ 6 m du premier pommier.',
			notes: boughtNote
		});
		const newCherry = addTree({ ...template('Cerisier'), ...bought, notes: boughtNote });
		const hazel = addTree({ ...template('Noisetier'), ...bought, notes: boughtNote });
		const sumac1 = addTree({
			...template('Sumac de Virginie'),
			...bought,
			nickname: 'Sumac n°1',
			notes: boughtNote
		});
		const sumac2 = addTree({
			...template('Sumac de Virginie'),
			...bought,
			nickname: 'Sumac n°2',
			notes: boughtNote
		});

		// Pollination links (both ways)
		for (const [a, b] of [
			[pear1, pear2],
			[oldApple, newApple]
		]) {
			tx.insert(schema.treePollinator).values({ treeId: a, pollinatorTreeId: b }).run();
			tx.insert(schema.treePollinator).values({ treeId: b, pollinatorTreeId: a }).run();
		}

		// Projects
		tx.insert(schema.project)
			.values({
				title: 'Terrain de pétanque',
				zoneId: zoneIds.get('Terrain de pétanque'),
				status: 'done',
				priority: 'medium',
				actualEnd: '2025-09-30',
				notes: `Terminé en 2025. ${APPROX}`
			})
			.run();

		tx.insert(schema.project)
			.values({
				title: 'Abri de jardin',
				zoneId: zoneIds.get('Fond près de l’abri'),
				status: 'in_progress',
				priority: 'high'
			})
			.run();

		const plantingProject = tx
			.insert(schema.project)
			.values({
				title: 'Plantation des arbres achetés en novembre 2026',
				status: 'planned',
				priority: 'high',
				plannedStart: '2026-11-15',
				plannedEnd: '2026-12-15',
				description:
					'Planter hors période de gel, sol ressuyé. Si le sol gèle avant, mettre les arbres en jauge et planter en mars.'
			})
			.returning({ id: schema.project.id })
			.get().id;

		const toPlant: [number, string][] = [
			[pear1, 'Planter le poirier n°1'],
			[pear2, 'Planter le poirier n°2 (3 à 6 m du n°1)'],
			[newApple, 'Planter le deuxième pommier (~6 m du premier)'],
			[newCherry, 'Planter le cerisier'],
			[hazel, 'Planter le noisetier'],
			[sumac1, 'Planter le sumac n°1'],
			[sumac2, 'Planter le sumac n°2']
		];
		tx.insert(schema.projectTask)
			.values({ projectId: plantingProject, label: 'Choisir les emplacements', sortOrder: 0 })
			.run();
		toPlant.forEach(([treeId, label], i) => {
			tx.insert(schema.projectTask)
				.values({ projectId: plantingProject, label, sortOrder: i + 1 })
				.run();
			tx.insert(schema.projectTree).values({ projectId: plantingProject, treeId }).run();
		});
	});
}
