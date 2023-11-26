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
const cached = require('gulp-cached');

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
    .pipe(avif({
      quality: 50
    }))
    .pipe(src('src/images/*.*'))
    .pipe(webp())
    .pipe(src('src/images/*.*'))
    .pipe(imagemin())
    .pipe(dest('build/images'))
}

function watching () {
  browserSync.init({
    server: {
      baseDir: "src/"
    }
  });
  watch(['src/style/style.scss'], style);
  watch(['src/js/index.js'], scripts);
  watch(['src/**/*.html']).on('change', browserSync.reload)
}

function building () {
  return src([
    'src/style/style.scss',
    'src/index.html',
    'src/js/index.js',
  ], {base: 'src'})
    .pipe(dest('build'))
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

exports.build = series(cleanDist, building )
exports.default = parallel(html,style,scripts,watching);