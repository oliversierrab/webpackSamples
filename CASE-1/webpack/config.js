var basePaths = {
  src: 'src/',
  dist: 'dist/',
  build: '../dist/opt/', // TODO: Change this back to build
                      // Using dist just for the first test
                      // since the original gulp already
                      // exposes everything here
  areas: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/'
};

var dllVendorDependencies = [
  'bootstrap',
  'bowser',
  'enquire.js',
  'gsap',
  'gsap/src/uncompressed/plugins/ScrollToPlugin',
  'is-retina',
  'iphone-inline-video',
  'jquery',
  'jquery-circle-progress',
  'jquery-ui/ui/core',
  'jquery-ui/ui/widget',
  'jquery-ui/ui/widgets/mouse',
  'jquery-ui/ui/widgets/slider',
  'jquery-ui-touch-punch',
  'jquery-touchswipe',
  'lodash.delay',
  'lodash.find',
  'lodash.foreach',
  'lodash.merge',
  'numeral',
  'objectFitPolyfill',
  'picturefill',
  'picturefill/dist/plugins/mutation/pf.mutation',
  'postal',
  'preload-js',
  'promise',
  'riot',
  'simplestatemanager',
  'slick-carousel',
  'swfobject',
  'swiper',
  'timer.js',
  'throttle-debounce/debounce',
  'throttle-debounce/throttle',
  'waypoints/lib/jquery.waypoints',
  '@ui/rzf-components-core-ui/build/scripts/vendor'
];

var config = {
  name: 'automobiles',
  base: {
    dist: basePaths.dist,
    build: basePaths.build,
    src: basePaths.src,
    areas: basePaths.areas
  },
  entries: {
    main: './src/honda/honda.entry.main.js',
    compare: './src/honda/tools/compare/honda.tools.compare.js',
    dealerLocator: './src/honda/tools/dealerLocator/honda.tools.dealerLocator.js',
    inventory: './src/honda/tools/inventory/honda.tools.inventory.js',
    offers: './src/honda/tools/offers/honda.tools.offers.js',
    offersIframe: './src/honda/tools/offers/honda.tools.offersIframe.scss',
    paymentEstimator: './src/honda/tools/paymentEstimator/honda.tools.paymentEstimator.js',
    raq: './src/honda/tools/raq/honda.tools.raq.js',
    bap: './src/honda/honda.entry.bap.js',
    page404: './src/honda/pages/404/honda.pages.404.js',
    vendorStyles: './src/styles/vendor/vendor.scss',
    styleGuide: './src/styles/sass/styleguide/styleguide.scss'
  },
  dependencies: dllVendorDependencies,
  dll: {
    build: 'cache/',
    src: 'cache/vendor.json'
  },
  server: {
    port: 8080,
    host: 'http://0.0.0.0'
  },
  autoprefixer: { // Sass prefixer config
    browsers: ['last 3 versions']
  },
  sassLintConfig: '.sass-lint.yml',
  proxyUrl: 'http://autos.dev1.la.razorfish.com'
};

module.exports = config;
