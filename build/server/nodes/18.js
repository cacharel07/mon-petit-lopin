import * as server from '../entries/pages/travaux/_page.server.ts.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/travaux/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/travaux/+page.server.ts";
export const imports = ["_app/immutable/nodes/18.BoL4_AV2.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/BrtfvRu-.js","_app/immutable/chunks/BZaocmf0.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/CJqlHJtG.js"];
export const stylesheets = ["_app/immutable/assets/ProgressBar.BmiulBoO.css","_app/immutable/assets/ProjectCard.HtsCa_S4.css","_app/immutable/assets/18.DmFOSHON.css"];
export const fonts = [];
