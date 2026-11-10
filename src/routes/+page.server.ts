import { count, eq, isNotNull, and } from 'drizzle-orm';
import { endOfIsoWeek, endOfMonth, maxDate, todayIso } from '#lib/domain/dates.ts';
import { groupForDashboard } from '#lib/domain/schedule.ts';
import { db } from '#lib/server/db/index.ts';
import { careRule, tree } from '#lib/server/db/schema.ts';
import { listProjects } from '#lib/server/projects.ts';
import { allDueItems } from '#lib/server/schedule.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const today = todayIso();
	const weekEnd = endOfIsoWeek(today);
	const monthEnd = endOfMonth(today);
	const items = allDueItems({ today, horizon: maxDate(weekEnd, monthEnd) });

	const toPlant = db.select({ n: count() }).from(tree).where(eq(tree.status, 'purchased')).get();
	const unverified = db
		.select({ n: count() })
		.from(careRule)
		.where(and(isNotNull(careRule.speciesTemplateId), eq(careRule.verified, false)))
		.get();

	return {
		today,
		groups: groupForDashboard(items, weekEnd, monthEnd),
		inProgress: listProjects().filter((p) => p.status === 'in_progress'),
		toPlant: toPlant?.n ?? 0,
		unverified: unverified?.n ?? 0
	};
};
