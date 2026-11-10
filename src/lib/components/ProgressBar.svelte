<script lang="ts">
	let { value }: { value: number } = $props();
</script>

<div class="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
	<div class="fill" style:width="{value}%"></div>
</div>

<style>
	.bar {
		height: 6px;
		border-radius: 999px;
		background: var(--border);
		overflow: hidden;
	}
	.fill {
		height: 100%;
		background: var(--primary);
	}
</style>
