<script lang="ts">
	import {
		PROJECT_PRIORITIES,
		PROJECT_PRIORITY_LABELS,
		PROJECT_STATUSES,
		PROJECT_STATUS_LABELS
	} from '#lib/domain/enums.ts';
	import { centsToInput } from '#lib/domain/projects.ts';

	type Values = Record<string, string | number | boolean | null | undefined>;
	interface Props {
		values?: Values;
		zones: { id: number; name: string }[];
		trees: { id: number; name: string }[];
		treeIds?: number[];
	}
	let { values = {}, zones, trees, treeIds = [] }: Props = $props();

	const v = (name: string) => (values[name] == null ? '' : String(values[name]));
	// Amounts come either as cents (from the DB) or as typed text (after an error).
	const money = (typed: string, cents: string) =>
		values[typed] != null ? String(values[typed]) : centsToInput(values[cents] as number | null);
</script>

<label>Titre <input name="title" value={v('title')} required /></label>
<label>Description <textarea name="description" rows="3">{v('description')}</textarea></label>

<div class="grid2">
	<label>
		Statut
		<select name="status" value={v('status') || 'planned'}>
			{#each PROJECT_STATUSES as s (s)}
				<option value={s}>{PROJECT_STATUS_LABELS[s]}</option>
			{/each}
		</select>
	</label>
	<label>
		Priorité
		<select name="priority" value={v('priority') || 'medium'}>
			{#each PROJECT_PRIORITIES as p (p)}
				<option value={p}>{PROJECT_PRIORITY_LABELS[p]}</option>
			{/each}
		</select>
	</label>
</div>

<label>
	Zone
	<select name="zoneId" value={v('zoneId')}>
		<option value="">— Aucune —</option>
		{#each zones as z (z.id)}
			<option value={String(z.id)}>{z.name}</option>
		{/each}
	</select>
</label>

<div class="grid2">
	<label>Début prévu <input type="date" name="plannedStart" value={v('plannedStart')} /></label>
	<label>Fin prévue <input type="date" name="plannedEnd" value={v('plannedEnd')} /></label>
	<label>Début réel <input type="date" name="actualStart" value={v('actualStart')} /></label>
	<label>Fin réelle <input type="date" name="actualEnd" value={v('actualEnd')} /></label>
</div>

<div class="grid2">
	<label>
		Budget estimé (€)
		<input
			name="budgetEstimated"
			inputmode="decimal"
			value={money('budgetEstimated', 'budgetEstimatedCents')}
		/>
	</label>
	<label>
		Coût réel (€)
		<input
			name="budgetActual"
			inputmode="decimal"
			value={money('budgetActual', 'budgetActualCents')}
		/>
	</label>
</div>

{#if trees.length}
	<details open={treeIds.length > 0}>
		<summary class="muted">Arbres concernés ({treeIds.length})</summary>
		{#each trees as t (t.id)}
			<label class="check">
				<input type="checkbox" name="treeIds" value={t.id} checked={treeIds.includes(t.id)} />
				{t.name}
			</label>
		{/each}
	</details>
{/if}

<label>Notes <textarea name="notes" rows="3">{v('notes')}</textarea></label>

<style>
	summary {
		cursor: pointer;
		min-height: 44px;
		display: flex;
		align-items: center;
	}
</style>
