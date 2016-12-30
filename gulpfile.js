var connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	del = require('del'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	inject = require('gulp-inject'),
	runSequence = require('gulp-run-sequence'),
	concat = require('gulp-concat');

gulp.task('connect', function() {
	connect.server({
		port: 8000,
		livereload: true,
		root: ['build']
	});
});

gulp.task('index', function () {
	return gulp.src('index.html')
		.pipe(inject(gulp.src(['./build/js/vendor.js']), {addRootSlash: false, ignorePath: 'build', name: 'libs'}))
		.pipe(inject(gulp.src(['./build/js/app.js', './build/css/**/*.css'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('login', function () {
  return gulp.src('login.html')
  .pipe(inject(gulp.src(['./build/js/vendor.js']), {addRootSlash: false, ignorePath: 'build', name: 'libs'}))
  .pipe(inject(gulp.src(['./build/js/login.js', './build/css/**/*.css'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
  .pipe(gulp.dest('./build/'));
});

gulp.task('resource', function() {
	return gulp
		.src(['./**/*', '.*',
			'!**/*.ts', '!**/*.scss', '!bower.json', 
			'!build', '!build/**',
			'!db', '!db/**',
			'!js', '!js/**',
			'!node_modules', '!node_modules/**', 
			'!gulpfile.js', '!package.json', '!.git', '!.bowerrc', '!.gitignore'])
		.pipe(gulp.dest('./build/'));
});

gulp.task('api', function() {
	return gulp
		.src(['./php/**/*'])
		.pipe(gulp.dest('./build/php'));
});

gulp.task('libs', function() {
	return gulp
		.src(['js/libs/**/*.min.js', 
			'!js/libs/angular-material/modules', '!js/libs/angular-material/modules/**',
			'!js/libs/moment/min/locales.min.js', '!js/libs/moment/min/moment.min.js*',
			'!libs/moment-timezone/builds/moment-timezone-*'])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('vendor-index', function() {
	return gulp
		.src(['js/app/**/*.js', 'js/shared/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('vendor-login', function() {
	return gulp
		.src(['js/login/**/*.js', 'js/shared/**/*.js'])
		.pipe(concat('login.js'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('scripts', ['libs', 'vendor-index', 'vendor-login']);

gulp.task('css', function() {
	return gulp
		.src(['js/libs/angular-material/angular-material.min.css'])
		.pipe(gulp.dest('./build/css'));
});

gulp.task('clean', function() {
	return del('build');
});

gulp.task('sass', function() {
	return gulp.src('./css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/css/'));
});

gulp.task('serve', function() {
  runSequence('resource', 'scripts', 'css', 'sass', 'index', 'login', 'connect');
});

gulp.task('default', ['serve'], function() {
	gulp.watch(['./css/**/*.scss'], ['sass', 'index']);
	gulp.watch(['./include/*.html'], ['resource', 'index', 'login']);
	gulp.watch(['./js/login/**/*.js', './js/app/**/*.js', './js/shared/**/*.js', './js/libs/**/*.js'], ['scripts', 'index', 'login']);
    gulp.watch(['./js/libs'], ['libs', 'css', 'index', 'login']);
	gulp.watch(['./php/api.php'], ['api']);
});