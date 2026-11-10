<script lang="ts">
	import RuleForm from '#lib/components/RuleForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const isOverride = $derived(data.templateRule != null);
	const title = $derived(
		data.rule ? 'Modifier la règle' : isOverride ? 'Personnaliser la règle' : 'Nouvelle règle'
	);

	const confirmDelete = (e: MouseEvent) => {
		const msg = isOverride
			? 'Supprimer la personnalisation et revenir à la règle du modèle ?'
			: 'Supprimer cette règle ?';
		if (!confirm(msg)) e.preventDefault();
	};
</script>

<svelte:head><title>{title} · {data.tree.name} · Mon petit lopin</title></svelte:head>

<a class="back" href="/arbres/{data.tree.id}/entretien">← Calendrier de {data.tree.name}</a>
<h1>{title}</h1>
{#if isOverride}
	<p class="muted">
		Ces valeurs remplacent la règle « {data.templateRule?.label} » du modèle, pour {data.tree.name}
		seulement.
	</p>
{/if}

<!-- Keep ?remplace= in the action URL: a bare "?/save" would drop it. -->
<form
	method="POST"
	action={!data.rule && data.templateRule ? `?/save&remplace=${data.templateRule.id}` : '?/save'}
	class="card stack"
>
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	<RuleForm values={form?.values ?? data.rule ?? data.templateRule ?? {}} />
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
				{isOverride ? 'Revenir au modèle' : 'Supprimer'}
			</button>
		{/if}
	</div>
</form>
