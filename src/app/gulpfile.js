const gulp = require('gulp')
const rename = require('gulp-rename')


gulp.task('update:index:file', () => {
  return gulp.src('./dist/index.html')
    .pipe(rename('index.ejs'))
    .pipe(gulp.dest('./dist'))
})