<script lang="ts">
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from '#lib/domain/enums.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const filtered = $derived(
		data.status ? data.projects.filter((p) => p.status === data.status) : data.projects
	);
	const count = (s: string) => data.projects.filter((p) => p.status === s).length;
	const neighbours = (s: (typeof PROJECT_STATUSES)[number]) => {
		const i = PROJECT_STATUSES.indexOf(s);
		return { prev: PROJECT_STATUSES[i - 1], next: PROJECT_STATUSES[i + 1] };
	};
</script>

<svelte:head><title>Travaux · Mon petit lopin</title></svelte:head>

<div class="page-header">
	<h1>Travaux</h1>
	<a class="btn primary small" href="/travaux/nouveau">+ Nouveau</a>
</div>

<nav class="tabs" aria-label="Vue">
	<a href="/travaux" class:active={data.view === 'list'}>Liste</a>
	<a href="/travaux?vue=kanban" class:active={data.view === 'kanban'}>Kanban</a>
</nav>

{#if data.view === 'list'}
	<div class="chips">
		<a href="/travaux" class="chip" class:active={!data.status}>Tous ({data.projects.length})</a>
		{#each PROJECT_STATUSES as s (s)}
			<a href="/travaux?statut={s}" class="chip" class:active={data.status === s}>
				{PROJECT_STATUS_LABELS[s]} ({count(s)})
			</a>
		{/each}
	</div>
	<ul class="list">
		{#each filtered as p (p.id)}
			<li>
				{#if !data.status}<span class="badge status">{PROJECT_STATUS_LABELS[p.status]}</span>{/if}
				<ProjectCard project={p} today={data.today} />
			</li>
		{:else}
			<li class="muted">Aucun projet.</li>
		{/each}
	</ul>
{:else}
	<div class="kanban">
		{#each PROJECT_STATUSES as s (s)}
			{@const { prev, next } = neighbours(s)}
			<section class="column">
				<h2>{PROJECT_STATUS_LABELS[s]} <span class="muted">({count(s)})</span></h2>
				<ul class="list">
					{#each data.projects.filter((p) => p.status === s) as p (p.id)}
						<li>
							<ProjectCard project={p} today={data.today} />
							<div class="move">
								{#if prev}
									<form method="POST" action="?/move&vue=kanban">
										<input type="hidden" name="id" value={p.id} />
										<input type="hidden" name="status" value={prev} />
										<button class="btn link" type="submit">← {PROJECT_STATUS_LABELS[prev]}</button>
									</form>
								{:else}<span></span>{/if}
								{#if next}
									<form method="POST" action="?/move&vue=kanban">
										<input type="hidden" name="id" value={p.id} />
										<input type="hidden" name="status" value={next} />
										<button class="btn link" type="submit">{PROJECT_STATUS_LABELS[next]} →</button>
									</form>
								{/if}
							</div>
						</li>
					{:else}
						<li class="muted small">Vide</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
{/if}

<style>
	.tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}
	.tabs a {
		text-align: center;
		padding: 0.6rem;
		text-decoration: none;
		color: var(--muted);
		background: var(--surface);
	}
	.tabs a.active {
		background: var(--primary);
		color: var(--primary-contrast);
	}
	.chips {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.chip {
		flex: none;
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
		font-size: 0.9rem;
	}
	.chip.active {
		border-color: var(--primary);
		color: var(--primary);
		font-weight: 600;
	}
	.badge.status {
		margin: 0 0 0.25rem 0.25rem;
	}
	.kanban {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 85%;
		gap: 0.75rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		margin: 0 -1rem;
		padding: 0 1rem 0.5rem;
	}
	@media (min-width: 720px) {
		.kanban {
			grid-auto-flow: row;
			grid-template-columns: repeat(3, 1fr);
			margin: 0;
			padding: 0;
		}
	}
	.column {
		scroll-snap-align: start;
		background: color-mix(in srgb, var(--border) 35%, transparent);
		border-radius: var(--radius);
		padding: 0.5rem;
	}
	.column h2 {
		margin: 0.25rem 0 0.5rem;
		font-size: 1rem;
	}
	.move {
		display: flex;
		justify-content: space-between;
	}
	.small {
		font-size: 0.875rem;
	}
</style>
