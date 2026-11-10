import * as server from '../entries/pages/arbres/_id_/entretien/_ruleId_/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/_id_/entretien/_ruleId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/[id]/entretien/[ruleId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.BBxrBBkB.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/Hxmw2l6-.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/BZaocmf0.js"];
export const stylesheets = ["_app/immutable/assets/RuleForm.lo2xpMQR.css"];
export const fonts = [];
