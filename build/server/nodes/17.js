import * as server from '../entries/pages/plus/_page.server.ts.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/plus/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/plus/+page.server.ts";
export const imports = ["_app/immutable/nodes/17.Dt62xExU.js","_app/immutable/chunks/DwJq4gNz.js"];
export const stylesheets = ["_app/immutable/assets/17.BQn-wzCi.css"];
export const fonts = [];
