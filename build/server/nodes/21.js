import * as server from '../entries/pages/travaux/nouveau/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/travaux/nouveau/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/travaux/nouveau/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.Cx4XDddf.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/uoX9tQIL.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/wFmTge9j.js"];
export const stylesheets = ["_app/immutable/assets/ProjectForm.B7PhVqkL.css"];
export const fonts = [];
