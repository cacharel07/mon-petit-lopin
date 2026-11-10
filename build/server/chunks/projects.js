// src/lib/domain/projects.ts
/** Progress in percent: share of checked tasks, or 0/100 from the status when there is no task. */
function projectProgress(tasks, status) {
	if (status === "done") return 100;
	if (tasks.length === 0) return 0;
	return Math.round(tasks.filter((t) => t.done).length / tasks.length * 100);
}
/**
* Dates to store when a project changes status: starting a project sets its
* actual start (if empty), finishing it sets its actual end (if empty), and
* moving a finished project back clears the end date.
*/
function datesForStatus(current, from, to, today) {
	const next = {
		actualStart: current.actualStart,
		actualEnd: current.actualEnd
	};
	if (to === "in_progress" || to === "done") next.actualStart ??= today;
	if (to === "done") next.actualEnd ??= today;
	if (from === "done" && to !== "done") next.actualEnd = null;
	return next;
}
/** '1 250,50' / '1250.5' / '1250' → 125050 cents. Returns null for empty, NaN for invalid. */
function parseEuros(value) {
	if (value == null) return null;
	const cleaned = value.replace(/[\s €]/g, "").replace(",", ".");
	if (cleaned === "") return null;
	if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return NaN;
	return Math.round(Number(cleaned) * 100);
}
/** 125050 → '1 250,50 €' */
function formatEuros(cents) {
	if (cents == null) return "";
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR"
	}).format(cents / 100);
}
/** Cents → value for an input ('1250,5' style without thousands separator). */
function centsToInput(cents) {
	if (cents == null) return "";
	const euros = cents / 100;
	return Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace(".", ",");
}
export { projectProgress as a, parseEuros as i, datesForStatus as n, formatEuros as r, centsToInput as t };

//# sourceMappingURL=projects.js.map