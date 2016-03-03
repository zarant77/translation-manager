var gulp = require('gulp');
var babel = require('gulp-babel');
var builder = require('gulp-node-webkit-builder');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

var del = require('del');
var fs = require('fs');

const DIR_SRC = 'src';
const DIR_DIST = 'dist';

gulp.task('clean', function () {
    return del([DIR_DIST]);
});

gulp.task('install', function (done) {
    if (!fs.existsSync(DIR_DIST + '/node_modules')) {
        require('child_process').exec('npm install --production', {cwd: './' + DIR_DIST});
    }
    done();
});

gulp.task('copy-sources', function () {
    return gulp.src([
        DIR_SRC + '/index.html',
        DIR_SRC + '/favicon.png',
        DIR_SRC + '/package.json'
    ]).pipe(gulp.dest(DIR_DIST));
});

gulp.task('copy-img', function () {
    return gulp.src([
        DIR_SRC + '/vendor/x-editable/dist/bootstrap3-editable/img/**/*'
    ]).pipe(gulp.dest(DIR_DIST + '/img'));
});

gulp.task('copy-flags', function () {
    return gulp.src(DIR_SRC + '/vendor/flag-icon-css/flags/**/*').pipe(gulp.dest(DIR_DIST + '/flags'));
});

gulp.task('copy-fonts', function () {
    return gulp.src(DIR_SRC + '/vendor/bootstrap/fonts/*.*').pipe(gulp.dest(DIR_DIST + '/fonts'));
});

gulp.task('copy', gulp.parallel('copy-sources', 'copy-img', 'copy-flags', 'copy-fonts'));

gulp.task('less', function () {
    return gulp.src(DIR_SRC + '/css/main.less')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(gulp.dest(DIR_DIST + '/css'));
});

gulp.task('js', function () {
    return gulp.src([
            DIR_SRC + '/vendor/jquery/dist/jquery.min.js',
            DIR_SRC + '/vendor/jquery-storage-api/jquery.storageapi.min.js',
            DIR_SRC + '/vendor/bootstrap/dist/js/bootstrap.min.js',
            DIR_SRC + '/vendor/bootstrap-select/dist/js/bootstrap-select.min.js',
            DIR_SRC + '/vendor/lodash/dist/lodash.min.js',
            DIR_SRC + '/vendor/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js',
            DIR_SRC + '/vendor/noty/js/noty/packaged/jquery.noty.packaged.min.js',
            DIR_SRC + '/vendor/react/react.js',
            DIR_SRC + '/vendor/react/react-dom.js'
        ])
        .pipe(concat('libs.js', {newLine: ';\n\n'}))
        .pipe(gulp.dest(DIR_DIST + '/js'));
});

gulp.task('babel', function () {
    return gulp.src([
            DIR_SRC + '/js/controllers/*.js',
            DIR_SRC + '/js/components/*.js',
            DIR_SRC + '/js/react-components/*.js',
            DIR_SRC + '/js/main.js'
        ])
        .pipe(babel({
            presets: ['react']
        }))
        .pipe(concat('app.js', {newLine: ';\n\n'}))
        .pipe(gulp.dest(DIR_DIST + '/js'));
});

gulp.task('build', function () {
    return gulp.src(['dist/**/*'])
        .pipe(builder({
            version: 'v0.12.3',
            platforms: ['linux32', 'linux64', 'win32', 'win64', 'osx32', 'osx64']
        }));
});

gulp.task('dist', gulp.series('clean', gulp.parallel('copy', 'js', 'babel', 'less')));

gulp.task('default', gulp.series('dist', 'build'));
