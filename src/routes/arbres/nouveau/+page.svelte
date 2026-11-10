<script lang="ts">
	import TreeForm from '#lib/components/TreeForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Nouvel arbre · Mon petit lopin</title></svelte:head>

<a class="back" href="/arbres">← Arbres</a>
<h1>Nouvel arbre</h1>

<form method="POST" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<TreeForm
		values={form?.values}
		zones={data.zones}
		templates={data.templates}
		otherTrees={data.otherTrees}
	/>
	<button class="btn primary" type="submit">Créer la fiche</button>
</form>
