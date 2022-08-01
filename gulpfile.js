const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css')

gulp.task('uglify-js', function () {
  const js = gulp.src('public/javascripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/javascripts'))
  return js
});

gulp.task('uglify-css', function () {
  const css = gulp.src('public/stylesheets/*.css')
        .pipe(cleanCss({ compatibility :'ie8' }))
        .pipe(gulp.dest('dist/stylesheets'))
  return css
});

gulp.task('default', gulp.series(['uglify-js', 'uglify-css']))