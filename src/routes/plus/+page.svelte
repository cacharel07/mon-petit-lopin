<svelte:head><title>Plus · Mon petit lopin</title></svelte:head>

<h1>Plus</h1>

<ul class="list">
	<li><a class="card menu" href="/zones">📍 Zones du terrain</a></li>
	<li><a class="card menu" href="/especes">📖 Modèles d'espèces</a></li>
</ul>

<form method="POST" action="/logout" class="logout">
	<button class="btn" type="submit">Se déconnecter</button>
</form>

<style>
	.menu {
		display: block;
		text-decoration: none;
		color: var(--text);
	}
	.logout {
		margin-top: 2rem;
	}
</style>
