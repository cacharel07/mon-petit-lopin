import { t as error } from "../../../../chunks/exports.js";
import { r as photosDir, t as PHOTO_FILE_NAME } from "../../../../chunks/photos.js";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
// src/routes/photos/[name]/+server.ts
var GET = async ({ params }) => {
	if (!PHOTO_FILE_NAME.test(params.name)) error(404, "Photo introuvable");
	try {
		const data = await readFile(join(photosDir(), params.name));
		return new Response(data, { headers: {
			"content-type": "image/webp",
			"cache-control": "private, max-age=31536000, immutable"
		} });
	} catch {
		error(404, "Photo introuvable");
	}
};
export { GET };

//# sourceMappingURL=_server.ts.js.map