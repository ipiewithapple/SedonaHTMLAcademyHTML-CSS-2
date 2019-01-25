var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var mincss = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');

// Compile sass into CSS & auto-inject into browsers + plumber, autoprefixer and minify CSS
gulp.task('sass', function () {
    return gulp.src("src/sass/main.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("src/css"))
        .pipe(mincss())
        .pipe(rename('min.main.css'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', function () {

    browserSync.init({
        server: "./src"
    });

    gulp.watch("src/sass/*.scss", gulp.series('sass'));
    gulp.watch("src/*.html").on('change', browserSync.reload);
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

gulp.task('build', gulp.series('imagemin'));
gulp.task('default', gulp.series('sass', 'serve'));