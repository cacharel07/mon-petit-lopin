<script lang="ts">
	import { formatShortDate } from '#lib/domain/dates.ts';
	import {
		PROJECT_PRIORITY_LABELS,
		type ProjectPriority,
		type ProjectStatus
	} from '#lib/domain/enums.ts';
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		project: {
			id: number;
			title: string;
			status: ProjectStatus;
			priority: ProjectPriority;
			zoneName: string | null;
			plannedEnd: string | null;
			actualEnd: string | null;
			taskCount: number;
			doneCount: number;
			progress: number;
			coverThumb: string | null;
		};
		today: string;
	}
	let { project: p, today }: Props = $props();
	const late = $derived(p.status !== 'done' && p.plannedEnd != null && p.plannedEnd < today);
</script>

<a class="card project" href="/travaux/{p.id}">
	<div class="top">
		{#if p.coverThumb}<img src="/photos/{p.coverThumb}" alt="" loading="lazy" />{/if}
		<div class="text">
			<strong>{p.title}</strong>
			<span class="muted small">
				{[
					p.zoneName,
					p.priority === 'high' ? `priorité ${PROJECT_PRIORITY_LABELS.high.toLowerCase()}` : null
				]
					.filter(Boolean)
					.join(' · ')}
			</span>
			{#if p.status === 'done' && p.actualEnd}
				<span class="muted small"
					>Terminé le {formatShortDate(p.actualEnd, Number(today.slice(0, 4)))}</span
				>
			{:else if p.plannedEnd}
				<span class="small" class:status-overdue={late} class:muted={!late}>
					{late ? 'En retard · ' : ''}fin prévue {formatShortDate(
						p.plannedEnd,
						Number(today.slice(0, 4))
					)}
				</span>
			{/if}
		</div>
	</div>
	{#if p.status !== 'planned' || p.taskCount}
		<div class="progress">
			<ProgressBar value={p.progress} />
			<span class="muted small">
				{p.taskCount ? `${p.doneCount}/${p.taskCount}` : `${p.progress} %`}
			</span>
		</div>
	{/if}
</a>

<style>
	.project {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		color: var(--text);
		text-decoration: none;
	}
	.top {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}
	img {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		object-fit: cover;
		flex: none;
	}
	.text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.small {
		font-size: 0.85rem;
	}
	.progress {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		align-items: center;
	}
</style>
