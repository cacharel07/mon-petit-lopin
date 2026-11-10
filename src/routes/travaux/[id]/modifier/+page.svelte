<script lang="ts">
	import ProjectForm from '#lib/components/ProjectForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const confirmDelete = (e: MouseEvent) => {
		if (!confirm('Supprimer définitivement ce projet, sa checklist et ses photos ?'))
			e.preventDefault();
	};
</script>

<svelte:head><title>Modifier · {data.project.title} · Mon petit lopin</title></svelte:head>

<a class="back" href="/travaux/{data.project.id}">← {data.project.title}</a>
<h1>Modifier le projet</h1>

<form method="POST" action="?/save" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<ProjectForm
		values={form?.values ?? data.project}
		zones={data.zones}
		trees={data.trees}
		treeIds={data.treeIds}
	/>
	<button class="btn primary" type="submit">Enregistrer</button>
	<hr />
	<button
		class="btn danger"
		type="submit"
		formaction="?/delete"
		formnovalidate
		onclick={confirmDelete}
	>
		Supprimer le projet
	</button>
</form>

<style>
	hr {
		border: none;
		border-top: 1px solid var(--border);
		width: 100%;
	}
</style>
