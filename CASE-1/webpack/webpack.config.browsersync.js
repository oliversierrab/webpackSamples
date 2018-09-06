// Dependencies
var webpack = require('webpack');
var path = require('path');
var stylish = require('eslint/lib/formatters/stylish');

// Config File
var config = require('./config.js');
var autoPrefixer = require('autoprefixer')(config.autoprefixer);

// Plugins
var SassLintPlugin = require('sasslint-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var entryConfig = {};
var dllManifest = require(path.resolve(process.cwd(), config.dll.src));

// Aliases
var merge = require('lodash.merge');
var sourceAliases = require(path.resolve(process.cwd(), 'aliases.json'));
var otherAliases = {
  '../img': path.resolve(process.cwd(), './src/assets/img'),
  legacy: path.resolve(process.cwd(), './src/js'),
  honda: path.resolve(process.cwd(), './src/honda'),
  tagfiles: path.resolve(process.cwd(), './src/components/tagfiles'),
  variables: '@ui/rzf-components-core-ui/shared/scripts/_variables'
};

var aliases = merge(sourceAliases, otherAliases);

// Main Styles
entryConfig.main = config.entries.main;

// Vendor styles
entryConfig['vendor-styles'] = config.entries.vendorStyles;

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

function definePlugins(env) {
  var environment = env || {};
  var plugins = [];
  // This plugin makes a module available as a variable in every module.
  // The module is required only if you use the variable.
  // Example: jQuery = require('jquery') is added at the top if it's
  // found as a free variable in the file
  // We need this for bootstrap to work
  var providePlugin = new webpack.ProvidePlugin({
    jQuery: 'jquery'
  });

  var definePlugin = new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      BUNDLER: JSON.stringify('webpack')
    }
  });

  // Implicit vendor chunck (everything required from node_modules is added to vendor.js)
  var sassLintPlugin = new SassLintPlugin({
    configFile: config.sassLintConfig,
    ignorePlugins: ['extract-text-webpack-plugin'],
    context: './src',
    quiet: true, // process.env.NODE_ENV === 'production',
    failOnError: true
  });

  var loaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [autoPrefixer]
    }
  });

  var dllReferencePlugin = new webpack.DllReferencePlugin({
    context: process.cwd(),
    manifest: dllManifest
  });

  var extractCss = new ExtractTextPlugin({
    // NOTE: Reanming main.min.css to styles.min.css
    // TODO: Update site to use new main files main.min.js, main.min.css
    filename: function (getPath) {
      return getPath('[name].min.css').replace('main', 'styles').replace('vendor-styles', 'vendor');
    }
  });

  var browserSync = new BrowserSyncPlugin({
    open: false,
    host: '0.0.0.0',
    port: 3000,
    proxy: process.argv[5] ? process.argv[5] : config.proxyUrl,
    serveStatic: [{
      route: ['/Areas/Honda_Automobiles/css', '/Areas/Honda_Automobiles/js'],
      dir: ['dist', 'cache']
    }]
  });

  var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
  });

  plugins.push(providePlugin);
  plugins.push(definePlugin);

  if (!environment.nocsslint) {
    plugins.push(sassLintPlugin);
  }

  plugins.push(loaderOptionsPlugin);
  plugins.push(dllReferencePlugin);
  plugins.push(extractCss);
  plugins.push(browserSync);
  plugins.push(commonsChunkPlugin);

  return plugins;
}

function cssLoaders(env) {
  var environment = env || {};
  var sourceMaps = !!environment.nocss;
  var minimize = !!environment.nocss;

  return ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: {
            safe: !minimize
          },
          sourceMap: !sourceMaps,
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
          sourceMap: !sourceMaps
        }
      }
    ]
  });
}
module.exports = function (env) {
  return {
    entry: entryConfig,
    output: {
      library: [config.name],
      pathinfo: true,
      path: path.resolve(process.cwd(), config.base.dist),
      publicPath: '/',
      filename: '[name].min.js'
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
      rules: [
        {
          test: /\.tag$/,
          loader: 'riot-tag-loader'
        },
        {
          test: /\.(js|tag)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            formatter: stylish
          }
        },
        {
          test: /\.scss$/,
          use: cssLoaders(env)
        }
      ]
    },
    plugins: definePlugins(env)
  };
};
