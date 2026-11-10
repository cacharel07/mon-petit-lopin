import * as server from '../entries/pages/arbres/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.DC9th2JW.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/BZaocmf0.js","_app/immutable/chunks/DRzvIjdI.js"];
export const stylesheets = ["_app/immutable/assets/3.B4BZfcdu.css"];
export const fonts = [];
