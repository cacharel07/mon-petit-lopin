<script lang="ts">
	import PhotoGrid from '#lib/components/PhotoGrid.svelte';
	import PhotoInput from '#lib/components/PhotoInput.svelte';
	import { INTERVENTION_TYPES, INTERVENTION_TYPE_LABELS } from '#lib/domain/enums.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const values = $derived(form?.values ?? data.entry);

	const confirmDelete = (e: MouseEvent) => {
		if (!confirm('Supprimer cette intervention et ses photos ?')) e.preventDefault();
	};
</script>

<svelte:head><title>Journal · {data.tree.name} · Mon petit lopin</title></svelte:head>

<a class="back" href="/arbres/{data.tree.id}">← {data.tree.name}</a>
<h1>Modifier l'intervention</h1>

<form method="POST" action="?/save" enctype="multipart/form-data" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<div class="grid2">
		<label>Date <input type="date" name="date" value={values.date} required /></label>
		<label>
			Type
			<select name="type" value={values.type}>
				{#each INTERVENTION_TYPES as type (type)}
					<option value={type}>{INTERVENTION_TYPE_LABELS[type]}</option>
				{/each}
			</select>
		</label>
	</div>
	<label>Notes <textarea name="notes" rows="4">{values.notes ?? ''}</textarea></label>
	<PhotoInput label="Ajouter des photos" />
	<div class="actions">
		<button class="btn primary" type="submit">Enregistrer</button>
		<button
			class="btn danger"
			type="submit"
			formaction="?/delete"
			formnovalidate
			onclick={confirmDelete}
		>
			Supprimer
		</button>
	</div>
</form>

{#if data.photos.length}
	<h2>Photos</h2>
	<PhotoGrid photos={data.photos} />
{/if}
