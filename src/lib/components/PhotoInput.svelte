<script lang="ts">
	let { name = 'photos', label = 'Photos' }: { name?: string; label?: string } = $props();
</script>

<label>
	{label}
	<input {name} type="file" accept="image/*" multiple />
</label>
