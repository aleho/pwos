/* jshint node: true, esnext: true */
'use strict';

const concat     = require('gulp-concat');
const gulp       = require('gulp');
const gulpIf     = require('gulp-if');
const log        = require('fancy-log');
const replace    = require('gulp-replace');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglifyEs   = require('gulp-uglifyes');
const uglifyCss  = require('gulp-uglifycss');
const vars       = require('./src/js/vars.js');


const SRC     = 'src/';
const DIST    = 'dist/';
const JS_OUT  = DIST + 'js/';
const CSS_OUT = DIST + 'css/';
const TASKS   = [];
const WATCHES = {};

const JS_FILES = {
    'index': [
        SRC + 'js/vars.js',
        SRC + 'js/scrollmonitor.js',
        SRC + 'js/titletouch.js',
        SRC + 'js/database.js',
        SRC + 'js/table.js',
        SRC + 'js/pwos.js',
    ],
};

const CSS_FILES = {
    'index': [
        'node_modules/animate.css/animate.css',
        SRC + 'sass/index.sass',
    ],
};

const HTML_FILES = {
    'index': [
        SRC + 'index.html',
    ],
}


const OPTIONS = {
    watch: false,
};

if (process.argv.length > 2 && process.argv[2] == '--watch') {
    OPTIONS.watch = true;
}


/**
 *
 */
function addTasks(type, files, build, minify)
{
    let doMinify = (typeof minify == 'function');

    for (let group in files) {
        let filesGroup    = files[group];
        let filename      = group + '.' + type;
        let filenameMin   = group + '.min.' + type;
        let taskname      = type + ': ' + group;
        let tasknameBuild = taskname + ' [build]';
        let tasknameMin   = taskname + ' [minify]';
        let tasks         = [tasknameBuild];

        gulp.task(tasknameBuild, function () {
            return build(filename, filesGroup, group);
        });

        if (doMinify) {
            tasks.push(tasknameMin);
            gulp.task(tasknameMin, function () {
                return minify(filename, filenameMin, group);
            });
        }

        gulp.task(taskname, gulp.series(tasks));
        TASKS.push(taskname);

        if (OPTIONS.watch) {
            WATCHES[taskname] = filesGroup;
        }
    }
}


addTasks('js', JS_FILES,
    function (filename, files) {
        return gulp
            .on('error', function (err) { log('Err concat', err.toString()); })
            .src(files)
            .pipe(sourcemaps.init())
            .pipe(concat(filename))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(JS_OUT));
    },
    function (filename, filenameMin) {
        return gulp
            .on('error', function (err) { log('Err min', err.toString()); })
            .src([ JS_OUT + filename ])
            .pipe(uglifyEs())
            .pipe(concat(filenameMin))
            .pipe(gulp.dest(JS_OUT));
    }
);

addTasks('css', CSS_FILES,
    function (filename, files) {
        return gulp
            .on('error', function (err) { log('Err concat', err.toString()); })
            .src(files)
            .pipe(sourcemaps.init())
            .pipe(gulpIf(/[.]sass/, sass()))
            .pipe(concat(filename))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(CSS_OUT));
    },
    function (filename, filenameMin) {
        return gulp
            .on('error', function (err) { log('Err min', err.toString()); })
            .src([ CSS_OUT + filename ])
            .pipe(uglifyCss())
            .pipe(concat(filenameMin))
            .pipe(gulp.dest(CSS_OUT));
    }
);

addTasks('html', HTML_FILES,
    function (filename, files) {
        return gulp
            .on('error', function (err) { log(err.toString()); })
            .src(files)
            .pipe(replace(/"(js|css)\/([^"/.]+)\.(js|css)"/g, '"$1/$2.min.$3?v=' + vars.PWOS_DATE + '"'))
            .pipe(gulp.dest(DIST));
    }
);


let gulpSeries = ['build'];
gulp.task('build', gulp.parallel(TASKS));

if (OPTIONS.watch) {
    gulpSeries.push('watch');
    gulp.task('watch', function (done) {
        console.log('\u001b[33m' + 'Now watching for file changes...' + '\u001b[39m');

        for (let task in WATCHES) {
            let files = WATCHES[task];
            gulp.watch(files, gulp.series(task));
        }

        done();
    });
}

gulp.task('default', gulp.series(gulpSeries));
