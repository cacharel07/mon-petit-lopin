import type { ProjectStatus } from './enums.ts';

/** Progress in percent: share of checked tasks, or 0/100 from the status when there is no task. */
export function projectProgress(
	tasks: readonly { done: boolean }[],
	status: ProjectStatus
): number {
	if (status === 'done') return 100;
	if (tasks.length === 0) return 0;
	return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}

interface Dates {
	actualStart: string | null;
	actualEnd: string | null;
}

/**
 * Dates to store when a project changes status: starting a project sets its
 * actual start (if empty), finishing it sets its actual end (if empty), and
 * moving a finished project back clears the end date.
 */
export function datesForStatus(
	current: Dates,
	from: ProjectStatus,
	to: ProjectStatus,
	today: string
): Dates {
	// Only the two date fields: callers spread the result into an update.
	const next: Dates = { actualStart: current.actualStart, actualEnd: current.actualEnd };
	if (to === 'in_progress' || to === 'done') next.actualStart ??= today;
	if (to === 'done') next.actualEnd ??= today;
	if (from === 'done' && to !== 'done') next.actualEnd = null;
	return next;
}

/** '1 250,50' / '1250.5' / '1250' → 125050 cents. Returns null for empty, NaN for invalid. */
export function parseEuros(value: string | null): number | null {
	if (value == null) return null;
	const cleaned = value.replace(/[\s €]/g, '').replace(',', '.');
	if (cleaned === '') return null;
	if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return Number.NaN;
	return Math.round(Number(cleaned) * 100);
}

/** 125050 → '1 250,50 €' */
export function formatEuros(cents: number | null | undefined): string {
	if (cents == null) return '';
	return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

/** Cents → value for an input ('1250,5' style without thousands separator). */
export function centsToInput(cents: number | null | undefined): string {
	if (cents == null) return '';
	const euros = cents / 100;
	return Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace('.', ',');
}
