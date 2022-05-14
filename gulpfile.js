const { src, dest, watch, series } = require("gulp");

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// Imágenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");
const squoosh = require("gulp-libsquoosh");

function css() {
  return src("src/scss/app.scss") // Identificar archivo
    .pipe(sourcemaps.init())
    .pipe(sass()) // Compilar  ----> { outputStyle: "compressed" }
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css")); // Guardar .css
}

// gulp-imagemin
// function imagenes() {
//   return src("src/img/**/*")
//     .pipe(imagemin({ optimizationLevel: 3 }))
//     .pipe(dest("build/img"));
// }

// gulp-webp
function versionWebp() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
}
// gulp-avif
function versionAvif() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
}

// squoosh
function imagenes() {
  return src("src/img/**/*").pipe(squoosh()).pipe(dest("build/img"));
}

function webpAvif() {
  return src("src/img/**/*.{png,jpg}")
    .pipe(
      squoosh({
        webp: {},
        avif: {},
      })
    )
    .pipe(dest("build/img"));
}

function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.webpAvif = webpAvif;
exports.default = series(imagenes, webpAvif, css, dev);
