var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var glob = require('glob');

var src = [
  './src/honda',
  './src/js',
  './src/styles/sass',
  './src/styles/vendor'
];
var aliases = {};
var outputFilename = './aliases.json';

src.forEach(function (src) {
  glob.sync(src + '/**/*.*(js|jsx|tpl|handlebars|scss|json)', {}).forEach(function (file) {
    aliases[path.basename(file, path.extname(file))] = path.resolve(__dirname, '../', file);
  });
});

fs.writeFile(outputFilename, JSON.stringify(aliases, null, 4), function (err) {
  if (err) {
    gutil.log(gutil.colors.red(err));
  } else {
    gutil.log(gutil.colors.green.bold("Alias JSON saved to: " + outputFilename));
  }
});
