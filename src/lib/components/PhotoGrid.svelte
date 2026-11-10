<script lang="ts">
	import { formatDate } from '#lib/domain/dates.ts';

	interface PhotoItem {
		id: number;
		fileName: string;
		thumbName: string;
		takenAt: string;
		caption: string | null;
	}

	let {
		photos,
		deleteAction = '?/deletePhoto',
		showDates = true
	}: { photos: PhotoItem[]; deleteAction?: string | null; showDates?: boolean } = $props();

	const confirmDelete = (e: SubmitEvent) => {
		if (!confirm('Supprimer cette photo ?')) e.preventDefault();
	};
</script>

{#if photos.length}
	<div class="photo-grid">
		{#each photos as p (p.id)}
			<figure>
				<a href="/photos/{p.fileName}" target="_blank" rel="noopener">
					<img src="/photos/{p.thumbName}" alt={p.caption ?? 'Photo'} loading="lazy" />
				</a>
				<figcaption>
					<span>{showDates ? formatDate(p.takenAt) : ''}</span>
					{#if deleteAction}
						<form method="POST" action={deleteAction} onsubmit={confirmDelete}>
							<input type="hidden" name="photoId" value={p.id} />
							<button class="btn link" type="submit" aria-label="Supprimer la photo">✕</button>
						</form>
					{/if}
				</figcaption>
			</figure>
		{/each}
	</div>
{/if}
