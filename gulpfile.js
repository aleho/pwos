/* jshint node: true, esnext: true */
'use strict';

const concat     = require('gulp-concat');
const gulp       = require('gulp');
const gulpIf     = require('gulp-if');
const log        = require('fancy-log');
const replace    = require('gulp-replace');
const rewrite    = require('gulp-rewrite-css');
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
const CDN_URL = 'https://cdn.rawgit.com/aleho/pwos/v' + vars.PWOS_DATE + '/dist/';

const JS_FILES = {
    'index': [
        SRC + 'js/vars.js',
        SRC + 'js/database.js',
        SRC + 'js/pwos.js',
    ],
};

const CSS_FILES = {
    'index': [
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
        let filesGroup   = files[group];
        let taskname     = type + ': ' + group;
        let filename     = group + '.' + type;
        let tasknameMin  = doMinify ? taskname + '_minify' : taskname;

        gulp.task(taskname, build(filename, filesGroup, group));

        if (doMinify) {
            let filenameMin = group + '.min.' + type;
            gulp.task(tasknameMin, [ taskname ], minify(filename, filenameMin, group));
        }

        if (OPTIONS.watch) {
            gulp.watch(filesGroup, [ tasknameMin ]);
        }

        TASKS.push(tasknameMin);
    }
}


addTasks('js', JS_FILES,
    function (filename, files) {
        return function () {
            return gulp
                .on('error', function (err) { log('Err concat', err.toString()); })
                .src(files)
                .pipe(sourcemaps.init())
                .pipe(concat(filename))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(JS_OUT));
        };
    },
    function (filename, filenameMin) {
        return function () {
            return gulp
                .on('error', function (err) { log('Err min', err.toString()); })
                .src([ JS_OUT + filename ])
                .pipe(uglifyEs())
                .pipe(concat(filenameMin))
                .pipe(gulp.dest(JS_OUT));
        };
    }
);

addTasks('css', CSS_FILES,
    function (filename, files) {
        return function () {
            return gulp
                .on('error', function (err) { log('Err concat', err.toString()); })
                .src(files)
                .pipe(sourcemaps.init())
                .pipe(gulpIf(/[.]sass/, sass()))
                .pipe(concat(filename))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(CSS_OUT));
        };
    },
    function (filename, filenameMin) {
        return function () {
            return gulp
                .on('error', function (err) { log('Err min', err.toString()); })
                .src([ CSS_OUT + filename ])
                .pipe(uglifyCss())
                .pipe(concat(filenameMin))
                .pipe(gulp.dest(CSS_OUT));
        };
    }
);

addTasks('html', HTML_FILES,
    function (filename, files) {
        return function () {
            return gulp
                .on('error', function (err) { log(err.toString()); })
                .src(files)
                .pipe(replace(/"(js|css)\/([^".]+)\.(js|css)"/g, '"' + CDN_URL + '$1/$2.min.$3"'))
                .pipe(gulp.dest(DIST));
        };
    }
);


gulp.task('default', TASKS, function () {
    if (OPTIONS.watch) {
        console.log('\u001b[33m' + 'Now watching for file changes...' + '\u001b[39m');
    }
});
