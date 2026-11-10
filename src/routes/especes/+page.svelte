<script lang="ts">
	import { SPECIES_CATEGORY_LABELS } from '#lib/domain/enums.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>Modèles d'espèces · Mon petit lopin</title></svelte:head>

<a class="back" href="/plus">← Plus</a>
<div class="page-header">
	<h1>Modèles d'espèces</h1>
	<a class="btn primary small" href="/especes/nouveau">+ Nouveau</a>
</div>
<p class="muted">
	Chaque modèle préremplit le calendrier d'entretien des arbres de cette espèce. Les valeurs
	proposées sont marquées « à vérifier » tant que tu ne les as pas validées.
</p>

<ul class="list">
	{#each data.templates as t (t.id)}
		<li>
			<a class="card item" href="/especes/{t.id}">
				<div>
					<strong>{t.commonName}</strong>
					{#if t.latinName}<em class="muted"> {t.latinName}</em>{/if}
				</div>
				<div class="muted small">
					{SPECIES_CATEGORY_LABELS[t.category]} · {t.ruleCount} règle{t.ruleCount > 1 ? 's' : ''} ·
					{t.treeCount} arbre{t.treeCount > 1 ? 's' : ''}
				</div>
				{#if t.unverified}
					<span class="badge warning">{t.unverified} à vérifier</span>
				{/if}
			</a>
		</li>
	{:else}
		<li class="muted">Aucun modèle.</li>
	{/each}
</ul>

<style>
	.item {
		display: block;
		color: var(--text);
		text-decoration: none;
	}
	.small {
		font-size: 0.875rem;
	}
</style>
