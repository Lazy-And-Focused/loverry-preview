
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
    'index.csr.html': {size: 8687, hash: '7f34a2a746b589d0c61e63974b459af70a8f2935f17076ffa598ec8d50c3b051', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1059, hash: '710c3fd8c1d20fc91d449182e501c92eb78c4be00e11c8ff372d6206a45b3929', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 36449, hash: 'acf1aada3c13862d7d963cf31b69ceaabeb2bb201d2df1a445b7093bf2cb6b36', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'preview/index.html': {size: 64071, hash: 'fb51ce53b989453cb1477c65c66e9199420882b427ede0b7d3dc9245634ff24b', text: () => import('./assets-chunks/preview_index_html.mjs').then(m => m.default)},
    'nolayout/scenes/index.html': {size: 67640, hash: '0503172bfa3dc3be29a8b7ba11662215cbbb7789ace2426e45d8619766aff710', text: () => import('./assets-chunks/nolayout_scenes_index_html.mjs').then(m => m.default)},
    'scenes/index.html': {size: 78714, hash: '3f541f9d2b22be5ad1ac383baedd170f1c5e1986ca5be0ea8be1a91f74dadb58', text: () => import('./assets-chunks/scenes_index_html.mjs').then(m => m.default)},
    'nolayout/preview/index.html': {size: 52766, hash: 'bce0c2be335450e714e5919b57163f235eee1cd3e8fc217b292a5764c4bbb4b2', text: () => import('./assets-chunks/nolayout_preview_index_html.mjs').then(m => m.default)},
    'nolayout/index.html': {size: 29861, hash: 'f3a0a593354057b0e72b9b59138623a26a2e844a60ae61813d343e0059016f10', text: () => import('./assets-chunks/nolayout_index_html.mjs').then(m => m.default)},
    'styles-JSY2LKSV.css': {size: 27731, hash: 'xEImHwTYKO0', text: () => import('./assets-chunks/styles-JSY2LKSV_css.mjs').then(m => m.default)}
  },
};
