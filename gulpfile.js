const {src, dest, watch, parallel, series} = require('gulp');

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

function html() {
  return src('src/index.html')
    .pipe(dest('build'))
}

function style() {
  return src('src/style/style.scss')
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

function () {
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
      baseDir: "src/"
    }
  });
  watch(['src/style/style.scss'], style);
  watch(['src/images/'], images);
  watch(['src/js/index.js'], scripts);
  watch(['src/**/*.html']).on('change', browserSync.reload)
}

function cleanDist() {
  return src('build')
    .pipe(clean())
}


exports.html = html;
exports.images = images;
exports.style = style;
exports.scripts = scripts;
exports.watching = watching;

exports.clean = cleanDist 
exports.default = parallel(html,style,scripts,watching);