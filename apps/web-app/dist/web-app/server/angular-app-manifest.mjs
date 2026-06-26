
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
    'index.csr.html': {size: 8866, hash: '31b4fb13e837b539c3029ba9a4f2cc5f751d3704c8203fdeadfd76d607a21fd6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1059, hash: 'a0818f9e9e7f72f031c8d45d8f296077b3475990224ba67f7e5f3b59f8d49226', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 36635, hash: '73fb59eb3ef407e2fc186031604491dc95557e76a521d57e86ef309e187293e2', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'preview/index.html': {size: 64257, hash: '2765ed16d86ab9b9d1741accbe377418034f5a6bd04451ffbb7d95a6e6e3931c', text: () => import('./assets-chunks/preview_index_html.mjs').then(m => m.default)},
    'nolayout/scenes/index.html': {size: 67826, hash: 'b700d2da71a493ea46f1e6554f1a5df8488f6ee3a38765c4808270f474f961a6', text: () => import('./assets-chunks/nolayout_scenes_index_html.mjs').then(m => m.default)},
    'scenes/index.html': {size: 78900, hash: '78a7cedf467f76de1a75ab14d5fed79ad1bb352eea5d932321990bf90ee196e0', text: () => import('./assets-chunks/scenes_index_html.mjs').then(m => m.default)},
    'nolayout/preview/index.html': {size: 52952, hash: '15c594cf01a04adb14920ed9923ac4b2c48ca6351e8ec7f3f8780d4dea848c59', text: () => import('./assets-chunks/nolayout_preview_index_html.mjs').then(m => m.default)},
    'nolayout/index.html': {size: 30047, hash: '321ec237c25a4e2f94f109451238bbea76bffd87213f7f785e2d0f7ca91d7547', text: () => import('./assets-chunks/nolayout_index_html.mjs').then(m => m.default)},
    'styles-WOW7YUFZ.css': {size: 28163, hash: 'FGfmSPdUjC0', text: () => import('./assets-chunks/styles-WOW7YUFZ_css.mjs').then(m => m.default)}
  },
};
