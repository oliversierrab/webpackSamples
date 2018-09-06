// Dependencies
var webpack = require('webpack');
var path = require('path');
var stylish = require('eslint/lib/formatters/stylish');
var fs = require('fs');

// Config File
var config = require('./config.js');
var autoPrefixer = require('autoprefixer')(config.autoprefixer);

// Plugins
var SassLintPlugin = require('sasslint-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var entryConfig = {};
var dllManifest = require(path.resolve(process.cwd(), config.dll.src));

// Aliases
var merge = require('lodash.merge');
var sourceAliases = require(path.resolve(process.cwd(), 'aliases.json'));
var otherAliases = {
  '../img': path.resolve(process.cwd(), './src/assets/img'),
  '../videos': path.resolve(process.cwd(), './src/assets/videos'),
  legacy: path.resolve(process.cwd(), './src/js'),
  honda: path.resolve(process.cwd(), './src/honda'),
  tagfiles: path.resolve(process.cwd(), './src/components/tagfiles'),
  variables: '@ui/rzf-components-core-ui/shared/scripts/_variables'
};

var aliases = merge(sourceAliases, otherAliases);
// Main Styles
entryConfig.main = config.entries.main;

// Vendor styles
entryConfig.vendorStyles = config.entries.vendorStyles;

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

function getPageEntries() {
  var folderPath = path.join(process.cwd(), 'src', 'pages');
  var pagesFolder = fs.readdirSync(folderPath);
  var pages = [];

  pagesFolder.forEach(function(filename) {
    var filePath = path.join(folderPath, filename);
    var stats = fs.lstatSync(filePath);
    var subFolder;

    if (stats.isDirectory()) {
      subFolder = fs.readdirSync(filePath);

      subFolder.forEach(function(entry) {
        pages.push({
          filename: filename + '.html',
          template: path.join(filePath, entry)
        });
      });
    }
  });

  return pages;
}

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

  var pageEntries = getPageEntries();

  var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
  });

  pageEntries.forEach(function(pageEntry) {
    plugins.push(new HtmlWebpackPlugin({
      filename: pageEntry.filename,
      inject: false,
      template: pageEntry.template
    }));
  });

  plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: false,
    template: path.join(process.cwd(), 'src', 'pages', 'home.html')
  }));

  plugins.push(providePlugin);
  plugins.push(definePlugin);

  if (!environment.nocsslint) {
    plugins.push(sassLintPlugin);
  }

  plugins.push(loaderOptionsPlugin);
  plugins.push(dllReferencePlugin);
  plugins.push(commonsChunkPlugin);

  return plugins;
}

function cssLoaders(env) {
  var environment = env || {};
  var sourceMaps = !!environment.nocss;
  var minimize = !!environment.nocss;

  return [{
      loader: 'style-loader'
    },
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
  ];
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
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval',
    module: {
      rules: [{
          test: /\.tag$/,
          loader: 'riot-tag-loader'
        },
        {
          test: /\.(js|tag)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            formatter: stylish,
            ext: '.tag,.js'
          }
        },
        {
          test: /\.scss$/,
          use: cssLoaders(env)
        },
        {
          test: /vissense/,
          loader: 'exports-loader?VisSense!script-loader'
        }
      ]
    },
    plugins: definePlugins(env),
    devServer: {
      historyApiFallback: {
        index: '/webpack-dev-server/',
        rewrites: [{
            from: '/civic-sedan',
            to: '/vlp.html'
          },
          {
            from: '/civic-coupe',
            to: '/vlp.html'
          },
          {
            from: '/ridgeline',
            to: '/ridgeline.html'
          }
        ]
      },
      contentBase: [path.resolve(process.cwd(), 'dist'), path.resolve(process.cwd(), 'cache')],
      compress: false,
      port: 8080,
      host: '0.0.0.0',
      proxy: {
        '/-/media/*': {
          target: config.proxyUrl,
          changeOrigin: true
        },
        '/Areas/*': {
          target: config.proxyUrl,
          changeOrigin: true
        },
        '/fonts/*': {
          target: config.proxyUrl,
          pathRewrite: {
            '/fonts/': '/Areas/Honda_Automobiles/fonts/'
          },
          changeOrigin: true
        },
        '/Honda_Automobiles/SortVehicleCards/*': {
          target: config.proxyUrl,
          changeOrigin: true
        },
        '/platform/*': {
          target: config.proxyUrl,
          changeOrigin: true
        }
      },
      clientLogLevel: 'info',
      quiet: false
    }
  };
};
