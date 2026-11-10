import * as server from '../entries/pages/travaux/_id_/modifier/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/travaux/_id_/modifier/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/travaux/[id]/modifier/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.dZ7Uq0qw.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/uoX9tQIL.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/wFmTge9j.js"];
export const stylesheets = ["_app/immutable/assets/ProjectForm.B7PhVqkL.css","_app/immutable/assets/20.B2kpBIVT.css"];
export const fonts = [];
