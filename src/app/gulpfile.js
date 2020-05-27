const gulp = require('gulp')
const rename = require('gulp-rename')
const clean = require('gulp-clean')

// PhraseApp Configuration
const authToken = process.env.phrase_authToken;
const project = process.env.phrase_project;
const locale = process.env.phrase_locale;
const fileformat = process.env.phrase_fileformat;
const merge = process.env.phrase_merge;

gulp.task('update:index:file', () => {
  return gulp.src('./dist/index.html')
    .pipe(rename('index.ejs'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build-resource-bundles', (cb) => {
  exec('node ./node_modules/sunbird-resource-bundle/index.js '
  + ' -authToken="' + authToken
  + '" -project="' + project
  + '" -locale="' + locale
  + '" -merge="' + merge
  + '" -fileformat="' + fileformat + '"', function (err, stdout, stderr) {
    console.log(stdout);
    gulp.src(['./sunbirdresourcebundle/*.json'])
          .pipe(gulp.dest('./resourcebundles/json/'));
    gulp.src(['./sunbirdresourcebundle'], { read: false })
      .pipe(clean());
    console.log(stderr);
    cb(err);
  })
}) 