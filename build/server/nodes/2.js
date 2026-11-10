import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.BfaEGSEO.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/BZaocmf0.js","_app/immutable/chunks/10D9l4N1.js","_app/immutable/chunks/CSBECcgq.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/BgugWXA-.js","_app/immutable/chunks/BrtfvRu-.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/CJqlHJtG.js","_app/immutable/chunks/C3Rj6J0j.js"];
export const stylesheets = ["_app/immutable/assets/DoneButton.ChXTMZQS.css","_app/immutable/assets/ProgressBar.BmiulBoO.css","_app/immutable/assets/ProjectCard.HtsCa_S4.css","_app/immutable/assets/2.BrsfOnIt.css"];
export const fonts = [];
