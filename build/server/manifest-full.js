export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	app_dir: "_app",
	app_path: "_app",
	assets: new Set(["apple-touch-icon.png","robots.txt"]),
	mime_types: {".png":"image/png",".txt":"text/plain"},
	client: {start:"_app/immutable/entry/start.7iBOyj8d.js",app:"_app/immutable/entry/app.cwfyNM0Y.js",imports:["_app/immutable/entry/start.7iBOyj8d.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/DclECHGd.js","_app/immutable/chunks/Bg9HxSPR.js","_app/immutable/chunks/DwJq4gNz.js","_app/immutable/chunks/CSBECcgq.js","_app/immutable/entry/app.cwfyNM0Y.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
	
	nodes: [
		__memo(() => import('./nodes/0.js')),
		__memo(() => import('./nodes/1.js')),
		__memo(() => import('./nodes/2.js')),
		__memo(() => import('./nodes/3.js')),
		__memo(() => import('./nodes/4.js')),
		__memo(() => import('./nodes/5.js')),
		__memo(() => import('./nodes/6.js')),
		__memo(() => import('./nodes/7.js')),
		__memo(() => import('./nodes/8.js')),
		__memo(() => import('./nodes/9.js')),
		__memo(() => import('./nodes/10.js')),
		__memo(() => import('./nodes/11.js')),
		__memo(() => import('./nodes/12.js')),
		__memo(() => import('./nodes/13.js')),
		__memo(() => import('./nodes/14.js')),
		__memo(() => import('./nodes/15.js')),
		__memo(() => import('./nodes/16.js')),
		__memo(() => import('./nodes/17.js')),
		__memo(() => import('./nodes/18.js')),
		__memo(() => import('./nodes/19.js')),
		__memo(() => import('./nodes/20.js')),
		__memo(() => import('./nodes/21.js')),
		__memo(() => import('./nodes/22.js'))
	],
	remotes: {
		
	},
	routes: [
		{
			id: "/",
			pattern: /^\/$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 2 },
			endpoint: null
		},
		{
			id: "/arbres",
			pattern: /^\/arbres\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 3 },
			endpoint: null
		},
		{
			id: "/arbres/nouveau",
			pattern: /^\/arbres\/nouveau\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 9 },
			endpoint: null
		},
		{
			id: "/arbres/[id]",
			pattern: /^\/arbres\/([^/]+?)\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 4 },
			endpoint: null
		},
		{
			id: "/arbres/[id]/entretien",
			pattern: /^\/arbres\/([^/]+?)\/entretien\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 5 },
			endpoint: null
		},
		{
			id: "/arbres/[id]/entretien/[ruleId]",
			pattern: /^\/arbres\/([^/]+?)\/entretien\/([^/]+?)\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"ruleId","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 6 },
			endpoint: null
		},
		{
			id: "/arbres/[id]/journal/[interventionId]",
			pattern: /^\/arbres\/([^/]+?)\/journal\/([^/]+?)\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"interventionId","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 7 },
			endpoint: null
		},
		{
			id: "/arbres/[id]/modifier",
			pattern: /^\/arbres\/([^/]+?)\/modifier\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 8 },
			endpoint: null
		},
		{
			id: "/echeances/fait",
			pattern: /^\/echeances\/fait\/?$/,
			params: [],
			page: null,
			endpoint: __memo(() => import('./entries/endpoints/echeances/fait/_server.ts.js'))
		},
		{
			id: "/especes",
			pattern: /^\/especes\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 10 },
			endpoint: null
		},
		{
			id: "/especes/nouveau",
			pattern: /^\/especes\/nouveau\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 13 },
			endpoint: null
		},
		{
			id: "/especes/[id]",
			pattern: /^\/especes\/([^/]+?)\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 11 },
			endpoint: null
		},
		{
			id: "/especes/[id]/regles/[ruleId]",
			pattern: /^\/especes\/([^/]+?)\/regles\/([^/]+?)\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"ruleId","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 12 },
			endpoint: null
		},
		{
			id: "/export",
			pattern: /^\/export\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 14 },
			endpoint: null
		},
		{
			id: "/export/csv/[table]",
			pattern: /^\/export\/csv\/([^/]+?)\/?$/,
			params: [{"name":"table","optional":false,"rest":false,"chained":false}],
			page: null,
			endpoint: __memo(() => import('./entries/endpoints/export/csv/_table_/_server.ts.js'))
		},
		{
			id: "/export/lopin.json",
			pattern: /^\/export\/lopin\.json\/?$/,
			params: [],
			page: null,
			endpoint: __memo(() => import('./entries/endpoints/export/lopin.json/_server.ts.js'))
		},
		{
			id: "/export/lopin.zip",
			pattern: /^\/export\/lopin\.zip\/?$/,
			params: [],
			page: null,
			endpoint: __memo(() => import('./entries/endpoints/export/lopin.zip/_server.ts.js'))
		},
		{
			id: "/login",
			pattern: /^\/login\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 15 },
			endpoint: null
		},
		{
			id: "/logout",
			pattern: /^\/logout\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 16 },
			endpoint: null
		},
		{
			id: "/photos/[name]",
			pattern: /^\/photos\/([^/]+?)\/?$/,
			params: [{"name":"name","optional":false,"rest":false,"chained":false}],
			page: null,
			endpoint: __memo(() => import('./entries/endpoints/photos/_name_/_server.ts.js'))
		},
		{
			id: "/plus",
			pattern: /^\/plus\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 17 },
			endpoint: null
		},
		{
			id: "/travaux",
			pattern: /^\/travaux\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 18 },
			endpoint: null
		},
		{
			id: "/travaux/nouveau",
			pattern: /^\/travaux\/nouveau\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 21 },
			endpoint: null
		},
		{
			id: "/travaux/[id]",
			pattern: /^\/travaux\/([^/]+?)\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 19 },
			endpoint: null
		},
		{
			id: "/travaux/[id]/modifier",
			pattern: /^\/travaux\/([^/]+?)\/modifier\/?$/,
			params: [{"name":"id","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 20 },
			endpoint: null
		},
		{
			id: "/zones",
			pattern: /^\/zones\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 22 },
			endpoint: null
		}
	],
	prerendered_routes: new Set([]),
	matchers: async () => {
		return {};
	},
	server_assets: {}
}
})();
