<script lang="ts">
	import { TREE_STATUSES, TREE_STATUS_LABELS } from '#lib/domain/enums.ts';
	import type { CatalogOption } from '#lib/server/catalog-view.ts';

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
			catalogKey: string | null;
		}[];
		/** Built-in catalogue; entries without template are offered as `catalog:<key>`. */
		catalog: CatalogOption[];
		otherTrees: { id: number; name: string }[];
		pollinatorIds?: number[];
	}

	let { values = {}, zones, templates, catalog, otherTrees, pollinatorIds = [] }: Props = $props();

	const v = (name: string) => (values[name] == null ? '' : String(values[name]));

	// Form state initialised once from the values (edit, error or catalogue prefill).
	// svelte-ignore state_referenced_locally
	let templateRef = $state(v('speciesTemplateId'));
	// svelte-ignore state_referenced_locally
	let commonName = $state(v('commonName'));
	// svelte-ignore state_referenced_locally
	let species = $state(v('species'));
	// svelte-ignore state_referenced_locally
	let variety = $state(v('variety'));
	// svelte-ignore state_referenced_locally
	let spacing = $state(v('recommendedSpacingM'));
	// svelte-ignore state_referenced_locally
	let pollinationNotes = $state(v('pollinationNotes'));
	// svelte-ignore state_referenced_locally
	let pollinatorRequired = $state(
		values.pollinatorRequired === true || values.pollinatorRequired === 'on'
	);

	const linkedKeys = $derived(new Set(templates.map((t) => t.catalogKey).filter(Boolean)));
	const pendingCatalog = $derived(catalog.filter((e) => !linkedKeys.has(e.key)));

	/** Catalogue entry behind the selected template, if any. */
	const entry = $derived.by(() => {
		const key = templateRef.startsWith('catalog:')
			? templateRef.slice('catalog:'.length)
			: templates.find((t) => String(t.id) === templateRef)?.catalogKey;
		return catalog.find((e) => e.key === key) ?? null;
	});
	const varietyNote = $derived(entry?.varieties.find((x) => x.name === variety)?.notes ?? null);

	function onTemplateChange() {
		const t = templates.find((t) => String(t.id) === templateRef);
		const source = t
			? {
					name: t.commonName,
					latin: t.latinName,
					pollinator: t.needsPollinator,
					spacing: t.defaultSpacingM
				}
			: entry
				? {
						name: entry.commonName,
						latin: entry.latinName,
						pollinator: entry.needsPollinator,
						spacing: entry.defaultSpacingM
					}
				: null;
		if (!source) return;
		if (!commonName) commonName = source.name;
		if (!species && source.latin) species = source.latin;
		if (!spacing && source.spacing) spacing = String(source.spacing);
		if (source.pollinator) pollinatorRequired = true;
	}

	function onVarietyChange() {
		if (varietyNote && !pollinationNotes) pollinationNotes = varietyNote;
	}
</script>

<label>
	Espèce
	<select name="speciesTemplateId" bind:value={templateRef} onchange={onTemplateChange}>
		<option value="">— Aucun modèle —</option>
		{#if templates.length}
			<optgroup label="Mes modèles">
				{#each templates as t (t.id)}
					<option value={String(t.id)}>{t.commonName}</option>
				{/each}
			</optgroup>
		{/if}
		{#if pendingCatalog.length}
			<optgroup label="Catalogue">
				{#each pendingCatalog as e (e.key)}
					<option value="catalog:{e.key}">{e.commonName}</option>
				{/each}
			</optgroup>
		{/if}
	</select>
</label>

{#if entry?.altitudeWarning}
	<p class="altitude">⚠️ {entry.altitudeWarning}</p>
{/if}

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
		<input
			name="variety"
			bind:value={variety}
			onchange={onVarietyChange}
			list="variety-options"
			placeholder="ex. Reinette"
			autocomplete="off"
		/>
	</label>
</div>

{#if entry?.varieties.length}
	<datalist id="variety-options">
		{#each entry.varieties as x (x.name)}<option value={x.name}>{x.notes}</option>{/each}
	</datalist>
{/if}
{#if varietyNote}<p class="muted hint">{varietyNote}</p>{/if}

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
		<input
			name="rootstock"
			value={v('rootstock')}
			list="rootstock-options"
			placeholder="ex. MM106"
			autocomplete="off"
		/>
	</label>
	<label>
		Distance conseillée (m)
		<input
			name="recommendedSpacingM"
			inputmode="decimal"
			bind:value={spacing}
			placeholder="ex. 6"
		/>
	</label>
</div>
{#if entry?.rootstocks.length}
	<datalist id="rootstock-options">
		{#each entry.rootstocks as r (r)}<option value={r}></option>{/each}
	</datalist>
{/if}

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
	<textarea name="pollinationNotes" rows="2" bind:value={pollinationNotes}></textarea>
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
	.altitude {
		margin: 0;
		padding: 0.6rem 0.75rem;
		border-radius: 8px;
		border: 1px solid var(--warning);
		font-size: 0.9rem;
	}
	.hint {
		margin: -0.5rem 0 0;
		font-size: 0.85rem;
	}
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
