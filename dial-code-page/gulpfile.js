let gulp = require('gulp');
let uglify = require('gulp-uglify');
let cleanCSS = require('gulp-clean-css');
let htmlmin = require('gulp-htmlmin');

gulp.task('compress', ['minify-css', 'minify-html', 'copy-static'], function () {
  return gulp.src('public/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', () => {
  return gulp.src('public/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-html', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-static', () => {
  gulp.src('public/assets/**/*').pipe(gulp.dest('dist/assets'));
  gulp.src('public/libs/**/*').pipe(gulp.dest('dist/libs'));
});