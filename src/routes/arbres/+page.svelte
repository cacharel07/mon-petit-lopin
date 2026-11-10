<script lang="ts">
	import TreeCard from '#lib/components/TreeCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>Arbres · Mon petit lopin</title></svelte:head>

<div class="page-header">
	<h1>Arbres</h1>
	<a class="btn primary small" href="/arbres/nouveau">+ Ajouter</a>
</div>

{#if data.purchased.length}
	<h2>À planter ({data.purchased.length})</h2>
	<ul class="list">
		{#each data.purchased as tree (tree.id)}<li><TreeCard {tree} /></li>{/each}
	</ul>
{/if}

<h2>Plantés ({data.planted.length})</h2>
<ul class="list">
	{#each data.planted as tree (tree.id)}
		<li><TreeCard {tree} /></li>
	{:else}
		<li class="muted">Aucun arbre planté pour l'instant.</li>
	{/each}
</ul>

{#if data.gone.length}
	<details>
		<summary><h2>Morts ou retirés ({data.gone.length})</h2></summary>
		<ul class="list">
			{#each data.gone as tree (tree.id)}<li><TreeCard {tree} /></li>{/each}
		</ul>
	</details>
{/if}

<style>
	summary {
		cursor: pointer;
	}
	summary h2 {
		display: inline;
	}
	details {
		margin-top: 1.5rem;
	}
</style>
