<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head><title>Connexion · Mon petit lopin</title></svelte:head>

<div class="login">
	<h1>🌳 Mon petit lopin</h1>
	<form method="POST" class="card stack">
		{#if form?.error}<p class="error">{form.error}</p>{/if}
		<label>
			Identifiant
			<input name="username" autocomplete="username" value={form?.username ?? ''} required />
		</label>
		<label>
			Mot de passe
			<input name="password" type="password" autocomplete="current-password" required />
		</label>
		<button class="btn primary" type="submit">Se connecter</button>
	</form>
</div>

<style>
	.login {
		max-width: 22rem;
		margin: 15vh auto 0;
		padding: 0 1rem;
	}
	h1 {
		text-align: center;
	}
</style>
