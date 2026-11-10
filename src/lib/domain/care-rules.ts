/**
 * Care rule inheritance: a tree inherits the rules of its species template,
 * can override or hide some of them, and can have extra rules of its own.
 */

export interface RuleLike {
	id: number;
	speciesTemplateId: number | null;
	treeId: number | null;
	overridesRuleId: number | null;
	disabled: boolean;
}

export type RuleSource = 'template' | 'override' | 'tree';

export interface ResolvedRule<R extends RuleLike> {
	/** The rule that applies (template rule, tree override, or tree-only rule). */
	rule: R;
	source: RuleSource;
	/** For template-based rules: the template rule this entry derives from. */
	templateRule: R | null;
	/** True when the template rule was hidden for this tree. */
	hidden: boolean;
}

/**
 * Resolve the rules of a tree.
 *
 * Returns every template rule (possibly overridden or hidden) followed by the
 * tree-specific rules. Use `effectiveRules` to keep only those that apply.
 * Overrides pointing to a rule that is not in the template (e.g. after the
 * tree's species changed) are ignored.
 */
export function resolveTreeRules<R extends RuleLike>(
	templateRules: readonly R[],
	treeRules: readonly R[]
): ResolvedRule<R>[] {
	const overrides = new Map<number, R>();
	const extras: R[] = [];
	for (const rule of treeRules) {
		if (rule.overridesRuleId != null) overrides.set(rule.overridesRuleId, rule);
		else extras.push(rule);
	}

	const resolved: ResolvedRule<R>[] = templateRules.map((templateRule) => {
		const override = overrides.get(templateRule.id);
		if (!override) return { rule: templateRule, source: 'template', templateRule, hidden: false };
		return {
			rule: override,
			source: 'override',
			templateRule,
			hidden: override.disabled
		};
	});

	for (const rule of extras) {
		resolved.push({ rule, source: 'tree', templateRule: null, hidden: rule.disabled });
	}
	return resolved;
}

/** The rules that actually apply to the tree (hidden ones removed). */
export function effectiveRules<R extends RuleLike>(
	templateRules: readonly R[],
	treeRules: readonly R[]
): R[] {
	return resolveTreeRules(templateRules, treeRules)
		.filter((r) => !r.hidden)
		.map((r) => r.rule);
}

/** Sort key so a calendar reads from January to December. */
export function compareByWindowStart(
	a: { startMonth: number; startDay: number },
	b: { startMonth: number; startDay: number }
): number {
	return a.startMonth - b.startMonth || a.startDay - b.startDay;
}
