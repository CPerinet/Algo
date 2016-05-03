var gulp = require('gulp'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	addsrc = require('gulp-add-src'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify');
;


var paths = {
	scss_app : 'public/scss/app.scss',
	scss_files : 'public/scss/**/*.scss',
	css : 'public/styles/',


	es6_in : 'public/scripts/es6/**/*.js',
	vendors_in : 'public/scripts/vendors/**/*.js',
	
	scripts : 'public/scripts/'
};


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
	return gulp.src( paths.es6_in )
		.pipe( plumber() )

		.pipe( babel({
			presets: ['es2015']
		}))
		
		.pipe(addsrc.prepend(paths.vendors_in) )
		
		.pipe(concat("app.js"))

		//.pipe(uglify())
		
		.pipe(plumber.stop())
		
		.pipe(gulp.dest( paths.scripts ));
});


gulp.task('watch', function() {
	gulp.watch( paths.scss_files, ['styles'] );
	gulp.watch( paths.es6_in, ['scripts'] );
});