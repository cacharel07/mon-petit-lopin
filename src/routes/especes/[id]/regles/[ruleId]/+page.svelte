<script lang="ts">
	import RuleForm from '#lib/components/RuleForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const confirmDelete = (e: MouseEvent) => {
		if (
			!confirm('Supprimer cette règle du modèle ? Elle disparaîtra de tous les arbres concernés.')
		)
			e.preventDefault();
	};
</script>

<svelte:head><title>Règle · {data.template.commonName} · Mon petit lopin</title></svelte:head>

<a class="back" href="/especes/{data.template.id}">← {data.template.commonName}</a>
<h1>{data.rule ? 'Modifier la règle' : 'Nouvelle règle'}</h1>
<p class="muted">
	Modèle « {data.template.commonName} » : s'applique à tous les arbres de ce modèle qui ne l'ont pas personnalisée.
</p>

<form method="POST" action="?/save" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<RuleForm values={form?.values ?? data.rule ?? {}} />
	<div class="actions">
		<button class="btn primary" type="submit">Enregistrer</button>
		{#if data.rule}
			<button
				class="btn danger"
				type="submit"
				formaction="?/delete"
				formnovalidate
				onclick={confirmDelete}
			>
				Supprimer
			</button>
		{/if}
	</div>
</form>
