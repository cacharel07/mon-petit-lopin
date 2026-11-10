import { fullYearsBetween, todayIso } from '#lib/domain/dates.ts';
import { listTrees } from '#lib/server/trees.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const today = todayIso();
	const trees = listTrees().map((t) => ({
		...t,
		ageYears:
			t.status === 'planted' && t.plantingDate ? fullYearsBetween(t.plantingDate, today) : null
	}));
	return {
		planted: trees.filter((t) => t.status === 'planted'),
		purchased: trees.filter((t) => t.status === 'purchased'),
		gone: trees.filter((t) => t.status === 'dead' || t.status === 'removed')
	};
};
