import { count, isNotNull } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { careRule, tree } from '#lib/server/db/schema.ts';
import { listTemplates } from '#lib/server/trees.ts';
import type { PageServerLoad } from './$types';

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
	return {
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
