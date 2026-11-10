<script lang="ts">
	import { CARE_RULE_TYPES, CARE_RULE_TYPE_LABELS } from '#lib/domain/enums.ts';
	import { MONTH_NAMES } from '#lib/domain/dates.ts';

	type Values = Record<string, string | number | boolean | null | undefined>;
	let { values = {} }: { values?: Values } = $props();

	const v = (name: string) => (values[name] == null ? '' : String(values[name]));
	const checked = (name: string) => values[name] === true || values[name] === 'on';
</script>

<label>
	Type
	<select name="type" value={v('type') || 'pruning_formation'}>
		{#each CARE_RULE_TYPES as type (type)}
			<option value={type}>{CARE_RULE_TYPE_LABELS[type]}</option>
		{/each}
	</select>
</label>

<label>
	Libellé
	<input name="label" value={v('label')} required placeholder="ex. Taille de formation" />
</label>

<fieldset>
	<legend>Période</legend>
	<div class="row">
		<span class="muted">Du</span>
		<input
			name="startDay"
			type="number"
			min="1"
			max="31"
			inputmode="numeric"
			value={v('startDay') || '1'}
			aria-label="Jour de début"
		/>
		<select name="startMonth" value={v('startMonth') || '3'} aria-label="Mois de début">
			{#each MONTH_NAMES as name, i (name)}
				<option value={String(i + 1)}>{name}</option>
			{/each}
		</select>
	</div>
	<div class="row">
		<span class="muted">au</span>
		<input
			name="endDay"
			type="number"
			min="1"
			max="31"
			inputmode="numeric"
			value={v('endDay') || '31'}
			aria-label="Jour de fin"
		/>
		<select name="endMonth" value={v('endMonth') || '3'} aria-label="Mois de fin">
			{#each MONTH_NAMES as name, i (name)}
				<option value={String(i + 1)}>{name}</option>
			{/each}
		</select>
	</div>
</fieldset>

<label>
	Répéter tous les … jours (vide = une fois dans la période)
	<input name="intervalDays" type="number" min="1" inputmode="numeric" value={v('intervalDays')} />
</label>

<div class="grid2">
	<label>
		À partir de (ans)
		<input name="minAgeYears" type="number" min="0" inputmode="numeric" value={v('minAgeYears')} />
	</label>
	<label>
		Avant (ans)
		<input name="maxAgeYears" type="number" min="1" inputmode="numeric" value={v('maxAgeYears')} />
	</label>
</div>
<p class="muted hint">
	Âge depuis la plantation. Ex. « avant 3 ans » = les trois premières années seulement.
</p>

<label>
	Notes
	<textarea name="notes" rows="3">{v('notes')}</textarea>
</label>

<label class="check">
	<input type="checkbox" name="verified" checked={checked('verified')} />
	Valeurs vérifiées
</label>

<style>
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	legend {
		font-size: 0.9rem;
		color: var(--muted);
		margin-bottom: 0.25rem;
	}
	.row {
		display: grid;
		grid-template-columns: 2rem 5rem 1fr;
		gap: 0.5rem;
		align-items: center;
	}
	.hint {
		font-size: 0.8rem;
		margin: -0.5rem 0 0;
	}
</style>
