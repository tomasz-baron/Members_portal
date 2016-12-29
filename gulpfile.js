var connect = require('gulp-connect');
var del = require('del');
var gulp = require('gulp');
var watch = require('gulp-watch');
var inject = require('gulp-inject');

gulp.task('connect', function() {
	connect.server({
		port: 8000,
		livereload: true,
		root: ['build']
	});
});

gulp.task('index', function () {
  return gulp.src('index.html').pipe(inject(gulp.src(['./js/**/*.js', './css/**/*.css'], {read: false}), {addRootSlash: false}))
    .pipe(gulp.dest('./build/'));
});

gulp.task('resource', function() {
	return gulp.src(['./**/*', '.*','!**/*.ts', '!**/*.scss', '!bower.json', 
    '!build', '!build/**',
    '!db', '!db/**',
    '!node_modules', '!node_modules/**', 
    '!gulpfile.js', '!package.json', '!.git', '!.bowerrc', '!.gitignore'])
		.pipe(gulp.dest('./build/'));
});

gulp.task('clearBuild', function() {
	return del('.build');
});

gulp.task('serve', ['connect', 'resource', 'index']);

gulp.task('default', ['serve'], function() {
	gulp.watch(['./include/*.html', './index.html', 'login.html'], ['resource', 'index']);
	gulp.watch(['./js/*.js', './js/**/*.js'], ['resource', 'index']);
    gulp.watch(['./php/api.php'], ['resource', 'index']);
});