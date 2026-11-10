import * as server from '../entries/pages/arbres/_id_/journal/_interventionId_/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/_id_/journal/_interventionId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/[id]/journal/[interventionId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.DVkKMZ6y.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/DJk1Ueb4.js","_app/immutable/chunks/BZaocmf0.js","_app/immutable/chunks/DRzvIjdI.js"];
export const stylesheets = [];
export const fonts = [];
