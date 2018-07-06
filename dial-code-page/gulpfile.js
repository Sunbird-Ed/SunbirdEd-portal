let gulp = require('gulp');
let uglify = require('gulp-uglify');
let cleanCSS = require('gulp-clean-css');
let htmlmin = require('gulp-htmlmin');
let config = require('./config.js');
let inject = require('gulp-inject');

gulp.task('compress', ['minify-css', 'minify-html', 'copy-static'], function () {
  return gulp.src('public/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', () => {
  return gulp.src('public/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-html', function () {
  return gulp.src('index.html')
    .pipe(inject(gulp.src(['config.js']), { // inject config
      starttag: '<!-- inject:js -->',
      transform: function (filePath, file) {
        var configScript = 'window.__dial_page_config ='
        if (process.env.NODE_ENV === 'development') {
          return '<script>'+configScript + JSON.stringify(config.development) + '</script>';
        } else if (process.env.NODE_ENV === 'staging') {
          return '<script>'+configScript + JSON.stringify(config.staging) + '</script>';
        } else if (process.env.NODE_ENV === 'production') {
          return '<script>'+configScript + JSON.stringify(config.production) + '</script>';
        }
      }
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-static', () => {
  gulp.src('public/assets/**/*').pipe(gulp.dest('dist/assets'));
  gulp.src('public/libs/**/*').pipe(gulp.dest('dist/libs'));
});