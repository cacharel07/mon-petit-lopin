import * as server from '../entries/pages/zones/_page.server.ts.js';

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/zones/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/zones/+page.server.ts";
export const imports = ["_app/immutable/nodes/22.Bi9TmLPf.js","_app/immutable/chunks/DwJq4gNz.js"];
export const stylesheets = ["_app/immutable/assets/22.CeU8DvWs.css"];
export const fonts = [];
