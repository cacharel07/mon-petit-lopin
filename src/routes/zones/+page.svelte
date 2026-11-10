<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const confirmDelete = (e: MouseEvent) => {
		if (
			!confirm('Supprimer cette zone ? Les arbres et travaux associés seront conservés, sans zone.')
		)
			e.preventDefault();
	};
</script>

<svelte:head><title>Zones · Mon petit lopin</title></svelte:head>

<a class="back" href="/plus">← Plus</a>
<h1>Zones du terrain</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<ul class="list">
	{#each data.zones as z (z.id)}
		<li class="card">
			<details>
				<summary>
					<strong>{z.name}</strong>
					<span class="muted small">
						· {z.trees} arbre{z.trees > 1 ? 's' : ''} · {z.projects} projet{z.projects > 1
							? 's'
							: ''}
					</span>
					{#if z.description}<div class="muted small">{z.description}</div>{/if}
				</summary>
				<form method="POST" action="?/update" class="stack edit">
					<input type="hidden" name="id" value={z.id} />
					<label>Nom <input name="name" value={z.name} required /></label>
					<label>Description <input name="description" value={z.description ?? ''} /></label>
					<div class="actions">
						<button class="btn primary" type="submit">Enregistrer</button>
						<button class="btn danger" type="submit" formaction="?/delete" onclick={confirmDelete}
							>Supprimer</button
						>
					</div>
				</form>
			</details>
		</li>
	{:else}
		<li class="muted">Aucune zone pour l'instant.</li>
	{/each}
</ul>

<h2>Ajouter une zone</h2>
<form method="POST" action="?/create" class="card stack">
	<label>Nom <input name="name" required placeholder="ex. Potager" /></label>
	<label>Description <input name="description" /></label>
	<button class="btn primary" type="submit">Ajouter</button>
</form>

<style>
	summary {
		cursor: pointer;
		list-style: none;
	}
	.small {
		font-size: 0.875rem;
	}
	.edit {
		margin-top: 0.75rem;
	}
</style>
