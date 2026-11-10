<script lang="ts">
	import { CARE_RULE_TYPE_LABELS, type CareRuleType } from '#lib/domain/enums.ts';
	import { formatAge, formatWindow } from '#lib/domain/dates.ts';

	interface Rule {
		id: number;
		type: CareRuleType;
		label: string;
		startMonth: number;
		startDay: number;
		endMonth: number;
		endDay: number;
		intervalDays: number | null;
		minAgeYears: number | null;
		maxAgeYears: number | null;
		verified: boolean;
		notes: string | null;
	}

	let { rules, sourceLabels }: { rules: Rule[]; sourceLabels?: Map<number, string> } = $props();

	function ageText(r: Rule) {
		if (r.minAgeYears != null && r.maxAgeYears != null)
			return `de ${formatAge(r.minAgeYears)} à ${formatAge(r.maxAgeYears)}`;
		if (r.minAgeYears != null) return `à partir de ${formatAge(r.minAgeYears)}`;
		if (r.maxAgeYears != null)
			return r.maxAgeYears === 1 ? 'la première année' : `les ${r.maxAgeYears} premières années`;
		return null;
	}
</script>

{#if rules.length === 0}
	<p class="muted">Aucune règle d'entretien.</p>
{:else}
	<ul class="list">
		{#each rules as r (r.id)}
			<li class="card rule">
				<div class="head">
					<strong>{r.label}</strong>
					<span class="badges">
						{#if sourceLabels?.get(r.id)}<span class="badge">{sourceLabels.get(r.id)}</span>{/if}
						{#if !r.verified}<span class="badge warning">à vérifier</span>{/if}
					</span>
				</div>
				<div class="muted small">
					{CARE_RULE_TYPE_LABELS[r.type]} · {formatWindow(r)}
					{#if r.intervalDays}· tous les {r.intervalDays} jours{/if}
					{#if ageText(r)}· {ageText(r)}{/if}
				</div>
				{#if r.notes}<p class="notes small">{r.notes}</p>{/if}
			</li>
		{/each}
	</ul>
{/if}

<style>
	.rule {
		padding: 0.75rem;
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: baseline;
	}
	.badges {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.small {
		font-size: 0.875rem;
	}
	p {
		margin: 0.4rem 0 0;
	}
</style>
