const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css')
const {
  readdirSync,
} = require('fs')
const obfuscator = require('gulp-javascript-obfuscator')
const imagemin = require('gulp-imagemin');

gulp.task('obfuscator', async() => {
  const dirList = await readdirSync('public/javascripts/', {
    withFileTypes : true
  })
  .filter(file => file.isDirectory())
  .map(dir => dir.name)
  dirList.forEach(dir => {
    gulp.src('public/javascripts/' + dir + '/*.js')
    .pipe(obfuscator({ 
      compact : true,
    }))
    .pipe(gulp.dest('dist/javascripts/' + dir + '/'))
  })
  gulp.src('public/javascripts/*.js')
  .pipe(obfuscator({
    compact : true,
  }))
  .pipe(gulp.dest('dist/javascripts/'))
})

gulp.task('uglify-css', async () => {
  const dirList = await readdirSync('public/stylesheets/', {
      withFileTypes: true
    })
    .filter(file => file.isDirectory())
    .map(dir => dir.name)
  dirList.forEach(dir => {
    gulp.src('public/stylesheets/' + dir + '/*.css')
      .pipe(cleanCss({
        compatibility: 'ie8'
      }))
      .pipe(gulp.dest('dist/stylesheets/' + dir + '/'))
  })
  const css = gulp.src('public/stylesheets/*.css')
    .pipe(cleanCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('dist/stylesheets'))
  return css
});

gulp.task('gulp-imagemin', async () => {
  const dirList = await readdirSync('public/images', {
    withFileTypes: true
  })
  .filter(dir => dir.isDirectory())
  .map(dir => dir.name)

  dirList.forEach(dir => {
    gulp.src(`public/images/${dir}/*.{png,ico,jpg}`)
    .pipe(imagemin())
    .pipe(gulp.dest(`dist/images/${dir}`))
    
  })
  gulp.src(`public/images/*.{png,ico,jpg}`)
    .pipe(imagemin())
    .pipe(gulp.dest(`dist/images`))
})

gulp.task('default', gulp.series(['obfuscator', 'uglify-css', 'gulp-imagemin']))