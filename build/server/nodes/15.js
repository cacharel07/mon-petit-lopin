import * as server from '../entries/pages/login/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/login/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/login/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.SO9aipAm.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/C3Rj6J0j.js"];
export const stylesheets = ["_app/immutable/assets/15.C1j_Jjv_.css"];
export const fonts = [];
