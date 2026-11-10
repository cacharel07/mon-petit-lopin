<script lang="ts">
	import { SPECIES_CATEGORIES, SPECIES_CATEGORY_LABELS } from '#lib/domain/enums.ts';

	type Values = Record<string, string | number | boolean | null | undefined>;
	let { values = {} }: { values?: Values } = $props();
	const v = (name: string) => (values[name] == null ? '' : String(values[name]));
</script>

<label>Nom commun <input name="commonName" value={v('commonName')} required /></label>
<label>Nom latin <input name="latinName" value={v('latinName')} /></label>
<div class="grid2">
	<label>
		Catégorie
		<select name="category" value={v('category') || 'fruit_tree'}>
			{#each SPECIES_CATEGORIES as c (c)}
				<option value={c}>{SPECIES_CATEGORY_LABELS[c]}</option>
			{/each}
		</select>
	</label>
	<label>
		Espacement (m)
		<input name="defaultSpacingM" inputmode="decimal" value={v('defaultSpacingM')} />
	</label>
</div>
<label class="check">
	<input
		type="checkbox"
		name="needsPollinator"
		checked={values.needsPollinator === true || values.needsPollinator === 'on'}
	/>
	Pollinisateur nécessaire
</label>
<label>Notes <textarea name="notes" rows="4">{v('notes')}</textarea></label>
