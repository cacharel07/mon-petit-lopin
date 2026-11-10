<script lang="ts">
	import { TREE_STATUSES, TREE_STATUS_LABELS } from '#lib/domain/enums.ts';

	type Values = Record<string, string | number | boolean | null | undefined>;

	interface Props {
		values?: Values;
		zones: { id: number; name: string }[];
		templates: {
			id: number;
			commonName: string;
			latinName: string | null;
			needsPollinator: boolean;
			defaultSpacingM: number | null;
		}[];
		otherTrees: { id: number; name: string }[];
		pollinatorIds?: number[];
	}

	let { values = {}, zones, templates, otherTrees, pollinatorIds = [] }: Props = $props();

	const v = (name: string) => (values[name] == null ? '' : String(values[name]));

	// Prefill names from the chosen species template when they are still empty.
	// svelte-ignore state_referenced_locally
	let commonName = $state(v('commonName'));
	// svelte-ignore state_referenced_locally
	let species = $state(v('species'));
	// svelte-ignore state_referenced_locally
	let pollinatorRequired = $state(
		values.pollinatorRequired === true || values.pollinatorRequired === 'on'
	);

	function onTemplateChange(e: Event) {
		const id = Number((e.currentTarget as HTMLSelectElement).value);
		const t = templates.find((t) => t.id === id);
		if (!t) return;
		if (!commonName) commonName = t.commonName;
		if (!species && t.latinName) species = t.latinName;
		if (t.needsPollinator) pollinatorRequired = true;
	}
</script>

<label>
	Modèle d'espèce
	<select name="speciesTemplateId" value={v('speciesTemplateId')} onchange={onTemplateChange}>
		<option value="">— Aucun —</option>
		{#each templates as t (t.id)}
			<option value={String(t.id)}>{t.commonName}</option>
		{/each}
	</select>
</label>

<label>
	Nom commun
	<input name="commonName" bind:value={commonName} required placeholder="ex. Pommier" />
</label>

<div class="grid2">
	<label>
		Espèce
		<input name="species" bind:value={species} placeholder="ex. Malus domestica" />
	</label>
	<label>
		Variété
		<input name="variety" value={v('variety')} placeholder="ex. Reinette" />
	</label>
</div>

<label>
	Nom perso
	<input name="nickname" value={v('nickname')} placeholder="ex. Le vieux pommier" />
</label>

<div class="grid2">
	<label>
		Statut
		<select name="status" value={v('status') || 'planted'}>
			{#each TREE_STATUSES as s (s)}
				<option value={s}>{TREE_STATUS_LABELS[s]}</option>
			{/each}
		</select>
	</label>
	<label>
		Zone
		<select name="zoneId" value={v('zoneId')}>
			<option value="">— Aucune —</option>
			{#each zones as z (z.id)}
				<option value={String(z.id)}>{z.name}</option>
			{/each}
		</select>
	</label>
</div>

<div class="grid2">
	<label>
		Date d'achat
		<input name="purchaseDate" type="date" value={v('purchaseDate')} />
	</label>
	<label>
		Date de plantation
		<input name="plantingDate" type="date" value={v('plantingDate')} />
	</label>
</div>

<label>
	Lieu d'achat (pépinière)
	<input name="nursery" value={v('nursery')} />
</label>

<div class="grid2">
	<label>
		Porte-greffe
		<input name="rootstock" value={v('rootstock')} placeholder="ex. MM106" />
	</label>
	<label>
		Distance conseillée (m)
		<input
			name="recommendedSpacingM"
			inputmode="decimal"
			value={v('recommendedSpacingM')}
			placeholder="ex. 6"
		/>
	</label>
</div>

<label class="check">
	<input type="checkbox" name="pollinatorRequired" bind:checked={pollinatorRequired} />
	Pollinisateur nécessaire
</label>

{#if otherTrees.length}
	<fieldset>
		<legend>Pollinisé par (arbres du terrain)</legend>
		{#each otherTrees as t (t.id)}
			<label class="check">
				<input
					type="checkbox"
					name="pollinatorIds"
					value={t.id}
					checked={pollinatorIds.includes(t.id)}
				/>
				{t.name}
			</label>
		{/each}
	</fieldset>
{/if}

<label>
	Pollinisateurs compatibles (notes)
	<textarea name="pollinationNotes" rows="2">{v('pollinationNotes')}</textarea>
</label>

<label>
	Conseils de la pépinière
	<textarea name="nurseryAdvice" rows="3">{v('nurseryAdvice')}</textarea>
</label>

<label>
	Notes
	<textarea name="notes" rows="3">{v('notes')}</textarea>
</label>

<style>
	fieldset {
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		margin: 0;
	}
	legend {
		font-size: 0.9rem;
		color: var(--muted);
		padding: 0 0.25rem;
	}
</style>
