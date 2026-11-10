<script lang="ts">
	import DueRow from '#lib/components/DueRow.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import { formatDate } from '#lib/domain/dates.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const g = $derived(data.groups);
	const nothing = $derived(!g.overdue.length && !g.thisWeek.length && !g.thisMonth.length);
</script>

<svelte:head><title>Mon petit lopin</title></svelte:head>

<h1>Tableau de bord</h1>
<p class="muted today">{formatDate(data.today)}</p>

{#if data.toPlant || data.unverified}
	<div class="hints">
		{#if data.toPlant}
			<a class="card hint" href="/arbres"
				>🌱 {data.toPlant} arbre{data.toPlant > 1 ? 's' : ''} à planter</a
			>
		{/if}
		{#if data.unverified}
			<a class="card hint" href="/especes"
				>📖 {data.unverified} règle{data.unverified > 1 ? 's' : ''} d'entretien à vérifier</a
			>
		{/if}
	</div>
{/if}

{#if g.overdue.length}
	<section>
		<h2 class="status-overdue">En retard ({g.overdue.length})</h2>
		<ul class="list overdue">
			{#each g.overdue as item (item.key)}<DueRow {item} today={data.today} />{/each}
		</ul>
	</section>
{/if}

<section>
	<h2>Cette semaine</h2>
	<ul class="list">
		{#each g.thisWeek as item (item.key)}
			<DueRow {item} today={data.today} />
		{:else}
			<li class="muted">Rien à faire cette semaine.</li>
		{/each}
	</ul>
</section>

<section>
	<h2>Ce mois-ci</h2>
	<ul class="list">
		{#each g.thisMonth as item (item.key)}
			<DueRow {item} today={data.today} />
		{:else}
			<li class="muted">Rien d'autre ce mois-ci.</li>
		{/each}
	</ul>
</section>

{#if nothing}
	<p class="muted">Tout est à jour 🌤️</p>
{/if}

<section>
	<h2>Travaux en cours</h2>
	<ul class="list">
		{#each data.inProgress as project (project.id)}
			<li><ProjectCard {project} today={data.today} /></li>
		{:else}
			<li class="muted">Aucun projet en cours. <a href="/travaux">Voir les travaux</a></li>
		{/each}
	</ul>
</section>

<style>
	.today {
		margin-top: -0.75rem;
	}
	.hints {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.hint {
		padding: 0.6rem 0.75rem;
		color: var(--text);
		text-decoration: none;
	}
	.overdue :global(.card) {
		border-left: 4px solid var(--danger);
	}
</style>
