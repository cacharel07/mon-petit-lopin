import * as server from '../entries/pages/travaux/_id_/_page.server.ts.js';

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/travaux/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/travaux/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/19.Jj8jgTUn.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/DJk1Ueb4.js","_app/immutable/chunks/BZaocmf0.js","_app/immutable/chunks/CJqlHJtG.js","_app/immutable/chunks/DRzvIjdI.js","_app/immutable/chunks/wFmTge9j.js"];
export const stylesheets = ["_app/immutable/assets/ProgressBar.BmiulBoO.css","_app/immutable/assets/19.BGUzmSIQ.css"];
export const fonts = [];
