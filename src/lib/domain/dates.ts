/**
 * Calendar-day helpers. Dates are ISO strings 'YYYY-MM-DD' and are handled as
 * plain calendar days (no time zone arithmetic) to avoid DST surprises.
 */

export const GARDEN_TIME_ZONE = 'Europe/Paris';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isIsoDate(value: string): boolean {
	const m = ISO_DATE.exec(value);
	if (!m) return false;
	const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
	return mo >= 1 && mo <= 12 && d >= 1 && d <= daysInMonth(y, mo);
}

export function parseIsoDate(value: string): { year: number; month: number; day: number } {
	if (!isIsoDate(value)) throw new Error(`Invalid ISO date: ${value}`);
	const [year, month, day] = value.split('-').map(Number);
	return { year, month, day };
}

export function toIsoDate(year: number, month: number, day: number): string {
	return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
	return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/** Today's date in the garden's time zone (the server may run in UTC). */
export function todayIso(now: Date = new Date(), timeZone = GARDEN_TIME_ZONE): string {
	// 'en-CA' formats as YYYY-MM-DD.
	return new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(now);
}

/** Full years elapsed between two ISO dates (birthday-style). */
export function fullYearsBetween(from: string, to: string): number {
	const a = parseIsoDate(from);
	const b = parseIsoDate(to);
	let years = b.year - a.year;
	if (b.month < a.month || (b.month === a.month && b.day < a.day)) years -= 1;
	return years;
}

const MONTHS_SHORT = [
	'janv.',
	'févr.',
	'mars',
	'avr.',
	'mai',
	'juin',
	'juil.',
	'août',
	'sept.',
	'oct.',
	'nov.',
	'déc.'
];
const MONTHS_LONG = [
	'janvier',
	'février',
	'mars',
	'avril',
	'mai',
	'juin',
	'juillet',
	'août',
	'septembre',
	'octobre',
	'novembre',
	'décembre'
];

export const MONTH_NAMES = MONTHS_LONG;

/** '2026-03-05' → '5 mars 2026' */
export function formatDate(iso: string | null | undefined): string {
	if (!iso || !isIsoDate(iso)) return '';
	const { year, month, day } = parseIsoDate(iso);
	return `${day === 1 ? '1er' : day} ${MONTHS_LONG[month - 1]} ${year}`;
}

/** (3, 1) → '1er mars', (2, 15) → '15 févr.' */
export function formatDayMonth(month: number, day: number): string {
	return `${day === 1 ? '1er' : day} ${MONTHS_SHORT[month - 1]}`;
}

export function formatWindow(w: {
	startMonth: number;
	startDay: number;
	endMonth: number;
	endDay: number;
}): string {
	return `du ${formatDayMonth(w.startMonth, w.startDay)} au ${formatDayMonth(w.endMonth, w.endDay)}`;
}

/** Human-readable age: 'moins d'un an', '1 an', '3 ans'. */
export function formatAge(years: number): string {
	if (years < 1) return "moins d'un an";
	return years === 1 ? '1 an' : `${years} ans`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const toUtcMs = (iso: string) => {
	const { year, month, day } = parseIsoDate(iso);
	return Date.UTC(year, month - 1, day);
};
const fromUtcMs = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function addDays(iso: string, days: number): string {
	return fromUtcMs(toUtcMs(iso) + days * DAY_MS);
}

/** Number of days from `a` to `b` (positive when b is after a). */
export function diffDays(a: string, b: string): number {
	return Math.round((toUtcMs(b) - toUtcMs(a)) / DAY_MS);
}

/** Monday of the ISO week containing the date. */
export function startOfIsoWeek(iso: string): string {
	const weekday = (new Date(toUtcMs(iso)).getUTCDay() + 6) % 7; // 0 = Monday
	return addDays(iso, -weekday);
}

/** Sunday of the ISO week containing the date. */
export function endOfIsoWeek(iso: string): string {
	return addDays(startOfIsoWeek(iso), 6);
}

export function endOfMonth(iso: string): string {
	const { year, month } = parseIsoDate(iso);
	return toIsoDate(year, month, daysInMonth(year, month));
}

/** Build a date, clamping the day to the month length (Feb 29 → Feb 28). */
export function clampedDate(year: number, month: number, day: number): string {
	return toIsoDate(year, month, Math.min(day, daysInMonth(year, month)));
}

export const maxDate = (a: string, b: string) => (a > b ? a : b);
export const minDate = (a: string, b: string) => (a < b ? a : b);

/** '2026-11-10' → 'mar. 10 nov.' ('mar. 10 nov. 2026' when `currentYear` differs). */
export function formatShortDate(iso: string, currentYear?: number): string {
	const { year, month, day } = parseIsoDate(iso);
	const weekday = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'][
		new Date(Date.UTC(year, month - 1, day)).getUTCDay()
	];
	const suffix = currentYear !== undefined && currentYear !== year ? ` ${year}` : '';
	return `${weekday} ${day === 1 ? '1er' : day} ${MONTHS_SHORT[month - 1]}${suffix}`;
}
