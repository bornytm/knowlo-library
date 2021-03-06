// Configuration for your app

module.exports = function (ctx) {
  return {
    // app boot (/src/boot)
    boot: [
      'axios'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5'
    ],
    supportIE: false,
    build: {
      // devtool: 'eval',
      // sourceMaps: true,
      // minify: false,
      scopeHoisting: true,
      // uglifyOptions: {
      //   mangle: false
        // mangleProperties: {
        //   regex: /^_/
        // }
      // },
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        // cfg.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /node_modules/
        // })
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
      proxy: {
      // proxy all requests starting with /api to jsonplaceholder
        '/api': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          // pathRewrite: {
          //   '^/api': ''
          // }
        }
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QPopupEdit',
        'QLayout',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        // 'QItemMain',
        // 'QItemSide',
        'QPageScroller',
        'QSpinner',
        'QInfiniteScroll',
        'QTooltip',
        'QInput',
        'QSlider',
        'QTabs',
        'QTab',
        'QToggle',
        'QAvatar',
        'QChip',
        'QBtnGroup',
        'QBtnDropdown',
        'QRadio'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Cookies',
        'LocalStorage',
        'SessionStorage',
        'Meta'
      ]
      // lang: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
       // “id”, “version”, “description” and/or “androidVersionCode”
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
