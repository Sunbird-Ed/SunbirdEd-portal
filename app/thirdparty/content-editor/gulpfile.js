var gulp = require('gulp');
var inject = require('gulp-inject');
var CacheBuster = require('gulp-cachebust');
var merge = require('merge-stream');
var promise = require("any-promise/register")("bluebird");

var cachebust = new CacheBuster();

gulp.task('renameminifiedfiles', function() {
    var js =  gulp.src('scripts/*.min.js')
        .pipe(cachebust.resources())
        .pipe(gulp.dest('scripts/'));
    var css = gulp.src('styles/*.min.css')
        .pipe(cachebust.resources())
        .pipe(gulp.dest('styles/'));
    return merge(js, css);
});

gulp.task('injectrenamedfiles', function() {
    var target = gulp.src('index.html');
    var sources = gulp.src(['scripts/*.min.*.js', 'styles/*.min.*.css'], { read: false });
    return target
        .pipe(inject(sources, { ignorePath: '/', addRootSlash: false }))
        .pipe(gulp.dest('./'));
});