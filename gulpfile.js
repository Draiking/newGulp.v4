const {src, dest, watch, parallel} = require('gulp');

const sсss = require('gulp-sass')(require('sass'));
const autoprefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const include = require('gulp-include');
const plumber = require('gulp-plumber');

function html() {
  return src('src/index.html')
    .pipe(dest('build'))
}

function pages() {
  return src('src/*.html')
    .pipe(include({
      includePaths: 'src/pages'
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

function style() {
  return src('src/style/style.scss')
    .pipe(plumber())
    .pipe(autoprefix({ overrideBrowweslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(sсss({outputStyle: 'compressed'}))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('src/js/index.js')
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(dest("build/js"))
    .pipe(browserSync.stream())
}

function fonts () {
  return src(['src/fonts/*.*'])
    .pipe(fonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src('src/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('build/fonts'))
}

function images() {
  return src(['src/images/*.*', '!src/images/*.svg'])
    .pipe(newer('build/images'))
    .pipe(avif({
      quality: 50
    }))
    .pipe(src('src/images/*.*'))
    .pipe(newer('build/images'))
    .pipe(webp())
    .pipe(src('src/images/*.*'))
    .pipe(newer('build/images'))
    .pipe(imagemin())
    .pipe(dest('build/images'))
}

function svg() {
  return src(['src/images/*.svg'])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('build/images'))
}

function watching () {
  browserSync.init({
    server: {
      baseDir: "build/"
    }
  });
  watch(['src/style/style.scss'], style);
  watch(['src/images/'], images);
  watch(['src/js/index.js'], scripts);
  watch(['src/pages/*', 'src/*.html'], pages);
  watch(['src/*.html']).on('change', browserSync.reload)
}

function cleanDist() {
  return src('build')
    .pipe(clean())
}


exports.html = html;
exports.images = images;
exports.svg = svg;
exports.fonts = fonts;
exports.style = style;
exports.scripts = scripts;
exports.watching = watching;
exports.pages = pages;

exports.clean = cleanDist 
exports.default = parallel(html,style,scripts,pages,watching);