<script lang="ts">
	import { page } from '$app/state';

	type Props =
		| { kind: 'care'; treeId: number; ruleId: number; taskId?: never }
		| { kind: 'task'; taskId: number; treeId?: never; ruleId?: never };

	let props: Props = $props();
	let sent = $state(false);
</script>

<form method="POST" action="/echeances/fait" onsubmit={() => (sent = true)}>
	<input type="hidden" name="kind" value={props.kind} />
	{#if props.kind === 'care'}
		<input type="hidden" name="treeId" value={props.treeId} />
		<input type="hidden" name="ruleId" value={props.ruleId} />
	{:else}
		<input type="hidden" name="taskId" value={props.taskId} />
	{/if}
	<input type="hidden" name="redirectTo" value={page.url.pathname + page.url.search} />
	<button class="btn small done" type="submit" disabled={sent}>✓ Fait</button>
</form>

<style>
	.done {
		border-color: var(--primary);
		color: var(--primary);
		white-space: nowrap;
	}
</style>
