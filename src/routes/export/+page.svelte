<script lang="ts">
	const TABLES = [
		['tree', 'Arbres'],
		['intervention', 'Journal des interventions'],
		['care_rule', "Règles d'entretien"],
		['species_template', "Modèles d'espèces"],
		['project', 'Projets de travaux'],
		['project_task', 'Tâches des projets'],
		['zone', 'Zones'],
		['photo', 'Photos (métadonnées)'],
		['tree_pollinator', 'Liens de pollinisation'],
		['project_tree', 'Liens projets – arbres']
	];
</script>

<svelte:head><title>Export · Mon petit lopin</title></svelte:head>

<a class="back" href="/plus">← Plus</a>
<h1>Exporter mes données</h1>
<p class="muted">Pour sauvegarder ou quitter l'application à tout moment.</p>

<ul class="list">
	<li>
		<a class="card item" href="/export/lopin.zip" download>
			<strong>📦 Archive complète (ZIP)</strong>
			<span class="muted small">Toutes les données (JSON + CSV) et toutes les photos.</span>
		</a>
	</li>
	<li>
		<a class="card item" href="/export/lopin.json" download>
			<strong>🗂️ Données (JSON)</strong>
			<span class="muted small">Toutes les tables, sans les photos.</span>
		</a>
	</li>
</ul>

<h2>Tableaux (CSV)</h2>
<ul class="list">
	{#each TABLES as [table, label] (table)}
		<li><a href="/export/csv/{table}" download>{label}</a></li>
	{/each}
</ul>

<style>
	.item {
		display: flex;
		flex-direction: column;
		color: var(--text);
		text-decoration: none;
	}
	.small {
		font-size: 0.875rem;
	}
</style>
