<script lang="ts">
	import logo from '#lib/assets/logo.webp';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head><title>Connexion · Mon petit lopin</title></svelte:head>

<div class="login">
	<img class="logo" src={logo} alt="Mon petit lopin" width="480" height="480" />
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
		margin: 8vh auto 0;
		padding: 0 1rem;
	}
	.logo {
		display: block;
		width: 12rem;
		height: 12rem;
		margin: 0 auto 1.25rem;
		border-radius: 50%;
		background: #fff;
	}
</style>
