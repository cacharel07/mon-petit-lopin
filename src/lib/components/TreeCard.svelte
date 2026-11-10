<script lang="ts">
	import { formatAge } from '#lib/domain/dates.ts';
	import { TREE_STATUS_LABELS, type TreeStatus } from '#lib/domain/enums.ts';

	interface Props {
		tree: {
			id: number;
			name: string;
			commonName: string;
			variety: string | null;
			nickname: string | null;
			status: TreeStatus;
			zoneName: string | null;
			coverThumb: string | null;
			ageYears: number | null;
		};
	}
	let { tree }: Props = $props();

	const subtitle = $derived(
		[
			tree.nickname ? [tree.commonName, tree.variety].filter(Boolean).join(' ') : null,
			tree.zoneName,
			tree.ageYears != null ? `planté il y a ${formatAge(tree.ageYears)}` : null,
			tree.status !== 'planted' ? TREE_STATUS_LABELS[tree.status] : null
		]
			.filter(Boolean)
			.join(' · ')
	);
</script>

<a class="card tree" href="/arbres/{tree.id}">
	{#if tree.coverThumb}
		<img src="/photos/{tree.coverThumb}" alt="" loading="lazy" />
	{:else}
		<span class="placeholder" aria-hidden="true">🌳</span>
	{/if}
	<span class="text">
		<strong>{tree.name}</strong>
		{#if subtitle}<span class="muted">{subtitle}</span>{/if}
	</span>
</a>

<style>
	.tree {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem;
		color: var(--text);
		text-decoration: none;
	}
	img,
	.placeholder {
		width: 56px;
		height: 56px;
		border-radius: 8px;
		flex: none;
		object-fit: cover;
	}
	.placeholder {
		display: grid;
		place-items: center;
		font-size: 1.75rem;
		background: var(--bg);
	}
	.text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.muted {
		font-size: 0.85rem;
	}
</style>
