import { i as PHOTOS_DIR } from "./private.js";
import { f as isIsoDate, h as todayIso } from "./dates.js";
import { t as FormError } from "./forms.js";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import exifReader from "exif-reader";
import sharp from "sharp";
// src/lib/server/photos.ts
var FULL_SIZE = 1600;
var THUMB_SIZE = 400;
var MAX_UPLOAD_BYTES = 31457280;
var photosDir = () => resolve(PHOTOS_DIR);
/** Valid stored file name (used to guard the file-serving route). */
var PHOTO_FILE_NAME = /^[0-9a-f-]{36}(-thumb)?\.webp$/;
/**
* Resize an uploaded image (auto-rotated from EXIF), store a large version and
* a thumbnail as WebP, and return their metadata. EXIF is stripped from the
* output files; the shooting date is kept in `takenAt`.
*/
async function storePhoto(file) {
	if (file.size > MAX_UPLOAD_BYTES) throw new FormError("Photo trop lourde (30 Mo maximum).");
	const input = Buffer.from(await file.arrayBuffer());
	let metadata;
	try {
		metadata = await sharp(input).metadata();
	} catch {
		throw new FormError(`« ${file.name} » n'est pas une image reconnue.`);
	}
	const id = randomUUID();
	const fileName = `${id}.webp`;
	const thumbName = `${id}-thumb.webp`;
	await mkdir(photosDir(), { recursive: true });
	const full = await sharp(input).rotate().resize(FULL_SIZE, FULL_SIZE, {
		fit: "inside",
		withoutEnlargement: true
	}).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
	await writeFile(join(photosDir(), fileName), full.data);
	const thumb = await sharp(input).rotate().resize(THUMB_SIZE, THUMB_SIZE, { fit: "cover" }).webp({ quality: 70 }).toBuffer();
	await writeFile(join(photosDir(), thumbName), thumb);
	return {
		fileName,
		thumbName,
		width: full.info.width,
		height: full.info.height,
		takenAt: exifDate(metadata.exif) ?? todayIso()
	};
}
function exifDate(exif) {
	if (!exif) return null;
	try {
		const tags = exifReader(exif);
		const d = tags.Photo?.DateTimeOriginal ?? tags.Image?.DateTime;
		if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;
		const iso = d.toISOString().slice(0, 10);
		return isIsoDate(iso) ? iso : null;
	} catch {
		return null;
	}
}
async function deletePhotoFiles(photos) {
	await Promise.all(photos.flatMap((p) => [p.fileName, p.thumbName].map((name) => unlink(join(photosDir(), name)).catch(() => {}))));
}
export { storePhoto as i, deletePhotoFiles as n, photosDir as r, PHOTO_FILE_NAME as t };

//# sourceMappingURL=photos.js.map