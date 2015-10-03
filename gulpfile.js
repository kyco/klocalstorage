var gulp       = require('gulp');
var beep       = require('beepbeep');
var gutil      = require('gulp-util');
var plumber    = require('gulp-plumber');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var sass       = require('gulp-ruby-sass');
var rename     = require('gulp-rename');
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
    // './bower_components/jsoneditor/dist/jsoneditor.min.js',
    './src/app.js'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(concat('klocalstorage.min.js'))
  .pipe(gulp.dest('./dist'))
  .pipe(uglify({
    compress: false
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(livereload());
});

// JS
gulp.task('concatjs', function() {
  return gulp.src([
    // './bower_components/jsoneditor/dist/jsoneditor.min.js',
    './src/app.js'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(concat('klocalstorage.js'))
  .pipe(gulp.dest('./dist'))
  .pipe(livereload());
});

// Sass
gulp.task('sass-dev', function() {
  return gulp.src([
    './src/app.scss'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(sass({
    style: 'expanded',
    cacheLocation: './cache/.sass-cache'
  }))
  .pipe(rename('klocalstorage.css'))
  .pipe(gulp.dest('./dist/'))
  .pipe(livereload());
});

gulp.task('sass-prod', function() {
  return gulp.src([
    './src/app.scss'
  ])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(sass({
    style: 'compressed',
    cacheLocation: './cache/.sass-cache'
  }))
  .pipe(rename('klocalstorage.min.css'))
  .pipe(gulp.dest('./dist/'))
  .pipe(livereload());
});

// HTML
gulp.task('html', function() {
  return gulp.src([
    './src/home.html'
  ])
  .pipe(livereload());
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////
//////////     WATCH AND BUILD TASKS
//////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Primary task to watch other tasks
gulp.task('dev', function() {
  // LiveReload
  livereload.listen();

  // Watch JS
  gulp.watch('./src/app.js', ['concatjs']);

  // Watch Sass
  gulp.watch(['./src/app.scss'], ['sass-dev']);

  // Watch HTML and livereload
  gulp.watch('./src/home.html', ['html']);
});

gulp.task('build', ['concatjs', 'uglifyjs', 'sass-dev', 'sass-prod'], function() {
    process.exit();
});
