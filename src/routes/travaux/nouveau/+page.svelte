<script lang="ts">
	import ProjectForm from '#lib/components/ProjectForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Nouveau projet · Mon petit lopin</title></svelte:head>

<a class="back" href="/travaux">← Travaux</a>
<h1>Nouveau projet</h1>

<form method="POST" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<ProjectForm values={form?.values} zones={data.zones} trees={data.trees} />
	<button class="btn primary" type="submit">Créer</button>
</form>
