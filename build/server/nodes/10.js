import * as server from '../entries/pages/especes/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/especes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/especes/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BtK-VSkg.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/DRzvIjdI.js"];
export const stylesheets = ["_app/immutable/assets/10.Ca4PJhRE.css"];
export const fonts = [];
