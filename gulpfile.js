/* jshint node: true, esnext: true */
'use strict';

const babel      = require('rollup-plugin-babel');
const concat     = require('gulp-concat');
const exec       = require('child_process').exec;
const filter     = require('gulp-filter');
const favicons   = require('gulp-favicons');
const gulp       = require('gulp');
const gulpIf     = require('gulp-if');
const log        = require('fancy-log');
const merge      = require('merge-stream');
const path       = require('path');
const rename     = require('gulp-rename');
const replace    = require('gulp-replace');
const rollup     = require('gulp-better-rollup')
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglifyJs   = require('gulp-uglify');
const uglifyCss  = require('gulp-uglifycss');
const vars       = require('./src/js/vars.js');


const NODE     = 'node_modules/';
const SRC      = 'src/';
const DIST     = 'dist/';
const JS_OUT   = DIST + 'js/';
const CSS_OUT  = DIST + 'css/';
const DATA_OUT = DIST + 'data/';
const IMG_OUT  = DIST + 'img/';
const TASKS    = [];
const WATCHES  = {};

const JS_FILES = {
    'index': [
        NODE + '@babel/polyfill/dist/polyfill.js',
        SRC + 'js/vars.js',
        SRC + 'js/main.jsx',
    ],
};

const CSS_FILES = {
    'index': [
        NODE + 'animate.css/animate.css',
        SRC + 'sass/index.sass',
    ],
};

const HTML_FILES = {
    'index': [
        SRC + 'index.html',
    ],
};

const IMG_FILES = {
    'img': [SRC + 'img/facepalm.png'],
};

const JSON_FILES = {
    'db': SRC + 'data/db.json',
};


const OPTIONS = {
    watch: false,
};

if (process.argv.length > 2 && process.argv[2] == '--watch') {
    OPTIONS.watch = true;
}


/**
 * Add a task.
 */
function addTasks(type, files, build) {
    for (const group in files) {
        const filesGroup = files[group];
        const filename   = group + '.' + type;
        const taskname   = type + ':' + group;

        gulp.task(taskname, done => {
            return build(filename, filesGroup, done);
        });

        TASKS.push(taskname);

        if (OPTIONS.watch) {
            WATCHES[taskname] = filesGroup;
        }
    }
}


addTasks('js', JS_FILES, (filename, files) => {
    const build = gulp
        .src(files)
        .pipe(sourcemaps.init())
        .pipe(rollup({
            plugins: [babel({
                exclude: 'node_modules/**',
                presets: [
                    ['@babel/env', { 'modules': false }],
                    ['@babel/react'],
                ],
                plugins: [
                    ['@babel/plugin-proposal-class-properties'],
                ],
            })]
        }, {
            format: 'cjs',
        }))
        .pipe(concat(filename))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(JS_OUT));

    const minify = gulp
        .src(JS_OUT + filename)
        .pipe(uglifyJs())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(JS_OUT));


    return merge(build, minify);
});


addTasks('css', CSS_FILES, (filename, files) => {
    return gulp
        .src(files)
        .pipe(sourcemaps.init())
        .pipe(gulpIf(/[.]sass/, sass()))
        .pipe(concat(filename))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(CSS_OUT))

        .pipe(filter('**/*.css'))
        .pipe(uglifyCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(CSS_OUT));
});


addTasks('img', IMG_FILES, (filename, files) => {
    return gulp
        .src(files)
        .pipe(gulp.dest(IMG_OUT));
});


addTasks('html', HTML_FILES, (filename, files) => {
    return gulp
        .src(files)
        .pipe(replace(/"(js|css)\/([^"/.]+)\.(js|css)"/g, '"$1/$2.min.$3?v=' + vars.PWOS_DATE + '"'))
        .pipe(gulp.dest(DIST));
});


addTasks('json', JSON_FILES, (outname, source, done) => {
    const out = DATA_OUT + outname;

    // build compact json file
    exec("jq -c '.' " + source + ' > ' + out, (err, stdout, stderr) => {
        if (err) {
            log.error('Error building data file', outname);
            log.info(err);
        }

        done();
    });
});


const gulpSeries = ['build'];
gulp.task('build', gulp.parallel(TASKS));

if (OPTIONS.watch) {
    gulpSeries.push('watch');
    gulp.task('watch', done => {
        log('\u001b[33m' + 'Now watching for file changes...' + '\u001b[39m');

        for (const task in WATCHES) {
            let files  = WATCHES[task];
            const dirs = {};
            if (typeof files !== 'object') {
                files = [files];
            }
            for (const file of files) {
                dirs['./' + path.dirname(file) + '/**/*' + path.extname(file)] = true;
            }
            gulp.watch(Object.keys(dirs), gulp.series(task));
        }

        done();
    });
}

gulp.task('default', gulp.series(gulpSeries));


gulp.task('favicons', () => {
    return gulp
        .src(SRC + 'img/facepalm.svg')
        .pipe(favicons({
            appName: 'PWoS',
            appDescription: 'Passwords of Shame',
            developerName: 'aleho',
            developerURL: 'https://github.com/aleho/pwos',
            background: '#fff',
            theme_color: '#fff',
            path: '/',
            version: vars.PWOS_DATE,
            logging: false,
            online: false,
            preferOnline: false,
            icons: {
                favicons: true,
                android: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                firefox: false,
                windows: false,
                yandex: false,
            },
        }))
        .pipe(gulp.dest(DIST + 'favicons'));
});
