import { describe, expect, it } from 'vitest';
import { effectiveRules, resolveTreeRules, type RuleLike } from './care-rules.ts';

type R = RuleLike & { label: string };

const tpl = (id: number, label: string): R => ({
	id,
	label,
	speciesTemplateId: 1,
	treeId: null,
	overridesRuleId: null,
	disabled: false
});
const treeRule = (
	id: number,
	label: string,
	overridesRuleId: number | null = null,
	disabled = false
): R => ({
	id,
	label,
	speciesTemplateId: null,
	treeId: 10,
	overridesRuleId,
	disabled
});

describe('resolveTreeRules', () => {
	const template = [tpl(1, 'Taille'), tpl(2, 'Arrosage'), tpl(3, 'Récolte')];

	it('inherits every template rule when the tree has no rule of its own', () => {
		const resolved = resolveTreeRules(template, []);
		expect(resolved.map((r) => [r.rule.label, r.source])).toEqual([
			['Taille', 'template'],
			['Arrosage', 'template'],
			['Récolte', 'template']
		]);
	});

	it('replaces an overridden rule and keeps a link to the template rule', () => {
		const resolved = resolveTreeRules(template, [treeRule(20, 'Arrosage renforcé', 2)]);
		expect(resolved[1]).toMatchObject({
			source: 'override',
			hidden: false,
			rule: { label: 'Arrosage renforcé' },
			templateRule: { id: 2 }
		});
	});

	it('hides a disabled override', () => {
		const rules = effectiveRules(template, [treeRule(20, 'Récolte', 3, true)]);
		expect(rules.map((r) => r.label)).toEqual(['Taille', 'Arrosage']);
	});

	it('appends tree-only rules', () => {
		const rules = effectiveRules(template, [treeRule(30, 'Tuteurage')]);
		expect(rules.map((r) => r.label)).toEqual(['Taille', 'Arrosage', 'Récolte', 'Tuteurage']);
	});

	it('ignores overrides of rules that are not in the template', () => {
		const rules = effectiveRules(template, [treeRule(40, 'Orpheline', 99)]);
		expect(rules.map((r) => r.label)).toEqual(['Taille', 'Arrosage', 'Récolte']);
	});

	it('works for a tree without species template', () => {
		expect(effectiveRules([], [treeRule(50, 'Paillage')]).map((r) => r.label)).toEqual([
			'Paillage'
		]);
	});
});
