var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('css', function() {
  return gulp.src(['./src/SCSS/app.scss'])
    .pipe(concat('app.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('stream', function() {
    return watch('./src/SCSS/app.scss', function() {
      gulp.src(['./src/SCSS/app.scss'])
        .pipe(concat('app.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(uglifycss())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./public/css'));
    });
});
