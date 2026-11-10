import { i as redirect } from "../../../chunks/exports.js";
import { c as projectTree, d as tree, f as treePollinator, n as db, o as project, p as zone, s as projectTask, u as speciesTemplate } from "../../../chunks/db.js";
import { i as catalogEntry, t as ensureTemplateFromCatalog } from "../../../chunks/catalog-templates.js";
// src/lib/server/db/seed-data.ts
/** Catalogue entries imported by the seed (the species of the garden). */
var SEED_SPECIES = [
	"pommier",
	"cerisier",
	"poirier",
	"noisetier",
	"sumac"
];
var ZONES = [
	"Devant la maison",
	"Terrasse",
	"Verger",
	"Terrain de pétanque",
	"Fond près de l’abri"
];
// src/lib/server/db/seed.ts
var APPROX = "Date approximative, à corriger.";
/**
* Insert the initial data (real trees and projects of the garden).
* Refuses to run on a database that already contains data.
*/
/** True when there is nothing the seed could conflict with (or overwrite). */
function isDatabaseEmpty(db) {
	return [
		zone,
		tree,
		speciesTemplate,
		project
	].every((table) => db.select({ id: table.id }).from(table).limit(1).all().length === 0);
}
function seed(db) {
	if (!isDatabaseEmpty(db)) throw new Error("La base contient déjà des données : seed annulé.");
	db.transaction((tx) => {
		const zoneIds = /* @__PURE__ */ new Map();
		ZONES.forEach((name, i) => {
			const row = tx.insert(zone).values({
				name,
				sortOrder: i
			}).returning({ id: zone.id }).get();
			zoneIds.set(name, row.id);
		});
		const templateIds = /* @__PURE__ */ new Map();
		for (const key of SEED_SPECIES) templateIds.set(catalogEntry(key).commonName, ensureTemplateFromCatalog(tx, key));
		const template = (name) => {
			const t = SEED_SPECIES.map((k) => catalogEntry(k)).find((e) => e.commonName === name);
			return {
				speciesTemplateId: templateIds.get(name),
				commonName: name,
				species: t.latinName,
				pollinatorRequired: t.needsPollinator
			};
		};
		const addTree = (values) => tx.insert(tree).values(values).returning({ id: tree.id }).get().id;
		const oldApple = addTree({
			...template("Pommier"),
			nickname: "Le premier pommier",
			status: "planted",
			plantingDate: "2023-03-15",
			notes: `Planté en 2023. ${APPROX}`
		});
		addTree({
			...template("Cerisier"),
			status: "planted",
			plantingDate: "2023-03-15",
			notes: `Planté en 2023. ${APPROX}`
		});
		const bought = {
			status: "purchased",
			purchaseDate: "2026-11-01"
		};
		const boughtNote = `Acheté en novembre 2026. ${APPROX}`;
		const pear1 = addTree({
			...template("Poirier"),
			...bought,
			nickname: "Poirier n°1",
			recommendedSpacingM: 4.5,
			nurseryAdvice: "Planter les deux poiriers à 3 à 6 m l’un de l’autre.",
			notes: boughtNote
		});
		const pear2 = addTree({
			...template("Poirier"),
			...bought,
			nickname: "Poirier n°2",
			recommendedSpacingM: 4.5,
			nurseryAdvice: "Planter les deux poiriers à 3 à 6 m l’un de l’autre.",
			notes: boughtNote
		});
		const newApple = addTree({
			...template("Pommier"),
			...bought,
			nickname: "Le deuxième pommier",
			recommendedSpacingM: 6,
			nurseryAdvice: "Planter à environ 6 m du premier pommier.",
			notes: boughtNote
		});
		const newCherry = addTree({
			...template("Cerisier"),
			...bought,
			notes: boughtNote
		});
		const hazel = addTree({
			...template("Noisetier"),
			...bought,
			notes: boughtNote
		});
		const sumac1 = addTree({
			...template("Sumac de Virginie"),
			...bought,
			nickname: "Sumac n°1",
			notes: boughtNote
		});
		const sumac2 = addTree({
			...template("Sumac de Virginie"),
			...bought,
			nickname: "Sumac n°2",
			notes: boughtNote
		});
		for (const [a, b] of [[pear1, pear2], [oldApple, newApple]]) {
			tx.insert(treePollinator).values({
				treeId: a,
				pollinatorTreeId: b
			}).run();
			tx.insert(treePollinator).values({
				treeId: b,
				pollinatorTreeId: a
			}).run();
		}
		tx.insert(project).values({
			title: "Terrain de pétanque",
			zoneId: zoneIds.get("Terrain de pétanque"),
			status: "done",
			priority: "medium",
			actualEnd: "2025-09-30",
			notes: `Terminé en 2025. ${APPROX}`
		}).run();
		tx.insert(project).values({
			title: "Abri de jardin",
			zoneId: zoneIds.get("Fond près de l’abri"),
			status: "in_progress",
			priority: "high"
		}).run();
		const plantingProject = tx.insert(project).values({
			title: "Plantation des arbres achetés en novembre 2026",
			status: "planned",
			priority: "high",
			plannedStart: "2026-11-15",
			plannedEnd: "2026-12-15",
			description: "Planter hors période de gel, sol ressuyé. Si le sol gèle avant, mettre les arbres en jauge et planter en mars."
		}).returning({ id: project.id }).get().id;
		const toPlant = [
			[pear1, "Planter le poirier n°1"],
			[pear2, "Planter le poirier n°2 (3 à 6 m du n°1)"],
			[newApple, "Planter le deuxième pommier (~6 m du premier)"],
			[newCherry, "Planter le cerisier"],
			[hazel, "Planter le noisetier"],
			[sumac1, "Planter le sumac n°1"],
			[sumac2, "Planter le sumac n°2"]
		];
		tx.insert(projectTask).values({
			projectId: plantingProject,
			label: "Choisir les emplacements",
			sortOrder: 0
		}).run();
		toPlant.forEach(([treeId, label], i) => {
			tx.insert(projectTask).values({
				projectId: plantingProject,
				label,
				sortOrder: i + 1
			}).run();
			tx.insert(projectTree).values({
				projectId: plantingProject,
				treeId
			}).run();
		});
	});
}
// src/routes/plus/+page.server.ts
var load = () => ({ canSeed: isDatabaseEmpty(db) });
var actions = { 
/**
* Insert the initial garden data from the app itself: the host's SSH session
* does not have enough memory to run `npm run db:seed`.
*/
seed: () => {
	if (isDatabaseEmpty(db)) seed(db);
	redirect(303, "/");
} };
export { actions, load };

//# sourceMappingURL=_page.server.ts.js.map