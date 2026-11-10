import { i as redirect, t as error } from "../../../../chunks/exports.js";
import { c as getTemplateRules, d as getTreeOwnRules, g as effectiveRules, l as getTree } from "../../../../chunks/trees.js";
import { h as todayIso } from "../../../../chunks/dates.js";
import { t as CARE_RULE_TO_INTERVENTION } from "../../../../chunks/enums.js";
import { i as intervention, n as db, s as projectTask } from "../../../../chunks/db.js";
import { eq } from "drizzle-orm";
// src/routes/echeances/fait/+server.ts
var safeRedirect = (target) => typeof target === "string" && target.startsWith("/") && !target.startsWith("//") ? target : "/";
/**
* « Fait » button: records the intervention fulfilling a care rule (dated
* today, linked to the rule) or ticks a project task, then goes back.
*/
var POST = async ({ request }) => {
	const form = await request.formData();
	const kind = form.get("kind");
	const today = todayIso();
	if (kind === "care") {
		const t = getTree(Number(form.get("treeId")));
		if (!t || t.status !== "planted") error(404, "Arbre introuvable");
		const ruleId = Number(form.get("ruleId"));
		const rule = effectiveRules(getTemplateRules(t.speciesTemplateId), getTreeOwnRules(t.id)).find((r) => r.id === ruleId);
		if (!rule) error(404, "Règle introuvable");
		const notes = form.get("notes");
		db.insert(intervention).values({
			treeId: t.id,
			careRuleId: rule.id,
			date: today,
			type: CARE_RULE_TO_INTERVENTION[rule.type],
			notes: typeof notes === "string" && notes.trim() ? notes.trim() : rule.label
		}).run();
	} else if (kind === "task") db.update(projectTask).set({
		done: true,
		doneAt: today
	}).where(eq(projectTask.id, Number(form.get("taskId")))).run();
	else error(400, "Type inconnu");
	redirect(303, safeRedirect(form.get("redirectTo")));
};
export { POST };

//# sourceMappingURL=_server.ts.js.map