(function() {
  'use strict';

  var gulp = require('gulp');
  var sequence = require('run-sequence');
  var config = require('../config');

  gulp.task('copy:jenkins', function(callback) {
    sequence([
      'copy:jenkins:fonts',
      'copy:jenkins:icons',
      'copy:jenkins:images',
      'copy:jenkins:videos',
      'copy:jenkins:css',
      'copy:jenkins:js'
    ], callback);
  });

  gulp.task('copy:jenkins:fonts', function() {
    return gulp.src(config.paths.jenkins.src.fonts + config.extensions.fonts).
        pipe(gulp.dest(config.paths.jenkins.dest.fonts));
  });

  gulp.task('copy:jenkins:icons', function() {
    return gulp.src(config.paths.jenkins.src.icons + config.extensions.icons).
        pipe(gulp.dest(config.paths.jenkins.dest.icons));
  });

  gulp.task('copy:jenkins:images', function() {
    return gulp.src(config.paths.jenkins.src.images + config.extensions.images).
        pipe(gulp.dest(config.paths.jenkins.dest.images));
  });

  gulp.task('copy:jenkins:videos', function() {
    return gulp.src(config.paths.jenkins.src.videos + config.extensions.videos).
        pipe(gulp.dest(config.paths.jenkins.dest.videos));
  });

  gulp.task('copy:jenkins:css', function() {
    return gulp.src([config.paths.jenkins.src.css + config.extensions.css,
      '!' + config.paths.jenkins.src.css + 'vendor-styles.min.*',
      '!' + config.paths.jenkins.src.css + 'styleguide.min.*']).
        pipe(gulp.dest(config.paths.jenkins.dest.css));
  });

  gulp.task('copy:jenkins:js', function() {
    return gulp.src([config.paths.jenkins.src.js + config.extensions.js,
      '!' + config.paths.jenkins.src.js + 'vendor-styles.min.*',
      '!' + config.paths.jenkins.src.js + 'styleguide.min.*']).
        pipe(gulp.dest(config.paths.jenkins.dest.js));
  });
})();
