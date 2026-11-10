import * as server from '../entries/pages/arbres/nouveau/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/nouveau/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/nouveau/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.Plz_xYkY.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/B6CnvxWv.js"];
export const stylesheets = ["_app/immutable/assets/TreeForm.CS8n_rNu.css","_app/immutable/assets/9.DR49alcW.css"];
export const fonts = [];
