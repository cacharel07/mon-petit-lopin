<script lang="ts">
	import { SPECIES_CATEGORIES, SPECIES_CATEGORY_LABELS } from '#lib/domain/enums.ts';
	import type { CatalogOption } from '#lib/server/catalog-view.ts';

	interface Props {
		catalog: CatalogOption[];
		/** Own templates that do not come from the catalogue. */
		ownTemplates: { id: number; commonName: string; latinName: string | null }[];
	}
	let { catalog, ownTemplates }: Props = $props();

	let query = $state('');
	const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
	const matches = (...texts: (string | null)[]) =>
		!query.trim() || texts.some((t) => t && normalize(t).includes(normalize(query.trim())));

	const groups = $derived(
		SPECIES_CATEGORIES.map((category) => ({
			category,
			entries: catalog.filter(
				(e) =>
					e.category === category &&
					matches(e.commonName, e.latinName, ...e.varieties.map((v) => v.name))
			)
		})).filter((g) => g.entries.length)
	);
	const own = $derived(ownTemplates.filter((t) => matches(t.commonName, t.latinName)));
</script>

<input
	type="search"
	bind:value={query}
	placeholder="Rechercher une espèce ou une variété…"
	aria-label="Rechercher une espèce"
/>

{#if own.length}
	<h2>Mes modèles</h2>
	<div class="grid">
		{#each own as t (t.id)}
			<a class="card choice" href="?espece=modele-{t.id}">
				<strong>{t.commonName}</strong>
				{#if t.latinName}<em class="muted">{t.latinName}</em>{/if}
			</a>
		{/each}
	</div>
{/if}

{#each groups as g (g.category)}
	<h2>{SPECIES_CATEGORY_LABELS[g.category]}</h2>
	<div class="grid">
		{#each g.entries as e (e.key)}
			<a class="card choice" href="?espece={e.key}">
				<strong>{e.commonName}</strong>
				<em class="muted">{e.latinName}</em>
				{#if e.altitudeWarning}<span class="badge warning">altitude</span>{/if}
			</a>
		{/each}
	</div>
{/each}

{#if !groups.length && !own.length}
	<p class="muted">Aucune espèce ne correspond.</p>
{/if}

<p class="free"><a class="btn" href="?espece=libre">Autre espèce (saisie libre)</a></p>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.5rem;
	}
	.choice {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.6rem 0.75rem;
		color: var(--text);
		text-decoration: none;
		min-height: 44px;
	}
	.choice em {
		font-size: 0.8rem;
	}
	.choice .badge {
		align-self: flex-start;
		margin-top: 0.2rem;
	}
	.free {
		margin-top: 1.5rem;
	}
</style>
