var gulp = require('gulp');
var html = require('gulp-htmlmin');
var cssmin = require('gulp-clean-css');
var less = require('gulp-less');
var js = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
// -----------------------------
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// 压缩html
gulp.task('html', function() {
    gulp.src('src/**/*.html')
        .pipe(html({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'))
})

// 压缩css
gulp.task('css', function() {
        gulp.src('src/less/index.less')
            .pipe(less())
            .pipe(cssmin())
            .pipe(gulp.dest('dist/css'))
    })
    // 压缩JS
var jsLibs = [
    'node_modules/art-template/lib/template-web.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js', //bootstrap依赖jquery，所以要先执行。
];
gulp.task('jsconcat', function() {
    gulp.src(jsLibs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('dist/js'))
})

// 自己写的JS
var jsmodules = [
    //比价搜索
    'src/js/comparePrice/comparePrice.js'
];
gulp.task('js', function() {
        jsmodules.forEach(function(jspath) {
            var jsArr = jspath.split('/');
            var jsName = jsArr.pop();
            jsArr.shift();
            browserify(jspath, { debugger: true }).bundle()
                .pipe(source(jsName))
                .pipe(buffer())
                .pipe(gulp.dest('dist/' + jsArr.join('/')));

        })
    })
    // 监听。
// gulp.task('build', function() {
//     gulp.task(['html', 'css', 'js', 'jsconcat']);
// })
// gulp.task('default', function() {
//     gulp.run('build');
//     gulp.watch(['src/**/*.html', 'index.html'], function() {
//         gulp.run('html');
//     })
//     gulp.watch(['src/**/*.less', 'index.less'], function() {
//         gulp.run('less');
//     })
//     gulp.watch(['src/**/*.js'], function() {
//         gulp.run('js');
//     });
// })
gulp.task('build', function () {
    gulp.run(['html', 'css', 'jsconcat', 'js']);
})
//    监视任务
gulp.task('default', function () {
    gulp.run('build');
    gulp.watch(['src/**/*.html', 'index.html'], function () {
        gulp.run('html');
    })
    gulp.watch(['src/less/index.less'], function () {
        gulp.run('less');
    })
    gulp.watch(['src/**/*.js'], function () {
        gulp.run('js');
    });
})