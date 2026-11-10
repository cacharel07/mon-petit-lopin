import { diffDays, formatDate, formatShortDate as fmt, parseIsoDate } from './dates.ts';
import type { DueItem } from './schedule.ts';

/** Short French description of when an item is due, e.g. « En retard de 3 jours ». */
export function dueText(item: DueItem, today: string): string {
	const days = diffDays(today, item.dueDate);
	const isWindow = item.kind === 'care' && !item.intervalDays;
	const year = parseIsoDate(today).year;
	const formatShortDate = (iso: string) => fmt(iso, year);

	switch (item.status) {
		case 'done':
			return item.kind === 'care' && item.doneDate
				? `Fait le ${formatDate(item.doneDate)}`
				: 'Fait';
		case 'overdue':
			return isWindow
				? `En retard : période finie le ${formatShortDate(item.dueDate)}`
				: `En retard de ${-days} jour${-days > 1 ? 's' : ''}`;
		case 'due':
			if (!isWindow) return "Aujourd'hui";
			return days === 0
				? "Dernier jour aujourd'hui"
				: `À faire d'ici le ${formatShortDate(item.dueDate)} (${days} j)`;
		case 'upcoming':
			if (item.kind === 'care' && isWindow)
				return `À partir du ${formatShortDate(item.windowStart)}`;
			return days === 1 ? 'Demain' : `Le ${formatShortDate(item.dueDate)}`;
	}
}
