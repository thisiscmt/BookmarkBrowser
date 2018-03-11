var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('del');
var ngAnnotate = require('gulp-ng-annotate');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var newer = require('gulp-newer');
var environments = require('gulp-environments');
var gulpIf = require('gulp-if');
var htmlReplace = require('gulp-html-replace');
var uncache = require('gulp-uncache');
var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');

var development = environments.development;
var production = environments.production;
var gulpconfig = require('./buildConfig/gulpconfig');
var loadDate = new Date();

var reportDelta = function (taskName) {
    var endDate = new Date();
    var delta = Math.abs(loadDate - endDate) / 1000;

    console.log('---------------------------------------');
    console.log('TASK: ' + taskName + ' completed after ' + delta + ' seconds.');
    console.log('---------------------------------------');
};

// Clean
gulp.task('clean', function (callback) {
    var delGlobs = _.union(gulpconfig.buildGlobs.clean, gulpconfig.releaseGlobs.clean);

    del(delGlobs, function () {
        reportDelta('clean');
        callback();
    });
});

// Build
gulp.task('copy-scripts', function () {
    return gulp.src(gulpconfig.sourceGlobs.scripts)
        .pipe(ngAnnotate())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(ignore.exclude(function (file) {
            return _.endsWith(file.path, '.spec.js');
        }))
        .pipe(development(sourcemaps.init()))
        .pipe(concat({ path: 'index.js', cwd: '' }))
        .pipe(production(uglify()))
        .pipe(development(sourcemaps.write('./')))
        .pipe(gulp.dest(gulpconfig.buildDirectory));
});

gulp.task('copy-styles', function () {
    return gulp.src(gulpconfig.sourceGlobs.styles)
        .pipe(less('src/index.less'))
        .pipe(production(cleanCSS({compatibility: '*'})))
        .pipe(gulp.dest(gulpconfig.buildDirectory));
});

gulp.task('copy-vendor-scripts', function () {
    return gulp.src(gulpconfig.vendorScripts)
        .pipe(newer(gulpconfig.buildDirectory + '/vendor.js'))
        .pipe(ngAnnotate())
        .pipe(development(sourcemaps.init()))
        .pipe(concat('vendor.js'))
        .pipe(production(uglify()))
        .pipe(development(sourcemaps.write('./')))
        .pipe(gulp.dest(gulpconfig.buildDirectory));
});

gulp.task('copy-vendor-styles', function () {
    return gulp.src(gulpconfig.vendorCSS)
        .pipe(gulp.dest(gulpconfig.buildDirectory));
});

gulp.task('copy-images', function () {
    return gulp.src(gulpconfig.sourceGlobs.images)
        .pipe(gulp.dest(gulpconfig.buildImagesDirectory));
});

gulp.task('copy-templates', function () {
    var templateCacheOptions = {
        module: 'bookmarkBrowser.templates',
        standalone: true
    };

    return gulp.src(gulpconfig.sourceGlobs.templates)
        .pipe(templateCache('index.tpl.js', templateCacheOptions))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(gulpconfig.buildDirectory));
});

gulp.task('update-index', function () {
    return gulp.src(['./src/index.html'])
        .pipe(uncache({
            append: 'time',
            rename: false
        }))
        .pipe(gulp.dest(gulpconfig.buildDirectory));
});

gulp.task('build', [
    'copy-scripts',
    'copy-styles',
    'copy-vendor-scripts',
    'copy-vendor-styles',
    'copy-images',
    'copy-templates',
    'update-index'
], function (cb) {
    reportDelta('build');
    cb();
});

// Serve
gulp.task('serve-application', function () {
    connect.server({
        root: gulpconfig.buildDirectory,
        livereload: true,
        fallback: 'build/index.html',
        port: 4001
    });
});

gulp.task('httpreload', function () {
    gulp.src(gulpconfig.buildDirectory + '/*.*')
      .pipe(gulp.dest(gulpconfig.buildDirectory))
      .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(gulpconfig.buildDirectory, ['httpreload']);
});

gulp.task('serve', ['serve-application'], function (cb) {
    cb();
});

// Release
gulp.task('copy-release-files', function () {
    var stream = gulp.src(gulpconfig.buildGlobs.all)
        .pipe(gulp.dest(gulpconfig.releaseDirectory));

    return stream;
});

gulp.task('release', function (cb) {
    reportDelta('clean');
    cb();
});


gulp.task('default', ['build'], function (cb) {
    cb();
});


