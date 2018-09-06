'use strict';

var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var folders = require('gulp-folders');
var config = require('../config');
var runSequence = require('run-sequence');


gulp.task('svg', function() {
  runSequence(
      'svg:systems',
      'svg:vehicles'
  );
});

gulp.task('svg:systems', function() {
  return gulp
    .src(config.paths.src.svg.systems + config.extensions.icons)
    .pipe(svgmin(function(file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      };
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(config.paths.dist.icons));
});


gulp.task('svg:vehicles', folders(config.paths.src.svg.vehicles, function(folder) {
    //This will loop over all folders inside assets/vehicle folder
    //Return stream so gulp-folders can process each of their files
    //so you still can use safely use gulp multitasking
    return gulp.src(path.join(config.paths.src.svg.vehicles, folder, config.extensions.icons))
        .pipe(svgmin(function(folder) {
          var prefix = path.basename(folder.relative, path.extname(folder.relative));
          return {
            plugins: [{
              cleanupIDs: {
                prefix: prefix + '-',
                minify: true
              }
            }]
          };
        }))
        .pipe(svgstore())
        .pipe(gulp.dest(config.paths.dist.icons));
}));
