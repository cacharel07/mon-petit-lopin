<script lang="ts">
	import TemplateForm from '#lib/components/TemplateForm.svelte';
	import { CARE_RULE_TYPE_LABELS } from '#lib/domain/enums.ts';
	import { formatAge, formatWindow } from '#lib/domain/dates.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const confirmDelete = (e: MouseEvent) => {
		if (
			!confirm(
				'Supprimer ce modèle et ses règles ? Les arbres concernés perdront les règles héritées.'
			)
		)
			e.preventDefault();
	};
</script>

<svelte:head><title>{data.template.commonName} · Modèles · Mon petit lopin</title></svelte:head>

<a class="back" href="/especes">← Modèles</a>
<h1>{data.template.commonName}</h1>

<h2>Calendrier d'entretien</h2>
<ul class="list">
	{#each data.rules as r (r.id)}
		<li class="card rule">
			<div class="head">
				<strong>{r.label}</strong>
				{#if !r.verified}<span class="badge warning">à vérifier</span>{/if}
			</div>
			<div class="muted small">
				{CARE_RULE_TYPE_LABELS[r.type]} · {formatWindow(r)}
				{#if r.intervalDays}· tous les {r.intervalDays} jours{/if}
				{#if r.minAgeYears != null}· dès {formatAge(r.minAgeYears)}{/if}
				{#if r.maxAgeYears != null}· avant {formatAge(r.maxAgeYears)}{/if}
			</div>
			{#if r.notes}<p class="notes small">{r.notes}</p>{/if}
			<div class="actions">
				<a class="btn small" href="/especes/{data.template.id}/regles/{r.id}">Modifier</a>
				{#if !r.verified}
					<form method="POST" action="?/verifyRule">
						<input type="hidden" name="ruleId" value={r.id} />
						<button class="btn small" type="submit">✓ Valider</button>
					</form>
				{/if}
			</div>
		</li>
	{:else}
		<li class="muted">Aucune règle.</li>
	{/each}
</ul>
<p>
	<a class="btn" href="/especes/{data.template.id}/regles/nouvelle">+ Ajouter une règle</a>
</p>

<h2>Informations</h2>
<form method="POST" action="?/update" class="card stack">
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	{#if form && 'saved' in form}<p class="muted">Enregistré ✓</p>{/if}
	<TemplateForm values={form?.values ?? data.template} />
	<div class="actions">
		<button class="btn primary" type="submit">Enregistrer</button>
		<button
			class="btn danger"
			type="submit"
			formaction="?/delete"
			formnovalidate
			onclick={confirmDelete}
		>
			Supprimer le modèle
		</button>
	</div>
</form>

<style>
	.rule {
		padding: 0.75rem;
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.small {
		font-size: 0.875rem;
	}
	p.notes {
		margin: 0.4rem 0;
	}
	.actions {
		margin-top: 0.5rem;
	}
</style>
