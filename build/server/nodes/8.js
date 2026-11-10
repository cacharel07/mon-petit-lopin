import * as server from '../entries/pages/arbres/_id_/modifier/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/_id_/modifier/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/[id]/modifier/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.LdcnLhMk.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/B6CnvxWv.js","_app/immutable/chunks/DRzvIjdI.js"];
export const stylesheets = ["_app/immutable/assets/TreeForm.CS8n_rNu.css","_app/immutable/assets/8.BFHRM_0K.css"];
export const fonts = [];
