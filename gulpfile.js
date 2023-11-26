const {src, dest} = require('gulp');

const sсss = require('gulp-sass')(require('sass'));


function style() {
  return src('src/style/style.scss')
    .pipe(sсss())
    .pipe(dest('build/css'))
}

exports.style = style