'use-strict';

/**
 * Global Gulp variables
 */

var path = require('path');

var srcFolder = path.resolve(process.cwd(), './src/');
var extSrcFolder = path.resolve(process.cwd(), './HTML/src/');
var dist = path.resolve(process.cwd(), './dist/');
var extDist = path.resolve(process.cwd(), './HTML/dist/');

/**
 * Handlebars source paths
 */
var hbs ={
  data: path.join(srcFolder, 'markup/data/**/*.{js,json}'),
  helpers: path.join(srcFolder, 'markup/helpers/**/*.js'),
  partials: path.join(srcFolder, 'markup/partials/**/*.{hbs,js}'),
};

/**
 * SVG source paths
 */
var svg = {
  systems: path.join(srcFolder, 'assets/svg/systems/'),
  vehicles: path.join(srcFolder, 'assets/svg/vehicles/'),
};

/**
 * All sourcepaths combined
 */
var src = {
  fonts: path.join(srcFolder, 'styles/fonts/'),
  icons: path.join(srcFolder, 'styles/fonts/'),
  images: path.join(srcFolder, 'assets/img/**/'),
  videos: path.join(srcFolder, 'assets/videos/'),
  markup: path.join(srcFolder, 'markup/**/*.html'),
  hbs: hbs,
  svg: svg
};

/**
 * Distribution source paths
 */
var dist = {
  base: dist,
  staticHTML: path.join(dist, 'static/'),
  css: path.join(dist, 'css/'),
  fonts: path.join(dist, 'fonts/'),
  icons: path.join(dist, 'icons/'),
  images: path.join(dist, 'img/'),
  videos: path.join(dist, 'videos/'),
  js: path.join(dist, 'js/')
};

/**
 * Jenkins source paths to be used during build
 */
var jenkins = {
  src: {
    fonts: src.fonts,
    icons: src.icons,
    images: src.images,
    videos: src.videos,
    css: dist.css,
    js: dist.js
  },
  dest: {
    fonts: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/fonts/',
    icons: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/icons/',
    images: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/img/',
    videos: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/videos/',
    css: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/css/',
    js: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/js/'
  }
};

/**
 * Sirecore source paths to be used during build
 */
var sitecore = {
  src: {
    fonts: path.join(extSrcFolder, 'styles/fonts/'),
    icons: path.join(extDist, 'icons/systems.svg'),
    images: path.join(extSrcFolder, 'assets/img/**/'),
    videos: path.join(extSrcFolder, 'assets/videos/'),
    css: path.join(extDist, 'css/'),
    js: path.join(extDist, 'js/')
  },
  dest: {
    fonts: '../Sitecore/Website/Areas/Honda_Automobiles/fonts/',
    icons: '../Sitecore/Website/Areas/Honda_Automobiles/icons/',
    images: '../Sitecore/Website/Areas/Honda_Automobiles/img/',
    videos: '../Sitecore/Website/Areas/Honda_Automobiles/videos/',
    css: '../Sitecore/Website/Areas/Honda_Automobiles/css/',
    js: '../Sitecore/Website/Areas/Honda_Automobiles/js/'
  }
};

/**
 * Extensions
 */
var extensions = {
  images: '*.{gif,jpg,jpeg,png}',
  icons: '*.svg',
  videos: '*.{mp4,mov,ogv,mpg}',
  html: '*.html',
  all720: '*.{html,jpg,jpeg,js,xml,swf}',
  js: '*.{js,map}',
  css: '*.{css,map}',
  fonts: '*.{ttf,woff2,woff,svg,eot}',
  sass: '*.{sass,scss}',
  hbs: '*.{js,html,hbs,json}'
}

/**
 * Configuration object exposed
 */
var config = {
  paths: {
    src: src,
    dist: dist,
    jenkins: jenkins,
    sitecore: sitecore
  },
  extensions: extensions
}

module.exports = config;
