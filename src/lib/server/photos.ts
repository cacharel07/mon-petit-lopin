import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import exifReader from 'exif-reader';
import sharp, { type Metadata } from 'sharp';
import { PHOTOS_DIR } from '$app/env/private';
import { isIsoDate, todayIso } from '../domain/dates.ts';
import { FormError } from './forms.ts';

const FULL_SIZE = 1600;
const THUMB_SIZE = 400;
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024;

export const photosDir = () => resolve(PHOTOS_DIR);

export interface StoredPhoto {
	fileName: string;
	thumbName: string;
	width: number;
	height: number;
	takenAt: string;
}

/** Valid stored file name (used to guard the file-serving route). */
export const PHOTO_FILE_NAME = /^[0-9a-f-]{36}(-thumb)?\.webp$/;

/**
 * Resize an uploaded image (auto-rotated from EXIF), store a large version and
 * a thumbnail as WebP, and return their metadata. EXIF is stripped from the
 * output files; the shooting date is kept in `takenAt`.
 */
export async function storePhoto(file: File): Promise<StoredPhoto> {
	if (file.size > MAX_UPLOAD_BYTES) throw new FormError('Photo trop lourde (30 Mo maximum).');
	const input = Buffer.from(await file.arrayBuffer());

	let metadata: Metadata;
	try {
		metadata = await sharp(input).metadata();
	} catch {
		throw new FormError(`« ${file.name} » n'est pas une image reconnue.`);
	}

	const id = randomUUID();
	const fileName = `${id}.webp`;
	const thumbName = `${id}-thumb.webp`;
	await mkdir(photosDir(), { recursive: true });

	const full = await sharp(input)
		.rotate()
		.resize(FULL_SIZE, FULL_SIZE, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 80 })
		.toBuffer({ resolveWithObject: true });
	await writeFile(join(photosDir(), fileName), full.data);

	const thumb = await sharp(input)
		.rotate()
		.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover' })
		.webp({ quality: 70 })
		.toBuffer();
	await writeFile(join(photosDir(), thumbName), thumb);

	return {
		fileName,
		thumbName,
		width: full.info.width,
		height: full.info.height,
		takenAt: exifDate(metadata.exif) ?? todayIso()
	};
}

function exifDate(exif: Buffer | undefined): string | null {
	if (!exif) return null;
	try {
		const tags = exifReader(exif);
		const d = tags.Photo?.DateTimeOriginal ?? tags.Image?.DateTime;
		if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;
		// exif-reader returns the camera's local time as if it were UTC.
		const iso = d.toISOString().slice(0, 10);
		return isIsoDate(iso) ? iso : null;
	} catch {
		return null;
	}
}

export async function deletePhotoFiles(photos: { fileName: string; thumbName: string }[]) {
	await Promise.all(
		photos.flatMap((p) =>
			[p.fileName, p.thumbName].map((name) => unlink(join(photosDir(), name)).catch(() => {}))
		)
	);
}

export const photoUrl = (name: string) => `/photos/${name}`;
