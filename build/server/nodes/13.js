import * as server from '../entries/pages/especes/nouveau/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/especes/nouveau/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/especes/nouveau/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.D2gAAWor.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/Dacr9UyG.js","_app/immutable/chunks/DRzvIjdI.js"];
export const stylesheets = [];
export const fonts = [];
