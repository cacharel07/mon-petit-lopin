<script lang="ts">
	import { SPECIES_CATEGORIES, SPECIES_CATEGORY_LABELS } from '#lib/domain/enums.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const catalogGroups = $derived(
		SPECIES_CATEGORIES.map((category) => ({
			category,
			entries: data.catalog.filter((e) => e.category === category)
		})).filter((g) => g.entries.length)
	);
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

{#if data.catalog.length}
	<h2>Ajouter depuis le catalogue</h2>
	<p class="muted small">
		Fiches pré-établies pour 850 m d'altitude : calendrier d'entretien, variétés et porte-greffes
		courants. Elles sont aussi proposées directement à la création d'un arbre.
	</p>
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	{#each catalogGroups as g (g.category)}
		<h3>{SPECIES_CATEGORY_LABELS[g.category]}</h3>
		<ul class="list">
			{#each g.entries as e (e.key)}
				<li class="card catalog-item">
					<div>
						<strong>{e.commonName}</strong> <em class="muted small">{e.latinName}</em>
						{#if e.altitudeWarning}<div class="small warn">⚠️ {e.altitudeWarning}</div>{/if}
					</div>
					<form method="POST" action="?/import">
						<input type="hidden" name="key" value={e.key} />
						<button class="btn small" type="submit">Ajouter</button>
					</form>
				</li>
			{/each}
		</ul>
	{/each}
{/if}

<style>
	h3 {
		font-size: 1rem;
		margin: 1rem 0 0.4rem;
	}
	.catalog-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
	}
	.warn {
		color: var(--warning);
	}
	.item {
		display: block;
		color: var(--text);
		text-decoration: none;
	}
	.small {
		font-size: 0.875rem;
	}
</style>
