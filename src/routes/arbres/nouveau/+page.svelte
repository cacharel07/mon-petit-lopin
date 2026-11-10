<script lang="ts">
	import SpeciesPicker from '#lib/components/SpeciesPicker.svelte';
	import TreeForm from '#lib/components/TreeForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const values = $derived(form?.values ?? data.values);
</script>

<svelte:head><title>Nouvel arbre · Mon petit lopin</title></svelte:head>

{#if values}
	<a class="back" href="/arbres/nouveau">← Choisir une autre espèce</a>
	<h1>Nouvel arbre</h1>
	<form method="POST" class="card stack">
		{#if form?.error}<p class="error">{form.error}</p>{/if}
		<TreeForm
			{values}
			zones={data.zones}
			templates={data.templates}
			catalog={data.catalog}
			otherTrees={data.otherTrees}
		/>
		<button class="btn primary" type="submit">Créer la fiche</button>
	</form>
{:else}
	<a class="back" href="/arbres">← Arbres</a>
	<h1>Quelle espèce ?</h1>
	<p class="muted">
		La fiche et son calendrier d'entretien seront préremplis (valeurs « à vérifier »).
	</p>
	<SpeciesPicker
		catalog={data.catalog}
		ownTemplates={data.templates.filter((t) => !t.catalogKey)}
	/>
{/if}
