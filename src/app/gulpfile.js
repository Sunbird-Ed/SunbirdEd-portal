const gulp = require('gulp')
const download = require('gulp-download')
const decompress = require('gulp-decompress')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const gulpSequence = require('gulp-sequence')
const exec = require('child_process').exec

// To download editors
const contentEditor = 'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/artefacts/editor/content-editor-iframe-3.1.0.zip'
const collectionEditor = 'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/artefacts/editor/collection-editor-iframe-3.1.0.zip'
const genericEditor = 'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/artefacts/editor/generic-editor-iframe-3.1.0.zip'
const editorsDestPath = 'client/src/thirdparty/editors/'

gulp.task('clean:editors', () => {
  return gulp.src('./' + editorsDestPath, {read: false})
        .pipe(clean())
})
gulp.task('download:content:editor', () => {
  return download(contentEditor)
  .pipe(decompress())
  .pipe(gulp.dest(editorsDestPath + 'content-editor'))
})

gulp.task('download:collection:editor', () => {
  return download(collectionEditor)
  .pipe(decompress())
  .pipe(gulp.dest(editorsDestPath + 'collection-editor'))
})

gulp.task('download:generic:editor', () => {
  return download(genericEditor)
  .pipe(decompress())
  .pipe(gulp.dest(editorsDestPath + 'generic-editor'))
})

gulp.task('download:editors', gulpSequence('clean:editors', ['download:content:editor', 'download:collection:editor', 'download:generic:editor']))

gulp.task('clean:client:install', (done) => {
  return gulp.src('./client/node_modules', {read: false})
        .pipe(clean())
})

gulp.task('client:install', (cb) => {
  exec('npm install  --prefix ./client', function (err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
    cb(err)
  })
})

// To build anglar code and rename index file

gulp.task('client:dist', (cb) => {
  exec('npm run build --prefix ./client ', function (err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
    cb(err)
  })
})

gulp.task('update:index:file', () => {
  return gulp.src('./dist/index.html')
  .pipe(rename('index.ejs'))
  .pipe(gulp.dest('./dist'))
})
gulp.task('clean:index:file', () => {
  return gulp.src('./dist/index.html', {read: false})
        .pipe(clean())
})

gulp.task('prepare:app:dist', () => {
  return gulp.src(['dist/**/*',
    'libs/**/*',
    'helpers/**/*',
    'proxy/**/*',
    'resourcebundles/**/*',
    'themes/**/*',
    'package.json',
    'package-lock.json',
    'server.js'], { 'base': '.' })
        .pipe(gulp.dest('./app_dist'))
})

gulp.task('clean:app:dist', () => {
  return gulp.src('./app_dist', {read: false})
        .pipe(clean())
})

gulp.task('deploy',
  gulpSequence('clean:app:dist',
    'clean:editors',
    ['download:content:editor',
      'download:collection:editor',
      'download:generic:editor'],
    'clean:client:install',
    'client:install',
    'client:dist',
    'update:index:file',
    'clean:index:file',
    'prepare:app:dist')
)
