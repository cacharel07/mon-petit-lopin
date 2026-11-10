import { redirect } from '@sveltejs/kit';
import { count, isNotNull } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { careRule, tree } from '#lib/server/db/schema.ts';
import { catalogEntry } from '#lib/server/catalog.ts';
import { ensureTemplateFromCatalog, importedCatalogKeys } from '#lib/server/catalog-templates.ts';
import { catalogForForms } from '#lib/server/catalog-view.ts';
import { FormError, requiredText, withForm } from '#lib/server/forms.ts';
import { listTemplates } from '#lib/server/trees.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const rules = db
		.select({ templateId: careRule.speciesTemplateId, verified: careRule.verified })
		.from(careRule)
		.where(isNotNull(careRule.speciesTemplateId))
		.all();
	const trees = new Map(
		db
			.select({ id: tree.speciesTemplateId, n: count() })
			.from(tree)
			.groupBy(tree.speciesTemplateId)
			.all()
			.map((r) => [r.id, r.n])
	);
	const imported = importedCatalogKeys(db);
	return {
		catalog: catalogForForms().filter((e) => !imported.has(e.key)),
		templates: listTemplates().map((t) => {
			const own = rules.filter((r) => r.templateId === t.id);
			return {
				...t,
				ruleCount: own.length,
				unverified: own.filter((r) => !r.verified).length,
				treeCount: trees.get(t.id) ?? 0
			};
		})
	};
};

export const actions: Actions = {
	/** Create a template (and its care rules) from a catalogue entry. */
	import: ({ request }) =>
		withForm(request, (form) => {
			const key = requiredText(form, 'key', 'Espèce');
			if (!catalogEntry(key)) throw new FormError('Espèce inconnue.');
			redirect(303, `/especes/${ensureTemplateFromCatalog(db, key)}`);
		})
};
