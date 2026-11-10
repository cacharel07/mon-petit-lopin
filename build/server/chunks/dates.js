// src/lib/domain/dates.ts
/**
* Calendar-day helpers. Dates are ISO strings 'YYYY-MM-DD' and are handled as
* plain calendar days (no time zone arithmetic) to avoid DST surprises.
*/
var GARDEN_TIME_ZONE = "Europe/Paris";
var ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
function isIsoDate(value) {
	const m = ISO_DATE.exec(value);
	if (!m) return false;
	const [y, mo, d] = [
		Number(m[1]),
		Number(m[2]),
		Number(m[3])
	];
	return mo >= 1 && mo <= 12 && d >= 1 && d <= daysInMonth(y, mo);
}
function parseIsoDate(value) {
	if (!isIsoDate(value)) throw new Error(`Invalid ISO date: ${value}`);
	const [year, month, day] = value.split("-").map(Number);
	return {
		year,
		month,
		day
	};
}
function toIsoDate(year, month, day) {
	return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function isLeapYear(year) {
	return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
function daysInMonth(year, month) {
	return [
		31,
		isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	][month - 1];
}
/** Today's date in the garden's time zone (the server may run in UTC). */
function todayIso(now = /* @__PURE__ */ new Date(), timeZone = GARDEN_TIME_ZONE) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now);
}
/** Full years elapsed between two ISO dates (birthday-style). */
function fullYearsBetween(from, to) {
	const a = parseIsoDate(from);
	const b = parseIsoDate(to);
	let years = b.year - a.year;
	if (b.month < a.month || b.month === a.month && b.day < a.day) years -= 1;
	return years;
}
var MONTHS_SHORT = [
	"janv.",
	"févr.",
	"mars",
	"avr.",
	"mai",
	"juin",
	"juil.",
	"août",
	"sept.",
	"oct.",
	"nov.",
	"déc."
];
var MONTHS_LONG = [
	"janvier",
	"février",
	"mars",
	"avril",
	"mai",
	"juin",
	"juillet",
	"août",
	"septembre",
	"octobre",
	"novembre",
	"décembre"
];
var MONTH_NAMES = MONTHS_LONG;
/** '2026-03-05' → '5 mars 2026' */
function formatDate(iso) {
	if (!iso || !isIsoDate(iso)) return "";
	const { year, month, day } = parseIsoDate(iso);
	return `${day === 1 ? "1er" : day} ${MONTHS_LONG[month - 1]} ${year}`;
}
/** (3, 1) → '1er mars', (2, 15) → '15 févr.' */
function formatDayMonth(month, day) {
	return `${day === 1 ? "1er" : day} ${MONTHS_SHORT[month - 1]}`;
}
function formatWindow(w) {
	return `du ${formatDayMonth(w.startMonth, w.startDay)} au ${formatDayMonth(w.endMonth, w.endDay)}`;
}
/** Human-readable age: 'moins d'un an', '1 an', '3 ans'. */
function formatAge(years) {
	if (years < 1) return "moins d'un an";
	return years === 1 ? "1 an" : `${years} ans`;
}
var DAY_MS = 864e5;
var toUtcMs = (iso) => {
	const { year, month, day } = parseIsoDate(iso);
	return Date.UTC(year, month - 1, day);
};
var fromUtcMs = (ms) => new Date(ms).toISOString().slice(0, 10);
function addDays(iso, days) {
	return fromUtcMs(toUtcMs(iso) + days * DAY_MS);
}
/** Number of days from `a` to `b` (positive when b is after a). */
function diffDays(a, b) {
	return Math.round((toUtcMs(b) - toUtcMs(a)) / DAY_MS);
}
/** Monday of the ISO week containing the date. */
function startOfIsoWeek(iso) {
	return addDays(iso, -((new Date(toUtcMs(iso)).getUTCDay() + 6) % 7));
}
/** Sunday of the ISO week containing the date. */
function endOfIsoWeek(iso) {
	return addDays(startOfIsoWeek(iso), 6);
}
function endOfMonth(iso) {
	const { year, month } = parseIsoDate(iso);
	return toIsoDate(year, month, daysInMonth(year, month));
}
/** Build a date, clamping the day to the month length (Feb 29 → Feb 28). */
function clampedDate(year, month, day) {
	return toIsoDate(year, month, Math.min(day, daysInMonth(year, month)));
}
var maxDate = (a, b) => a > b ? a : b;
/** '2026-11-10' → 'mar. 10 nov.' ('mar. 10 nov. 2026' when `currentYear` differs). */
function formatShortDate(iso, currentYear) {
	const { year, month, day } = parseIsoDate(iso);
	const weekday = [
		"dim.",
		"lun.",
		"mar.",
		"mer.",
		"jeu.",
		"ven.",
		"sam."
	][new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
	const suffix = currentYear !== void 0 && currentYear !== year ? ` ${year}` : "";
	return `${weekday} ${day === 1 ? "1er" : day} ${MONTHS_SHORT[month - 1]}${suffix}`;
}
export { endOfIsoWeek as a, formatDate as c, fullYearsBetween as d, isIsoDate as f, todayIso as h, diffDays as i, formatShortDate as l, parseIsoDate as m, addDays as n, endOfMonth as o, maxDate as p, clampedDate as r, formatAge as s, MONTH_NAMES as t, formatWindow as u };

//# sourceMappingURL=dates.js.map