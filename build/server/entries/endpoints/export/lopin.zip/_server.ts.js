import { h as todayIso } from "../../../../chunks/dates.js";
import { n as exportZip } from "../../../../chunks/export.js";
// src/routes/export/lopin.zip/+server.ts
var GET = async () => {
	const zip = await exportZip();
	return new Response(Buffer.from(zip), { headers: {
		"content-type": "application/zip",
		"content-disposition": `attachment; filename="lopin-${todayIso()}.zip"`
	} });
};
export { GET };

//# sourceMappingURL=_server.ts.js.map