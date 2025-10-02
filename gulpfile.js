// Gulp 4
const { src, dest, watch, series, parallel } = require("gulp");
const sass = require('gulp-dart-sass');
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const esbuild = require("gulp-esbuild");

// Пути
const paths = {
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
  images: "src/images/**/*.{jpg,jpeg,png}",
  svg: "src/images/**/*.svg",
  static: "static/"
};

// Стили
function styles() {
  return src('src/scss/base_bundle.scss') 
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(rename("style.min.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.static + "css"))
    .pipe(browserSync.stream());
}


// JS
function scripts() {
  return src("src/js/base_bundle.js")
    .pipe(esbuild({
      outfile: "bundle.min.js",
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ["es2017"],
    }))
    .pipe(dest(paths.static + "js"))
    .pipe(browserSync.stream());
}

// Оптимизация картинок + webp
function images() {
  return src(paths.images)
    .pipe(imagemin())
    .pipe(dest(paths.static + "images"))
    .pipe(webp())
    .pipe(dest(paths.static + "images"));
}

// SVG → sprite
function sprite() {
  return src(paths.svg)
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(dest(paths.static + "images"));
}

// BrowserSync
function serve() {
  browserSync.init({
    proxy: "http://127.0.0.1:8000/", // Django dev server
    open: false,
    notify: false
  });

  watch(paths.scss, styles);
  watch(paths.js, scripts);
  watch(paths.images, images).on("change", browserSync.reload);
  watch(paths.svg, sprite).on("change", browserSync.reload);
  watch("templates/**/*.html").on("change", browserSync.reload);
}

exports.scss = styles;
exports.js = scripts;
exports.img = images;
exports.svg = sprite;
exports.serve = series(parallel(styles, scripts, images, sprite), serve);
exports.default = series(parallel(styles, scripts, images, sprite), serve);
