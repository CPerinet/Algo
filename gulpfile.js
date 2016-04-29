const paths = {
	scss_app : 'public/scss/app.scss',
	scss_files : 'public/scss/**/*.scss',
	css : 'public/styles/',

	input_scripts : 'public/es6/**/*.js',
	output_scripts : 'public/scripts/'
}

const gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	babel = require('gulp-babel')
;

gulp.task('styles', function() {
	return gulp.src( paths.scss_app )
		.pipe(plumber({
	        errorHandler: function (err) {
	            this.emit('end');
	        }
	    }))
		.pipe( sass({errLogToConsole: true}) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( paths.css ) );
});

gulp.task('scripts', function() {
	return gulp.src( paths.input_scripts )
		.pipe(plumber())
		.pipe( babel({
			presets: ['es2015']
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest( paths.output_scripts ));
});

gulp.task('default', function() {
	gulp.watch( paths.scss_files, ['styles'] );
	gulp.watch( paths.input_scripts, ['scripts'] );
});