var connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	del = require('del'),
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	inject = require('gulp-inject'),
	minify = require('gulp-minify'),
	runSequence = require('gulp-run-sequence'),
	bowerFiles = require('main-bower-files');

gulp.task('connect', function() {
	connect.server({
		port: 8000,
		livereload: true,
		root: ['build']
	});
});

gulp.task('index', function () {
  return gulp.src('index.html')
  .pipe(inject(gulp.src(bowerFiles('**/*.min.js'), {read: false}), {name: 'libs'}))
  //.pipe(inject(gulp.src('./build/js/libs/**/*.js', {read: false}), {addRootSlash: false, ignorePath: 'build', name: 'libs'}))
  .pipe(inject(gulp.src(['./js/shared/**/*.js', './js/app/**/*.js', './build/css/**/*.css', './libs/angular-material/angular-material.min.css'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
  .pipe(gulp.dest('./build/'));
});

gulp.task('login', function () {
  return gulp.src('login.html')
  .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'libs'}))
  //.pipe(inject(gulp.src('./build/js/libs/**/*.js', {read: false}), {addRootSlash: false, ignorePath: 'build', name: 'libs'}))
  .pipe(inject(gulp.src(['./js/login/**/*.js', './js/shared/**/*.js', './build/css/**/*.css', './libs/angular-material/angular-material.min.css'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
  .pipe(gulp.dest('./build/'));
});

gulp.task('resource', function() {
	return gulp
		.src(['./**/*', '.*',
			'!**/*.ts', '!**/*.scss', '!bower.json', 
			'!build', '!build/**',
			'!db', '!db/**',
			'!libs', '!libs/**',
			'!node_modules', '!node_modules/**', 
			'!gulpfile.js', '!package.json', '!.git', '!.bowerrc', '!.gitignore'])
		.pipe(gulp.dest('./build/'));
});

gulp.task('libs', function() {
	return gulp
		.src(['libs/**/*.min.js', 
			'!libs/angular-material/modules', '!libs/angular-material/modules/**',
			'!libs/moment/min/locales.min.js', '!libs/moment/min/moment.min.js*',
			'!libs/moment-timezone/builds/moment-timezone-*'])
		.pipe(gulp.dest('./build/js/libs'));
});

gulp.task('css', function() {
	return gulp
		.src(['libs/angular-material/angular-material.min.css'])
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

gulp.task('compress', function() {
  gulp.src('./js/**/*.js')
    .pipe(minify({
        ext:{
			src:'-debug.js',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['*.combo.js', '*.min.js']
    }))
    .pipe(gulp.dest('package'))
});

gulp.task('serve', function() {
  runSequence('resource', 'css', 'sass', 'index', 'login', 'connect');
});

gulp.task('default', ['serve'], function() {
	gulp.watch(['./css/**/*.scss'], ['sass', 'index']);
	gulp.watch(['./include/*.html'], ['resource', 'index', 'login']);
	gulp.watch(['./js/login/**/*.js', './js/app/**/*.js', './js/shared/**/*.js', './js/libs/**/*.js'], ['resource', 'index', 'login']);
    gulp.watch(['./libs'], ['libs', 'css', 'index', 'login']);
});