<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>Erreur · Mon petit lopin</title></svelte:head>

<h1>{page.status === 404 ? 'Page introuvable' : 'Une erreur est survenue'}</h1>
<p class="muted">{page.error?.message}</p>
<p><a class="btn" href="/">Retour au tableau de bord</a></p>
