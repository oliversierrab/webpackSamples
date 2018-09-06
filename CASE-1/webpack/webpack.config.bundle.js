// Dependencies
var webpack = require('webpack');
var path = require('path');
var stylish = require('eslint/lib/formatters/stylish');

// Config File
var config = require('./config.js');
var autoPrefixer = require('autoprefixer')(config.autoprefixer);

// Plugins
var SassLintPlugin = require('sasslint-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var entryConfig = {};
var dllManifest = require(path.resolve(process.cwd(), config.dll.src));

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Main Styles
entryConfig.main = config.entries.main;

// Vendor styles
entryConfig.vendorStyles = config.entries.vendorStyles;

// Tools
entryConfig['tools-dealer-locator'] = config.entries.dealerLocator;
entryConfig['tools-inventory'] = config.entries.inventory;
entryConfig['tools-offers'] = config.entries.offers;
entryConfig['tools-payment-estimator'] = config.entries.paymentEstimator;
entryConfig['tools-request-a-quote'] = config.entries.raq;
entryConfig['tools-compare'] = config.entries.compare;

// BAP
entryConfig.bap = config.entries.bap;

// Pages
entryConfig.page404 = config.entries.page404;

// Aliases
var merge = require('lodash.merge');
var source_aliases = require(path.resolve(process.cwd(), 'aliases.json'));
var other_aliases = {
  '../img': path.resolve(process.cwd(), './src/assets/img'),
  legacy: path.resolve(process.cwd(), './src/js'),
  honda: path.resolve(process.cwd(), './src/honda'),
  tagfiles: path.resolve(process.cwd(), './src/components/tagfiles'),
  variables: '@ui/rzf-components-core-ui/shared/scripts/_variables'
};

var aliases = merge(source_aliases, other_aliases);

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

  var htmlWebpackPluginIndex = new HtmlWebpackPlugin({ // HOME
    filename: 'index.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/home.html')
  });

  var htmlWebpackPluginVlp = new HtmlWebpackPlugin({ // VLP
    filename: 'vlp.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/vlp.html')
  });

  var htmlWebpackPluginFuture = new HtmlWebpackPlugin({ // Future Vehicles
    filename: 'future-cars.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/future-cars.html')
  });

  var htmlWebpackPluginNVP = new HtmlWebpackPlugin({ // NVP
    filename: 'nvp.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/nvp.html')
  });

  var htmlWebpackPluginRidgeline = new HtmlWebpackPlugin({ // RIDGELINE
    filename: 'ridgeline.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/ridgeline.html')
  });

  var htmlWebpackPluginFamily = new HtmlWebpackPlugin({ // FAMILY
    filename: 'family.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/family.html')
  });

  var htmlWebpackPluginVehicles = new HtmlWebpackPlugin({ // Vehicles
    filename: 'vehicles.html',
    inject: false,
    template: path.resolve(process.cwd(), './src/pages/vehicles.html')
  });

  plugins.push(providePlugin);
  plugins.push(definePlugin);

  if (!environment.nocsslint) {
    plugins.push(sassLintPlugin);
  }

  plugins.push(loaderOptionsPlugin);
  plugins.push(dllReferencePlugin);
  plugins.push(htmlWebpackPluginIndex);
  plugins.push(htmlWebpackPluginFuture);
  plugins.push(htmlWebpackPluginVlp);
  plugins.push(htmlWebpackPluginRidgeline);
  plugins.push(htmlWebpackPluginNVP);
  plugins.push(htmlWebpackPluginFamily);
  plugins.push(htmlWebpackPluginVehicles);
  plugins.push(new BundleAnalyzerPlugin());

  return plugins;
}

function cssLoaders(env) {
  var environment = env || {};
  var sourceMaps = !!environment.nocss;
  var minimize = !!environment.nocss;

  return [
    {
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
    externals: {
      jquery: 'jQuery'
    },
    // We might want to use a source map strategy that doesn't expose the original
    // source files (with our comments, etc) but the transformed files
    // more info: https://webpack.js.org/configuration/devtool/#devtool
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval',
    module: {
      rules: [
        {
          test: /\.tag$/,
          enforce: 'pre',
          loader: 'riot-tag-loader'
        },
        {
          test: /\.(js|tag)$/,
          loader: 'eslint-loader',
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
    plugins: definePlugins(env),
    devServer: {
      historyApiFallback: {
        index: '/webpack-dev-server/',
        rewrites: [
          {
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
      compress: true,
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
