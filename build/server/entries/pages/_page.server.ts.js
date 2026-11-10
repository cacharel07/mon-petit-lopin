import { a as endOfIsoWeek, h as todayIso, o as endOfMonth, p as maxDate } from "../../chunks/dates.js";
import { r as groupForDashboard, t as allDueItems } from "../../chunks/schedule.js";
import { d as tree, n as db, r as careRule } from "../../chunks/db.js";
import { a as listProjects } from "../../chunks/projects2.js";
import { and, count, eq, isNotNull } from "drizzle-orm";
// src/routes/+page.server.ts
var load = () => {
	const today = todayIso();
	const weekEnd = endOfIsoWeek(today);
	const monthEnd = endOfMonth(today);
	const items = allDueItems({
		today,
		horizon: maxDate(weekEnd, monthEnd)
	});
	const toPlant = db.select({ n: count() }).from(tree).where(eq(tree.status, "purchased")).get();
	const unverified = db.select({ n: count() }).from(careRule).where(and(isNotNull(careRule.speciesTemplateId), eq(careRule.verified, false))).get();
	return {
		today,
		groups: groupForDashboard(items, weekEnd, monthEnd),
		inProgress: listProjects().filter((p) => p.status === "in_progress"),
		toPlant: toPlant?.n ?? 0,
		unverified: unverified?.n ?? 0
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map