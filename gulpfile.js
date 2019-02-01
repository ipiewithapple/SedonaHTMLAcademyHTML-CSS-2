var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var mincss = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var uglify = require('gulp-uglify');
var svgstore = require('gulp-svgstore');
var htmlmin = require('gulp-htmlmin');
var posthtml = require('gulp-posthtml');
var include = require("posthtml-include");
var del = require('del');

// Minify HTML + posthtml tag <include>

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(posthtml([
            include()
        ]))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build/'))

});

// Minify JS

gulp.task('jsmin', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename('min.script.js'))
        .pipe(gulp.dest('build/js'))
});

// Compile sass into CSS & auto-inject into browsers + plumber, autoprefixer and minify CSS

gulp.task('sass', function () {
    return gulp.src("src/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("build/css"))
        .pipe(mincss())
        .pipe(rename('min.style.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', function () {

    browserSync.init({
        server: "build"
    });

    gulp.watch("src/sass/**/*.scss", gulp.series('sass'));
    gulp.watch("src/*.html", gulp.series('html')).on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js", gulp.series('jsmin')).on('change', browserSync.reload);
});

// Minify img

gulp.task('imagemin', function () {

    return gulp.src('src/img/**/*.{png,jpg,svg}')
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('src/img'))
});

// Create webp images

gulp.task('webp', function () {
    return gulp.src('src/img/**/*.{png,jpg}')
        .pipe(webp({
            quality: 90
        }))
        .pipe(gulp.dest('src/img'))
});

// Create svg sprite

gulp.task('sprite', function () {
    return gulp.src('src/img/icon-*.svg')
        .pipe(svgstore({
            inLineSvg: true
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('src/img'))
});

// Copy files to "build"

gulp.task('copy', function () {
    return gulp.src([
            'src/fonts/**/*.{woff,woff2}',
            'src/img/**'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('build'))
});

// Delete "build"

gulp.task('del', function () {
    return del('build')
});

// Start tasks

gulp.task('build', gulp.series('del', 'copy', 'sass', 'jsmin', 'html'));
gulp.task('start', gulp.series('build', 'serve'));
gulp.task('prepimg', gulp.series('webp', 'imagemin', 'sprite'));