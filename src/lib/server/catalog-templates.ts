import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { catalogEntry, type CatalogEntry } from './catalog.ts';
import * as schema from './db/schema.ts';

type Db = BetterSQLite3Database<typeof schema>;

/**
 * Id of the species template for a catalogue entry, creating it (with its
 * care rules, all « à vérifier ») on first use. A template that already has
 * the same common name is linked to the entry instead of being duplicated.
 */
export function ensureTemplateFromCatalog(db: Db, key: string): number {
	const entry = catalogEntry(key);
	if (!entry) throw new Error(`Unknown catalogue entry: ${key}`);

	const linked = db
		.select({ id: schema.speciesTemplate.id })
		.from(schema.speciesTemplate)
		.where(eq(schema.speciesTemplate.catalogKey, key))
		.get();
	if (linked) return linked.id;

	const sameName = db
		.select({ id: schema.speciesTemplate.id })
		.from(schema.speciesTemplate)
		.where(eq(schema.speciesTemplate.commonName, entry.commonName))
		.get();
	if (sameName) {
		db.update(schema.speciesTemplate)
			.set({ catalogKey: key })
			.where(eq(schema.speciesTemplate.id, sameName.id))
			.run();
		return sameName.id;
	}

	return db.transaction((tx) => {
		const id = tx
			.insert(schema.speciesTemplate)
			.values({
				catalogKey: entry.key,
				commonName: entry.commonName,
				latinName: entry.latinName,
				category: entry.category,
				defaultSpacingM: entry.defaultSpacingM,
				needsPollinator: entry.needsPollinator,
				notes: templateNotes(entry)
			})
			.returning({ id: schema.speciesTemplate.id })
			.get().id;
		for (const r of entry.rules) {
			tx.insert(schema.careRule)
				.values({
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
				})
				.run();
		}
		return id;
	});
}

function templateNotes(entry: CatalogEntry): string {
	return entry.altitudeWarning ? `⚠️ ${entry.altitudeWarning}\n\n${entry.notes}` : entry.notes;
}

/** Catalogue keys already linked to a template. */
export function importedCatalogKeys(db: Db): Set<string> {
	return new Set(
		db
			.select({ key: schema.speciesTemplate.catalogKey })
			.from(schema.speciesTemplate)
			.all()
			.map((r) => r.key)
			.filter((k): k is string => k != null)
	);
}
