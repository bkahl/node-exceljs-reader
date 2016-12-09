var gulp = require('gulp-param')(require('gulp'), process.argv);
var sass = require('gulp-sass');

gulp.task('sass', function(compressed) {
  if(compressed) {
    gulp.src('./public/stylesheets/sass/**/*.scss')
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) /* compress css - production */
      .pipe(gulp.dest('public/stylesheets/'))
  } else {
    gulp.src('./public/stylesheets/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError)) /* don't compress css - development */
      .pipe(gulp.dest('public/stylesheets/'))
  }
});

//Watch task
gulp.task('watch', function(compressed) {
  gulp.watch('./public/stylesheets/sass/**/*.scss',['sass']);
});
