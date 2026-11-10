import * as server from '../entries/pages/especes/_id_/regles/_ruleId_/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/especes/_id_/regles/_ruleId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/especes/[id]/regles/[ruleId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.BFAkK4hE.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/Hxmw2l6-.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/BZaocmf0.js"];
export const stylesheets = ["_app/immutable/assets/RuleForm.lo2xpMQR.css"];
export const fonts = [];
