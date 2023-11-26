const {src, dest, watch} = require('gulp');

const sсss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;


function style() {
  return src('src/style/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(sсss({outputStyle: 'compressed'}))
    .pipe(dest('build/css'))
}

function scripts() {
  return src('src/js/index.js')
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(dest("build/js"))
}

function watching () {
  watch(['src/style/style.scss'], style)
  watch(['src/js/index.js'], scripts)
}



exports.style = style;
exports.scripts = scripts;
exports.watching = watching;