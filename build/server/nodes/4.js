import * as server from '../entries/pages/arbres/_id_/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/arbres/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/arbres/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CDDuAV-a.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/BZaocmf0.js","_app/immutable/chunks/10D9l4N1.js","_app/immutable/chunks/CSBECcgq.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/BgugWXA-.js","_app/immutable/chunks/DJk1Ueb4.js"];
export const stylesheets = ["_app/immutable/assets/DoneButton.ChXTMZQS.css","_app/immutable/assets/4.Dj7M24RC.css"];
export const fonts = [];
