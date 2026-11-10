<script lang="ts">
	import TreeForm from '#lib/components/TreeForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const confirmDelete = (e: MouseEvent) => {
		if (!confirm('Supprimer définitivement cette fiche, son journal et ses photos ?'))
			e.preventDefault();
	};
</script>

<svelte:head><title>Modifier · Mon petit lopin</title></svelte:head>

<a class="back" href="/arbres/{data.tree.id}">← Retour à la fiche</a>
<h1>Modifier la fiche</h1>

<form method="POST" action="?/save" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<TreeForm
		values={form?.values ?? data.tree}
		zones={data.zones}
		templates={data.templates}
		otherTrees={data.otherTrees}
		pollinatorIds={data.pollinatorIds}
	/>
	<p class="muted small">
		Changer de modèle d'espèce supprime les personnalisations des règles héritées (les règles
		propres à l'arbre sont conservées).
	</p>
	<div class="actions">
		<button class="btn primary" type="submit">Enregistrer</button>
	</div>
	<hr />
	<button
		class="btn danger"
		type="submit"
		formaction="?/delete"
		formnovalidate
		onclick={confirmDelete}
	>
		Supprimer l'arbre
	</button>
</form>

<style>
	.small {
		font-size: 0.85rem;
		margin: 0;
	}
	hr {
		border: none;
		border-top: 1px solid var(--border);
		width: 100%;
	}
</style>
