
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
    'index.csr.html': {size: 8866, hash: '674df25a1cd415d2232cf26d8342e612ca5f5ab69154bcebcef7b7dedcc3e81e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1059, hash: '34e07e51dc2b588c71d00a9e8d5cd1a08360c98276d58651c5cf8a834a4e99a4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 36635, hash: 'ae039166db454f814647452d496e9eea99307058e2d5a3687afe7f5097283220', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'preview/index.html': {size: 64257, hash: 'dead26a9076eb194bdd1d43911f3c673d5e702f3dbdc2950923b836c351b862c', text: () => import('./assets-chunks/preview_index_html.mjs').then(m => m.default)},
    'nolayout/scenes/index.html': {size: 67826, hash: '58942ff0bc33fb5b202a773ee021a0b527d1ddf3c54cbad8822a5efeab2b906d', text: () => import('./assets-chunks/nolayout_scenes_index_html.mjs').then(m => m.default)},
    'scenes/index.html': {size: 78900, hash: '0a19360990766317f5f53378dbd5599282a19b603c7756d8086e72a0a633c35d', text: () => import('./assets-chunks/scenes_index_html.mjs').then(m => m.default)},
    'nolayout/preview/index.html': {size: 52952, hash: '9c89e5576880e12fc8128f56bf0a3bcb40bfb8927df8158dfa741d71129a4cc7', text: () => import('./assets-chunks/nolayout_preview_index_html.mjs').then(m => m.default)},
    'nolayout/index.html': {size: 30047, hash: '4a1a847acd7b37d1cacc5487a3b9083facc566ee2fbc0dc3c7d3685f7bf9da54', text: () => import('./assets-chunks/nolayout_index_html.mjs').then(m => m.default)},
    'styles-WOW7YUFZ.css': {size: 28163, hash: 'FGfmSPdUjC0', text: () => import('./assets-chunks/styles-WOW7YUFZ_css.mjs').then(m => m.default)}
  },
};
