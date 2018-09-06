// Dependencies
var webpack = require('webpack');
var path = require('path');
var stylish = require('eslint/lib/formatters/stylish');

// Config File
var config = require('./config.js');
var autoPrefixer = require('autoprefixer')(config.autoprefixer);

// Plugins
var SassLintPlugin = require('sasslint-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// For version annotation
var packageJSON = require('../package.json');
var banner = 'version: ' + packageJSON.version;

var entryConfig = {};
var dllManifest = require(path.resolve(process.cwd(), config.dll.src));

// When building,bundles are generated on dist/ and external gulp task will move them over Sitecore folder
var outputPath = config.base.dist;

// Aliases
var merge = require('lodash.merge');
var sourceAliases = require(path.resolve(process.cwd(), 'aliases.json'));
var otherAliases = {
  '../img': path.resolve(process.cwd(), './src/assets/img'),
  legacy: path.resolve(process.cwd(), './src/js'),
  honda: path.resolve(process.cwd(), './src/honda'),
  behaviors: path.resolve(process.cwd(), './src/js/behaviors'),
  components: path.resolve(process.cwd(), './src/js/components'),
  vendor: path.resolve(process.cwd(), './src/js/vendor'),
  tagfiles: path.resolve(process.cwd(), './src/components/tagfiles'),
  variables: '@ui/rzf-components-core-ui/shared/scripts/_variables'
};

var aliases = merge(sourceAliases, otherAliases);

// Styleguide Sheet entries (Dev only)
if (process.env.NODE_ENV !== 'production') {
  entryConfig['styleguide'] = config.entries.styleGuide;
}

// Main Styles
entryConfig.main = config.entries.main;

// Tools
entryConfig['tools-dealer-locator'] = config.entries.dealerLocator;
entryConfig['tools-inventory'] = config.entries.inventory;
entryConfig['tools-offers'] = config.entries.offers;
entryConfig['tools-offers-iframe'] = config.entries.offersIframe;
entryConfig['tools-payment-estimator'] = config.entries.paymentEstimator;
entryConfig['tools-request-a-quote'] = config.entries.raq;
entryConfig['tools-compare'] = config.entries.compare;

// BAP
entryConfig.bap = config.entries.bap;

// Pages
entryConfig.page404 = config.entries.page404;

// Vendor styles
entryConfig['vendor-styles'] = config.entries.vendorStyles;

module.exports = {
  entry: entryConfig,
  output: {
    library: [config.name],
    path: path.resolve(process.cwd(), outputPath),
    pathinfo: process.env.NODE_ENV !== 'production',
    filename: 'js/[name].min.js'
  },
  resolve: {
    modules: [
      path.resolve(process.cwd(), '.'),
      'node_modules',
      '@ui/rzf-components-core-ui/shared' // we have transitive dependencies that we have
      // deal this way
    ],
    alias: aliases
  },
  // We might want to use a source map strategy that doesn't expose the original
  // source files (with our comments, etc) but the transformed files
  // more info: https://webpack.js.org/configuration/devtool/#devtool
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  module: {
    rules: [{
      test: /\.tag$/,
      loader: 'riot-tag-loader'
    },
    {
      test: /\.(js|tag)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        formatter: stylish
      }
    },
    {
      test: /vissense/,
      loader: 'exports-loader?VisSense!script-loader'
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: {
              safe: true
            },
            sourceMap: process.env.NODE_ENV !== 'production',
            url: false // TODO Handle assets and replace gulp copy tasks
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: function autoprefixer() {
              return [
                autoPrefixer
              ];
            }
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: process.env.NODE_ENV !== 'production'
          }
        }
        ],
        publicPath: ''
      })
    }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: dllManifest
    }),
    // This plugin makes a module available as a variable in every module.
    // The module is required only if you use the variable.
    // Example: jQuery = require('jquery') is added at the top if it's
    // found as a free variable in the file
    // We need this for bootstrap to work
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV,
        BUNDLER: JSON.stringify('webpack')
      }
    }),
    // Implicit vendor chunck (everything required from node_modules is added to vendor.js)
    new SassLintPlugin({
      configFile: config.sassLintConfig,
      ignorePlugins: ['extract-text-webpack-plugin'],
      context: './src',
      quiet: process.env.NODE_ENV === 'production',
      failOnError: true
    }),
    // Uglify JS
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: process.env.NODE_ENV !== 'production',
      mangle: true,
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    // Adds a comment on the first line with the package version
    new webpack.BannerPlugin({
      banner: banner
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoPrefixer]
      }
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: dllManifest
    }),
    new ExtractTextPlugin({
      // NOTE: Reanming main.min.css to styles.min.css
      // TODO: Update site to use new main files main.min.js, main.min.css
      filename: function(getPath) {
        return getPath('css/[name].min.css').replace('main', 'styles').replace('vendor-styles', 'vendor');
      }
    }),
    new CopyWebpackPlugin([{
      from: 'cache/vendor.min.js',
      to: path.resolve(process.cwd(), outputPath + 'js/')
    }]),
    // Edge case for 2 interior 360 pages. We move pano2vr_player.js to dist/js
    // so the jenkins build can copy it to Areas for publishing
    new CopyWebpackPlugin([{
      from: 'src/assets/720/pano2vr_player.js',
      to: path.resolve(process.cwd(), outputPath + 'js/')
    }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    })
  ]
};
