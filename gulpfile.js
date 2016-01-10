var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber');
    header  = require('gulp-header'),
    imagemin = require("gulp-imagemin");
    pngquant = require('imagemin-pngquant');
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('clean', function(){
  return gulp.src(['build/**'], {read:false})
  .pipe(clean());
});

gulp.task('css', function () {
    return gulp.src('src/scss/main.scss')
    .pipe(sass({errLogToConsole: true}))
    //.pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function () {
  return gulp.src('src/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('build/assets/images'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('build/assets/fonts'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('components', function() {
  return gulp.src('src/js/components/**')
    .pipe(gulp.dest('build/assets/components'))
    .pipe(browserSync.reload({stream:true, once: true}));
})

gulp.task('js', function(){
  gulp.src('src/js/**/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    //.pipe(header(banner, { package : package }))
    //.pipe(gulp.dest('build/assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "build"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['images', 'fonts', 'html', 'css', 'components', 'js', 'browser-sync'], function () {
    gulp.watch("src/images/*", ['images']);
    gulp.watch("src/fonts/*", ['fonts']);
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/components/*", ['components']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/*.html", ['html', 'bs-reload']);
});
