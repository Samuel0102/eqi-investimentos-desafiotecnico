const {src, dest, watch, series} = require('gulp');
const concat = require('gulp-concat');
const js = require('gulp-terser');
const uglifyCss = require('gulp-uglifycss');
const minifyHtml = require('gulp-htmlmin');

function javascript(){
    return src('./src/**/*.js')
    .pipe(concat('main.js'))
    .pipe(js())
    .pipe(dest('./dist'));
}

function css(){
    return src(['./src/style.css', './src/**/*.css'])
    .pipe(concat('main.css'))
    .pipe(uglifyCss())
    .pipe(dest('./dist'))
}

function html(){
    return src('./src/**/*.html')
    .pipe(minifyHtml({collapseWhitespace: true}))
    .pipe(dest('./dist'))
}

exports.build = series(javascript, css, html)
exports.default = function(){
    watch('./src/**/*.js', javascript);
    watch('./src/**/*.css', css);
    watch('./src/**/*.html', html);
}