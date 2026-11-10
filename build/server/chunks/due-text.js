import { c as formatDate, i as diffDays, l as formatShortDate, m as parseIsoDate } from "./dates.js";
// src/lib/domain/due-text.ts
/** Short French description of when an item is due, e.g. « En retard de 3 jours ». */
function dueText(item, today) {
	const days = diffDays(today, item.dueDate);
	const isWindow = item.kind === "care" && !item.intervalDays;
	const year = parseIsoDate(today).year;
	const formatShortDate$1 = (iso) => formatShortDate(iso, year);
	switch (item.status) {
		case "done": return item.kind === "care" && item.doneDate ? `Fait le ${formatDate(item.doneDate)}` : "Fait";
		case "overdue": return isWindow ? `En retard : période finie le ${formatShortDate$1(item.dueDate)}` : `En retard de ${-days} jour${-days > 1 ? "s" : ""}`;
		case "due":
			if (!isWindow) return "Aujourd'hui";
			return days === 0 ? "Dernier jour aujourd'hui" : `À faire d'ici le ${formatShortDate$1(item.dueDate)} (${days} j)`;
		case "upcoming":
			if (item.kind === "care" && isWindow) return `À partir du ${formatShortDate$1(item.windowStart)}`;
			return days === 1 ? "Demain" : `Le ${formatShortDate$1(item.dueDate)}`;
	}
}
export { dueText as t };

//# sourceMappingURL=due-text.js.map