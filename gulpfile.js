const {src, dest} = require('gulp');

const sсss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');


function style() {
  return src('src/style/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(sсss({outputStyle: 'compressed'}))
    .pipe(dest('build/css'))
}

exports.style = style