const gulp = require('gulp')
const download = require("gulp-download")
const decompress = require('gulp-decompress')

const content_editor = 'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/artefacts/editor/content-editor-iframe-3.1.0.zip'
const collection_editor = 'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/artefacts/editor/collection-editor-iframe-3.1.0.zip'
const generic_editor = 'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/artefacts/editor/generic-editor-iframe-3.1.0.zip'

gulp.task('default', function () {
  console.log('Gulp download content editor task!')
  download(content_editor)
    .pipe(decompress())
    .pipe(gulp.dest('src/thirdparty/editors/content-editor'))

  download(collection_editor)
    .pipe(decompress())
    .pipe(gulp.dest('src/thirdparty/editors/collection-editor'))

  download(generic_editor)
    .pipe(decompress())
    .pipe(gulp.dest('src/thirdparty/editors/generic-editor'))
})

