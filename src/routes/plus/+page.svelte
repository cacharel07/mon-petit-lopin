<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let importing = $state(false);
</script>

<svelte:head><title>Plus · Mon petit lopin</title></svelte:head>

<h1>Plus</h1>

<ul class="list">
	<li><a class="card menu" href="/zones">📍 Zones du terrain</a></li>
	<li><a class="card menu" href="/especes">📖 Modèles d'espèces</a></li>
	<li><a class="card menu" href="/export">📦 Exporter mes données</a></li>
</ul>

{#if data.canSeed}
	<form method="POST" action="?/seed" class="card stack seed" onsubmit={() => (importing = true)}>
		<strong>🌱 Base vide</strong>
		<p class="muted">
			Importer les données initiales : mes 9 arbres, les zones, les modèles d'espèces (règles
			d'entretien « à vérifier ») et les 3 projets de travaux. Les dates approximatives pourront
			être corrigées ensuite.
		</p>
		<button class="btn primary" type="submit" disabled={importing}>
			{importing ? 'Import…' : 'Importer les données initiales'}
		</button>
	</form>
{/if}

<form method="POST" action="/logout" class="logout">
	<button class="btn" type="submit">Se déconnecter</button>
</form>

<style>
	.menu {
		display: block;
		text-decoration: none;
		color: var(--text);
	}
	.seed {
		margin-top: 1.5rem;
		border-color: var(--primary);
	}
	.seed p {
		margin: 0;
	}
	.logout {
		margin-top: 2rem;
	}
</style>
