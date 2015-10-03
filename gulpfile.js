var gulp       = require('gulp');
var beep       = require('beepbeep');
var gutil      = require('gulp-util');
var plumber    = require('gulp-plumber');
var uglify     = require('gulp-uglifyjs');
var concat     = require('gulp-concat');
var sass       = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');

var onError = function (err) {
  beep([0, 0, 0]);
  gutil.log(gutil.colors.green(err));
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
//////////     WEBSITE TASKS
//////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// JS
gulp.task('uglifyjs', function() {
  return gulp.src([
    './jsoneditor.min.js',
    './localstorage-browser.js'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(uglify('app.js', {
    compress: false
  }))
  .pipe(gulp.dest('./'))
  .pipe(livereload());
});

// JS
gulp.task('concat', function() {
  return gulp.src([
    './jsoneditor.min.js',
    './localstorage-browser.js'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./'));
});

// Sass
gulp.task('sass', function() {
  return gulp.src([
    './localstorage-browser.scss'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(sass({
    style: 'compressed',
    cacheLocation: './cache/.sass-cache'
  }))
  .pipe(gulp.dest('./'))
  .pipe(livereload());
});

// HTML
gulp.task('html', function() {
  return gulp.src([
    './home.html'
  ])
  .pipe(livereload());
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
//////////     WATCH AND BUILD TASKS
//////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Primary task to watch other tasks
gulp.task('yo', function() {
  // LiveReload
  livereload.listen();

  // Watch JS
  gulp.watch('./localstorage-browser.js', ['uglifyjs']);
  // gulp.watch('./localstorage-browser.js', ['concat']);

  // Watch Sass
  gulp.watch(['./localstorage-browser.scss'], ['sass']);

  // Watch HTML and livereload
  gulp.watch('./home.html', ['html']);
});
