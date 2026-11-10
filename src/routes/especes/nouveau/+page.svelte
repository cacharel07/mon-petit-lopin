<script lang="ts">
	import TemplateForm from '#lib/components/TemplateForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head><title>Nouveau modèle · Mon petit lopin</title></svelte:head>

<a class="back" href="/especes">← Modèles</a>
<h1>Nouveau modèle d'espèce</h1>

<form method="POST" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<TemplateForm values={form?.values} />
	<button class="btn primary" type="submit">Créer</button>
</form>
