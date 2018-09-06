// We create a dll automatically after the install
// (using the npm postinstall hook).

// The dll includes the vendor js files that are probably
// not going to change much during development. These dll are
// placed as a cache (on /cache) and webpack just includes
// them without having to do any analysis or processing.

var path = require('path');
var webpack = require('webpack');
var config = require('./config.js');

module.exports = {
  entry: {
    vendor: config.dependencies
  },
  // [name is replaced with "dll" in all these cases]
  output: {
    filename: '[name].min.js',
    library: '[name]',
    path: path.resolve(process.cwd(), config.dll.build)
  },
  module: {
    rules: [
      {
        test: /(behaviors|components|containers|vendor)\/[\w.-]*\.js$/,
        use: ['script-loader']
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(process.cwd(), '.'),
      'node_modules',
      '@ui/rzf-components-core-ui/shared' // we have transitive dependencies that we have
                                          // deal this way
    ],
    alias: {
      '../img': path.resolve(process.cwd(), './src/assets/img'),
      legacy: path.resolve(process.cwd(), './src/js'),
      honda: path.resolve(process.cwd(), './src/honda'),
      tagfiles: path.resolve(process.cwd(), './src/components/tagfiles'),
      variables: '@ui/rzf-components-core-ui/shared/scripts/_variables'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    }),
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(process.cwd(), config.dll.build, '[name].json')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ]
};
