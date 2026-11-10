import { d as fullYearsBetween, h as todayIso } from "../../../chunks/dates.js";
import { p as listTrees } from "../../../chunks/trees.js";
// src/routes/arbres/+page.server.ts
var load = () => {
	const today = todayIso();
	const trees = listTrees().map((t) => ({
		...t,
		ageYears: t.status === "planted" && t.plantingDate ? fullYearsBetween(t.plantingDate, today) : null
	}));
	return {
		planted: trees.filter((t) => t.status === "planted"),
		purchased: trees.filter((t) => t.status === "purchased"),
		gone: trees.filter((t) => t.status === "dead" || t.status === "removed")
	};
};
export { load };

//# sourceMappingURL=_page.server.ts.js.map