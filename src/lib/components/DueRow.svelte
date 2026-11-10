<script lang="ts">
	import { dueText } from '#lib/domain/due-text.ts';
	import type { DueItem } from '#lib/domain/schedule.ts';
	import DoneButton from './DoneButton.svelte';

	let { item, today }: { item: DueItem; today: string } = $props();

	const ICONS: Record<string, string> = {
		pruning: '✂️',
		watering: '💧',
		fertilizing: '🌿',
		mulching: '🍂',
		treatment: '🧪',
		harvest: '🧺',
		planting: '🌱',
		observation: '👀',
		other: '🌱'
	};
	const icon = $derived(item.kind === 'care' ? ICONS[item.interventionType] : '🛠️');
	// « Fait » records an intervention dated today: only meaningful when today counts.
	const canMarkDone = $derived(
		item.kind === 'project_task' ||
			(item.kind === 'care' && (item.intervalDays != null || item.status !== 'upcoming'))
	);
	const href = $derived(
		item.kind === 'care' ? `/arbres/${item.treeId}` : `/travaux/${item.projectId}`
	);
</script>

<li class="card row">
	<span class="icon" aria-hidden="true">{icon}</span>
	<a class="text" {href}>
		<strong>{item.label}</strong>
		<span class="muted small">
			{item.kind === 'care' ? item.treeName : item.projectTitle}
			{#if item.kind === 'care' && !item.verified}<span class="badge warning">à vérifier</span>{/if}
		</span>
		<span class="small status-{item.status}">{dueText(item, today)}</span>
	</a>
	{#if canMarkDone}
		{#if item.kind === 'care'}
			<DoneButton kind="care" treeId={item.treeId} ruleId={item.ruleId} />
		{:else if item.taskId != null}
			<DoneButton kind="task" taskId={item.taskId} />
		{/if}
	{/if}
</li>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 0.75rem;
	}
	.icon {
		font-size: 1.4rem;
		flex: none;
	}
	.text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		color: var(--text);
		text-decoration: none;
	}
	.small {
		font-size: 0.85rem;
	}
	.badge {
		margin-left: 0.25rem;
	}
</style>
