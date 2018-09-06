'use strict';

var gulp = require('gulp');
var handlebars = require('gulp-hb');
var config = require('../config');

gulp.task('handlebars', function() {
    return gulp.src([
      config.paths.src.markup,
      '!' + config.paths.src.hbs.partials,
      '!' + config.paths.src.hbs.data,
      '!' + config.paths.src.hbs.helpers
    ])
    .pipe(handlebars({
        data: config.paths.src.hbs.data,
        helpers: config.paths.src.hbs.helpers,
        partials: config.paths.src.hbs.partials,
        bustCache: true
    }))
    .pipe(gulp.dest(config.paths.dist.staticHTML));
});
