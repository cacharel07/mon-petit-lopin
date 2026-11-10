<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const links = [
		{ href: '/', label: 'Accueil', icon: '🏡' },
		{ href: '/arbres', label: 'Arbres', icon: '🌳' },
		{ href: '/travaux', label: 'Travaux', icon: '🛠️' },
		{ href: '/plus', label: 'Plus', icon: '☰' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	const showNav = $derived(!page.url.pathname.startsWith('/login'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#4a7c3a" />
</svelte:head>

<main class:with-nav={showNav}>
	{@render children()}
</main>

{#if showNav}
	<nav>
		{#each links as link (link.href)}
			<a href={link.href} class:active={isActive(link.href)}>
				<span class="icon" aria-hidden="true">{link.icon}</span>
				<span>{link.label}</span>
			</a>
		{/each}
	</nav>
{/if}

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 1rem;
	}
	main.with-nav {
		padding-bottom: calc(var(--nav-height) + 1.5rem + env(safe-area-inset-bottom));
	}
	nav {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		height: calc(var(--nav-height) + env(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
		background: var(--surface);
		border-top: 1px solid var(--border);
	}
	nav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		color: var(--muted);
		text-decoration: none;
	}
	nav a.active {
		color: var(--primary);
		font-weight: 600;
	}
	.icon {
		font-size: 1.35rem;
		line-height: 1.2;
	}
</style>
