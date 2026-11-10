import { h as todayIso } from "../../../../chunks/dates.js";
import { t as exportJson } from "../../../../chunks/export.js";
// src/routes/export/lopin.json/+server.ts
var GET = () => new Response(JSON.stringify(exportJson(), null, 2), { headers: {
	"content-type": "application/json; charset=utf-8",
	"content-disposition": `attachment; filename="lopin-${todayIso()}.json"`
} });
export { GET };

//# sourceMappingURL=_server.ts.js.map