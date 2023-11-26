const {src, dest, watch, parallel, series} = require('gulp');

const sсss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

function html() {
  return src('src/index.html')
    .pipe(dest('build'))
}

function style() {
  return src('src/style/style.scss')
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

function watching () {
  watch(['src/style/style.scss'], style);
  watch(['src/js/index.js'], scripts);
  watch(['src/**/*.html']).on('change', browserSync.reload)
}

function building () {
  return src([
    'src/style/style.scss',
    'src/index.html',
    'src/js/index.js'
  ], {base: 'src'})
    .pipe(dest('build'))
}

function cleanDist() {
  return src('build')
    .pipe(clean())
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/"
    }
  })
}

exports.html = html;
exports.style = style;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building )
exports.default = parallel(html,style,scripts,browsersync,watching);