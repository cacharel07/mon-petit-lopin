<script lang="ts">
	import { CARE_RULE_TYPE_LABELS } from '#lib/domain/enums.ts';
	import { formatAge, formatWindow } from '#lib/domain/dates.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const SOURCE_LABELS = {
		template: 'du modèle',
		override: 'personnalisée',
		tree: 'propre à l’arbre'
	} as const;
</script>

<svelte:head><title>Entretien · {data.tree.name} · Mon petit lopin</title></svelte:head>

<a class="back" href="/arbres/{data.tree.id}">← {data.tree.name}</a>
<h1>Calendrier d'entretien</h1>
<p class="muted">
	{#if data.template}
		Les règles viennent du modèle « <a href="/especes/{data.template.id}"
			>{data.template.commonName}</a
		> ». Tu peux personnaliser ou masquer une règle pour cet arbre seulement, ou ajouter des règles propres
		à l'arbre.
	{:else}
		Cet arbre n'a pas de modèle d'espèce : ajoute ses règles ci-dessous.
	{/if}
</p>

<ul class="list">
	{#each data.rules as r (r.rule.id)}
		{@const rule = r.rule}
		<li class="card rule" class:hidden={r.hidden}>
			<div class="head">
				<strong>{rule.label}</strong>
				<span class="badges">
					<span class="badge">{r.hidden ? 'masquée' : SOURCE_LABELS[r.source]}</span>
					{#if !rule.verified && !r.hidden}<span class="badge warning">à vérifier</span>{/if}
				</span>
			</div>
			<div class="muted small">
				{CARE_RULE_TYPE_LABELS[rule.type]} · {formatWindow(rule)}
				{#if rule.intervalDays}· tous les {rule.intervalDays} jours{/if}
				{#if rule.minAgeYears != null}· dès {formatAge(rule.minAgeYears)}{/if}
				{#if rule.maxAgeYears != null}· avant {formatAge(rule.maxAgeYears)}{/if}
			</div>
			<div class="actions">
				{#if r.source === 'template'}
					<a class="btn small" href="/arbres/{data.tree.id}/entretien/nouvelle?remplace={rule.id}"
						>Personnaliser</a
					>
					<form method="POST" action="?/hide">
						<input type="hidden" name="ruleId" value={rule.id} />
						<button class="btn small" type="submit">Masquer</button>
					</form>
				{:else if r.source === 'override'}
					{#if !r.hidden}
						<a class="btn small" href="/arbres/{data.tree.id}/entretien/{rule.id}">Modifier</a>
					{/if}
					<form method="POST" action="?/reset">
						<input type="hidden" name="ruleId" value={r.templateRule?.id} />
						<button class="btn small" type="submit">Revenir au modèle</button>
					</form>
				{:else}
					<a class="btn small" href="/arbres/{data.tree.id}/entretien/{rule.id}">Modifier</a>
				{/if}
			</div>
		</li>
	{:else}
		<li class="muted">Aucune règle.</li>
	{/each}
</ul>

<p><a class="btn" href="/arbres/{data.tree.id}/entretien/nouvelle">+ Ajouter une règle</a></p>

<style>
	.rule {
		padding: 0.75rem;
	}
	.rule.hidden strong {
		text-decoration: line-through;
		color: var(--muted);
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
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
	.actions {
		margin-top: 0.5rem;
	}
</style>
