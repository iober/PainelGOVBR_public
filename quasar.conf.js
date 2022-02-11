// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [
      'axios',
      'hello',
      'addressbar-color'
    ],

    plugins: [
      'i18n',
      'axios',
      'hello'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.sass'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v4',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // iconSet: 'ionicons-v4', // Quasar icon set
      lang: 'pt-br', // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: 'auto',

      components: ['QTabs',
        'QTab',
        'QRouteTab',
        'QTimeline',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QTimelineEntry',
        'QToolbar',
        'QToolbarTitle',
        'QCarousel',
        'QCarouselControl',
        'QCarouselSlide',
        'QDialog',
        'QForm',
        'QInput',
        'QBtnToggle',
        'QIcon'],
      directives: ['ClosePopup'],

      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'Loading', 'AddressbarColor']
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: false,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    // API: JSON.stringify('http://localhost:3000')
    build: {
      env: ctx.dev
        ? { API: JSON.stringify('http://localhost:3000') }
        : { API: JSON.stringify('http://localhost:3000') },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: true
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'Painel GOVBR',
        short_name: 'Painel GOVBR',
        description: 'Painel GOVBR',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0560a1',
        theme_color: '#0560a1',
        icons: [
          {
            'src': 'statics/icons/logo.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/logo.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/logo.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/logo.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/logo.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      },
      metaVariables: {
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'default',
        appleTouchIcon120: 'statics/icons/logo.png',
        appleTouchIcon180: 'statics/icons/logo.png',
        appleTouchIcon152: 'statics/icons/logo.png',
        appleTouchIcon167: 'statics/icons/logo.png',
        appleSafariPinnedTab: 'statics/icons/logo.png',
        msapplicationTileImage: 'statics/icons/logo.png',
        msapplicationTileColor: '#000000'
      }
    },

    // https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
      }
    }
  }
}