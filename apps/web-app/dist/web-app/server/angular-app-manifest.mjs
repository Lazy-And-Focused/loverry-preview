
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/scenes"
  },
  {
    "renderMode": 2,
    "route": "/preview"
  },
  {
    "renderMode": 2,
    "route": "/nolayout"
  },
  {
    "renderMode": 2,
    "route": "/nolayout/scenes"
  },
  {
    "renderMode": 2,
    "route": "/nolayout/preview"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8687, hash: '6bcbc4d084de582c87057b6897d17c2a6e11ba5714f73a47d187cb8edb1c8a96', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1059, hash: 'f6d92819dd01d7c42ad9f87833a03d22b5a5b68a58a6f0d5e01f681d2bd44834', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 36449, hash: '3fdf16b4541ec3e74deb75467b65e26fcb64ac5b45736969cf9807f384fee510', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'preview/index.html': {size: 64071, hash: 'a7317932ddc8ce02ad81cb783a9dc6436870a295a4989ce18a20395bdb385430', text: () => import('./assets-chunks/preview_index_html.mjs').then(m => m.default)},
    'nolayout/scenes/index.html': {size: 67640, hash: 'da5d51a2b0e88009dffed7f779170844b70d9252d3ef67ad4b5d58ea90a80b94', text: () => import('./assets-chunks/nolayout_scenes_index_html.mjs').then(m => m.default)},
    'scenes/index.html': {size: 78714, hash: '0167f275d11870d4bfc58e49bce24b7e1def9b028f9677bd7ae84bd726600e2b', text: () => import('./assets-chunks/scenes_index_html.mjs').then(m => m.default)},
    'nolayout/preview/index.html': {size: 52766, hash: 'd7cbb3aea75e4405c10cb794127235560f963e061aca7e2f1bd7dfdc4d2ed4bd', text: () => import('./assets-chunks/nolayout_preview_index_html.mjs').then(m => m.default)},
    'nolayout/index.html': {size: 29861, hash: '9466596bc9d52cd84313f3dd123b58a7344a6f006b0f1e90c14df41e3f00a242', text: () => import('./assets-chunks/nolayout_index_html.mjs').then(m => m.default)},
    'styles-JSY2LKSV.css': {size: 27731, hash: 'xEImHwTYKO0', text: () => import('./assets-chunks/styles-JSY2LKSV_css.mjs').then(m => m.default)}
  },
};
