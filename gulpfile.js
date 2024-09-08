const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// Importación dinámica para los módulos ESM
async function loadESModules() {
    const imagemin = (await import('gulp-imagemin')).default;
    const webp = (await import('gulp-webp')).default;
    const avif = (await import('gulp-avif')).default;
    return { imagemin, webp, avif };
}

// Tarea para compilar Sass
function compileSass() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
}

// Tarea para procesar imágenes
async function processImages() {
    const { imagemin } = await loadESModules();
    return gulp.src('src/images/**/*.{jpg,png}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

// Tarea para generar imágenes WebP
async function generateWebP() {
    const { webp } = await loadESModules();
    return gulp.src('src/images/**/*.{jpg,png}')
        .pipe(webp())
        .pipe(gulp.dest('dist/images'));
}

// Tarea para generar imágenes AVIF
async function generateAVIF() {
    const { avif } = await loadESModules();
    return gulp.src('src/images/**/*.{jpg,png}')
        .pipe(avif())
        .pipe(gulp.dest('dist/images'));
}

// Observador de cambios
function watch() {
    gulp.watch('src/scss/**/*.scss', compileSass);
    gulp.watch('src/images/**/*.{jpg,png}', gulp.series(processImages, generateWebP, generateAVIF));
}

// Tarea predeterminada
gulp.task('default', gulp.series(
    gulp.parallel(compileSass, processImages, generateWebP, generateAVIF),
    watch
));
