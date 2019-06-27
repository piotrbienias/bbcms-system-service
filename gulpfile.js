/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */


const gulp          = require('gulp'),
      typescript    = require('gulp-typescript'),
      nodemon       = require('gulp-nodemon');


const tsProject     = typescript.createProject('tsconfig.json');


function compile(cb) {
    gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));

    cb();
}

function watch(cb) {
    nodemon({
        script: 'dist/index.js',
        watch: 'src',
        ext: 'ts',
        tasks: ['compile'],
        delay: '2000'
    }).on('restart', () => {
        console.log('Node.js restarted');
    });

    cb();
}

gulp.task('compile',        compile);
gulp.task('watch',          watch);


exports.default = gulp.series('compile', 'watch');