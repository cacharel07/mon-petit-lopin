<script lang="ts">
	import PhotoGrid from '#lib/components/PhotoGrid.svelte';
	import PhotoInput from '#lib/components/PhotoInput.svelte';
	import ProgressBar from '#lib/components/ProgressBar.svelte';
	import { formatDate, formatShortDate } from '#lib/domain/dates.ts';
	import {
		PHOTO_PHASES,
		PHOTO_PHASE_LABELS,
		PROJECT_PRIORITY_LABELS,
		PROJECT_STATUSES,
		PROJECT_STATUS_LABELS,
		TREE_STATUS_LABELS
	} from '#lib/domain/enums.ts';
	import { formatEuros } from '#lib/domain/projects.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const p = $derived(data.project);
	const year = $derived(Number(data.today.slice(0, 4)));
	const doneCount = $derived(data.tasks.filter((t) => t.done).length);
	const photosByPhase = $derived(
		[...PHOTO_PHASES, null].map((phase) => ({
			phase,
			photos: data.photos.filter((ph) => ph.phase === phase)
		}))
	);
	let uploading = $state(false);

	const confirmDelete = (e: MouseEvent) => {
		if (!confirm('Supprimer cette tâche ?')) e.preventDefault();
	};
</script>

<svelte:head><title>{p.title} · Travaux · Mon petit lopin</title></svelte:head>

<a class="back" href="/travaux">← Travaux</a>
<div class="page-header">
	<h1>{p.title}</h1>
	<a class="btn small" href="/travaux/{p.id}/modifier">Modifier</a>
</div>

<form method="POST" action="?/setStatus" class="statuses">
	{#each PROJECT_STATUSES as s (s)}
		<button class="btn small" class:primary={p.status === s} name="status" value={s} type="submit">
			{PROJECT_STATUS_LABELS[s]}
		</button>
	{/each}
</form>

<div class="progress">
	<ProgressBar value={data.progress} />
	<span class="muted">{data.progress} %</span>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<h2>
	Checklist {#if data.tasks.length}<span class="muted">({doneCount}/{data.tasks.length})</span>{/if}
</h2>
<ul class="list tasks">
	{#each data.tasks as t (t.id)}
		<li class="card task" class:done={t.done}>
			<form method="POST" action="?/toggleTask">
				<input type="hidden" name="taskId" value={t.id} />
				<button class="tick" type="submit" aria-label={t.done ? 'Décocher' : 'Cocher'}>
					{t.done ? '☑' : '☐'}
				</button>
			</form>
			<details>
				<summary>
					<span class="label">{t.label}</span>
					{#if t.dueDate && !t.done}
						<span
							class="small"
							class:status-overdue={t.dueDate < data.today}
							class:muted={t.dueDate >= data.today}
						>
							· {formatShortDate(t.dueDate, year)}
						</span>
					{/if}
				</summary>
				<form method="POST" action="?/updateTask" class="stack edit">
					<input type="hidden" name="taskId" value={t.id} />
					<label>Tâche <input name="label" value={t.label} required /></label>
					<label>Échéance <input type="date" name="dueDate" value={t.dueDate ?? ''} /></label>
					<div class="actions">
						<button class="btn small primary" type="submit">Enregistrer</button>
						<button
							class="btn small danger"
							type="submit"
							formaction="?/deleteTask"
							formnovalidate
							onclick={confirmDelete}>Supprimer</button
						>
					</div>
				</form>
			</details>
		</li>
	{:else}
		<li class="muted">Aucune tâche.</li>
	{/each}
</ul>
<form method="POST" action="?/addTask" class="add-task">
	<input name="label" placeholder="Nouvelle tâche" required aria-label="Nouvelle tâche" />
	<input type="date" name="dueDate" aria-label="Échéance (facultative)" />
	<button class="btn primary" type="submit">Ajouter</button>
</form>

<h2>Informations</h2>
<div class="card">
	<dl class="facts">
		<dt>Priorité</dt>
		<dd>{PROJECT_PRIORITY_LABELS[p.priority]}</dd>
		{#if data.zone}<dt>Zone</dt>
			<dd>{data.zone.name}</dd>{/if}
		{#if p.plannedStart || p.plannedEnd}
			<dt>Prévu</dt>
			<dd>{[formatDate(p.plannedStart), formatDate(p.plannedEnd)].filter(Boolean).join(' → ')}</dd>
		{/if}
		{#if p.actualStart || p.actualEnd}
			<dt>Réel</dt>
			<dd>{[formatDate(p.actualStart), formatDate(p.actualEnd)].filter(Boolean).join(' → ')}</dd>
		{/if}
		{#if p.budgetEstimatedCents != null}<dt>Budget</dt>
			<dd>{formatEuros(p.budgetEstimatedCents)}</dd>{/if}
		{#if p.budgetActualCents != null}<dt>Coût réel</dt>
			<dd>{formatEuros(p.budgetActualCents)}</dd>{/if}
	</dl>
	{#if p.description}<p class="notes">{p.description}</p>{/if}
	{#if p.notes}<h3>Notes</h3>
		<p class="notes">{p.notes}</p>{/if}
</div>

{#if data.trees.length}
	<h2>Arbres concernés</h2>
	<ul class="list">
		{#each data.trees as t (t.id)}
			<li>
				<a href="/arbres/{t.id}">{t.name}</a>
				<span class="muted small">· {TREE_STATUS_LABELS[t.status]}</span>
			</li>
		{/each}
	</ul>
{/if}

<h2>Photos ({data.photos.length})</h2>
{#each photosByPhase as group (group.phase)}
	{#if group.photos.length}
		<h3>{group.phase ? PHOTO_PHASE_LABELS[group.phase] : 'Autres'}</h3>
		<PhotoGrid photos={group.photos} />
	{/if}
{/each}
<form
	method="POST"
	action="?/addPhotos"
	enctype="multipart/form-data"
	class="card stack upload"
	onsubmit={() => (uploading = true)}
>
	{#if form && 'photosAdded' in form}<p class="muted">Photos ajoutées ✓</p>{/if}
	<label>
		Étape
		<select
			name="phase"
			value={p.status === 'planned' ? 'before' : p.status === 'done' ? 'after' : 'during'}
		>
			{#each PHOTO_PHASES as ph (ph)}
				<option value={ph}>{PHOTO_PHASE_LABELS[ph]}</option>
			{/each}
		</select>
	</label>
	<PhotoInput />
	<button class="btn" type="submit" disabled={uploading}>{uploading ? 'Envoi…' : 'Envoyer'}</button>
</form>

<style>
	.statuses {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
	}
	.progress {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		align-items: center;
		margin-top: 0.75rem;
	}
	.task {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
		padding: 0.4rem 0.6rem;
	}
	.task details {
		flex: 1;
		min-width: 0;
	}
	.task summary {
		cursor: pointer;
		list-style: none;
		min-height: 44px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	.task.done .label {
		text-decoration: line-through;
		color: var(--muted);
	}
	.tick {
		font-size: 1.5rem;
		line-height: 1;
		min-width: 44px;
		min-height: 44px;
		background: none;
		border: none;
		color: var(--primary);
		cursor: pointer;
	}
	.edit {
		margin: 0.5rem 0;
	}
	.add-task {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.add-task input[type='date'] {
		grid-row: 2;
	}
	.add-task button {
		grid-row: 1 / span 2;
		grid-column: 2;
	}
	.small {
		font-size: 0.875rem;
	}
	h3 {
		font-size: 1rem;
		margin: 1rem 0 0.4rem;
	}
	.upload {
		margin-top: 0.75rem;
	}
</style>
