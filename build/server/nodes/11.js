import * as server from '../entries/pages/especes/_id_/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/especes/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/especes/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.2EA8htsl.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/Dacr9UyG.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/BZaocmf0.js"];
export const stylesheets = ["_app/immutable/assets/11.B9-NpxqH.css"];
export const fonts = [];
