import * as server from '../entries/pages/arbres/_id_/entretien/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/_id_/entretien/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/[id]/entretien/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.ksrxJlDe.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/BZaocmf0.js"];
export const stylesheets = ["_app/immutable/assets/5.B618XyoT.css"];
export const fonts = [];
