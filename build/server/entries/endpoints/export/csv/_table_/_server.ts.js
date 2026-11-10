import { t as error } from "../../../../../chunks/exports.js";
import { h as todayIso } from "../../../../../chunks/dates.js";
import { i as tableCsv, r as isExportTable } from "../../../../../chunks/export.js";
// src/routes/export/csv/[table]/+server.ts
var GET = ({ params }) => {
	if (!isExportTable(params.table)) error(404, "Table inconnue");
	return new Response(tableCsv(params.table), { headers: {
		"content-type": "text/csv; charset=utf-8",
		"content-disposition": `attachment; filename="lopin-${params.table}-${todayIso()}.csv"`
	} });
};
export { GET };

//# sourceMappingURL=_server.ts.js.map