<script lang="ts">
	import CareCalendar from '#lib/components/CareCalendar.svelte';
	import PhotoGrid from '#lib/components/PhotoGrid.svelte';
	import PhotoInput from '#lib/components/PhotoInput.svelte';
	import { formatAge, formatDate } from '#lib/domain/dates.ts';
	import {
		INTERVENTION_TYPES,
		INTERVENTION_TYPE_LABELS,
		PROJECT_STATUS_LABELS,
		TREE_STATUS_LABELS
	} from '#lib/domain/enums.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const t = $derived(data.tree);
	const cover = $derived(data.photos[0] ?? null);
	const activeRules = $derived(data.rules.filter((r) => !r.hidden).map((r) => r.rule));
	const sourceLabels = $derived(
		new Map(
			data.rules
				.filter((r) => r.source !== 'template')
				.map((r) => [r.rule.id, r.source === 'override' ? 'personnalisée' : 'propre à l’arbre'])
		)
	);
	const fullName = $derived([t.commonName, t.variety].filter(Boolean).join(' '));
	const subtitle = $derived(
		[
			t.nickname ? fullName : null,
			data.ageYears != null
				? `planté il y a ${formatAge(data.ageYears)}`
				: TREE_STATUS_LABELS[t.status],
			data.zone?.name
		]
			.filter(Boolean)
			.join(' · ')
	);
	let submitting = $state(false);
</script>

<svelte:head><title>{t.name} · Mon petit lopin</title></svelte:head>

<a class="back" href="/arbres">← Arbres</a>
<div class="page-header">
	<h1>{t.name}</h1>
	<a class="btn small" href="/arbres/{t.id}/modifier">Modifier</a>
</div>
<p class="muted subtitle">{subtitle}</p>

{#if cover}
	<a href="/photos/{cover.fileName}" target="_blank" rel="noopener">
		<img class="cover" src="/photos/{cover.fileName}" alt={t.name} />
	</a>
{/if}

{#if t.status === 'purchased'}
	<form method="POST" action="?/markPlanted" class="card stack planted">
		<strong>🌱 Pas encore planté</strong>
		<label>Date de plantation <input type="date" name="date" value={data.today} /></label>
		<label>Notes <input name="notes" placeholder="emplacement, amendement…" /></label>
		<button class="btn primary" type="submit">Marquer comme planté</button>
	</form>
{/if}

<h2>Ajouter au journal</h2>
<form
	method="POST"
	action="?/addIntervention"
	enctype="multipart/form-data"
	class="card stack"
	onsubmit={() => (submitting = true)}
>
	{#if form?.error}<p class="error">{form.error}</p>{/if}
	{#if form && 'added' in form && form.added === 'intervention'}<p class="muted">
			Ajouté au journal ✓
		</p>{/if}
	<div class="grid2">
		<label>Date <input type="date" name="date" value={data.today} required /></label>
		<label>
			Type
			<select name="type">
				{#each INTERVENTION_TYPES as type (type)}
					<option value={type}>{INTERVENTION_TYPE_LABELS[type]}</option>
				{/each}
			</select>
		</label>
	</div>
	<label>Notes <textarea name="notes" rows="2"></textarea></label>
	<PhotoInput />
	<button class="btn primary" type="submit" disabled={submitting}>
		{submitting ? 'Envoi…' : 'Ajouter'}
	</button>
</form>

<h2>Journal</h2>
<ul class="list">
	{#each data.interventions as i (i.id)}
		<li class="card entry">
			<div class="entry-head">
				<span><strong>{INTERVENTION_TYPE_LABELS[i.type]}</strong> · {formatDate(i.date)}</span>
				<a class="btn link" href="/arbres/{t.id}/journal/{i.id}">Modifier</a>
			</div>
			{#if i.notes}<p class="notes">{i.notes}</p>{/if}
			<PhotoGrid photos={i.photos} deleteAction={null} showDates={false} />
		</li>
	{:else}
		<li class="muted">Aucune intervention enregistrée.</li>
	{/each}
</ul>

<div class="page-header">
	<h2>Calendrier d'entretien</h2>
	<a class="btn link" href="/arbres/{t.id}/entretien">Personnaliser</a>
</div>
{#if data.template}
	<p class="muted small">Hérité du modèle « {data.template.commonName} ».</p>
{/if}
{#if t.status !== 'planted'}
	<p class="muted small">Les échéances commenceront une fois l'arbre planté.</p>
{/if}
<CareCalendar rules={activeRules} {sourceLabels} statuses={data.statuses} treeId={t.id} />

<h2>Fiche</h2>
<div class="card">
	<dl class="facts">
		{#if t.species}<dt>Espèce</dt>
			<dd><em>{t.species}</em></dd>{/if}
		{#if t.variety}<dt>Variété</dt>
			<dd>{t.variety}</dd>{/if}
		{#if t.rootstock}<dt>Porte-greffe</dt>
			<dd>{t.rootstock}</dd>{/if}
		{#if t.purchaseDate}<dt>Achat</dt>
			<dd>{formatDate(t.purchaseDate)}</dd>{/if}
		{#if t.nursery}<dt>Pépinière</dt>
			<dd>{t.nursery}</dd>{/if}
		{#if t.plantingDate}<dt>Plantation</dt>
			<dd>{formatDate(t.plantingDate)}</dd>{/if}
		{#if t.recommendedSpacingM}<dt>Distance</dt>
			<dd>{t.recommendedSpacingM} m</dd>{/if}
		<dt>Pollinisateur</dt>
		<dd>
			{#if t.pollinatorRequired}
				nécessaire
				{#if data.pollinators.length}
					· {#each data.pollinators as p, i (p.id)}{i ? ', ' : ''}<a href="/arbres/{p.id}"
							>{p.name}</a
						>{/each}
				{/if}
			{:else}
				non nécessaire
			{/if}
		</dd>
		{#if t.pollinationNotes}<dt>Compatibles</dt>
			<dd class="notes">{t.pollinationNotes}</dd>{/if}
	</dl>
	{#if data.template?.notes}
		<details class="species-notes">
			<summary>Conseils pour l'espèce ({data.template.commonName})</summary>
			<p class="notes">{data.template.notes}</p>
		</details>
	{/if}
	{#if t.nurseryAdvice}
		<h3>Conseils de la pépinière</h3>
		<p class="notes">{t.nurseryAdvice}</p>
	{/if}
	{#if t.notes}
		<h3>Notes</h3>
		<p class="notes">{t.notes}</p>
	{/if}
</div>

{#if data.projects.length}
	<h2>Travaux liés</h2>
	<ul class="list">
		{#each data.projects as p (p.id)}
			<li>
				<a href="/travaux/{p.id}">{p.title}</a>
				<span class="muted small">· {PROJECT_STATUS_LABELS[p.status]}</span>
			</li>
		{/each}
	</ul>
{/if}

<h2>Photos ({data.photos.length})</h2>
<PhotoGrid photos={data.photos} />
<form method="POST" action="?/addPhotos" enctype="multipart/form-data" class="card stack upload">
	{#if form && 'added' in form && form.added === 'photos'}<p class="muted">
			Photos ajoutées ✓
		</p>{/if}
	<PhotoInput label="Ajouter des photos de suivi" />
	<button class="btn" type="submit">Envoyer</button>
</form>

<style>
	.subtitle {
		margin-top: 0;
	}
	.cover {
		width: 100%;
		max-height: 60vh;
		object-fit: cover;
		border-radius: var(--radius);
		display: block;
	}
	.planted {
		margin-top: 1rem;
		border-color: var(--warning);
	}
	.entry {
		padding: 0.75rem;
	}
	.entry-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.entry .notes {
		margin: 0.25rem 0 0.5rem;
	}
	.small {
		font-size: 0.875rem;
	}
	h3 {
		font-size: 1rem;
		margin: 1rem 0 0.25rem;
	}
	.species-notes {
		margin-top: 1rem;
	}
	.species-notes summary {
		cursor: pointer;
		color: var(--primary);
		min-height: 44px;
		display: flex;
		align-items: center;
	}
	.upload {
		margin-top: 0.75rem;
	}
</style>
