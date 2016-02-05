var gulp = require('gulp'),
lr = require('gulp-livereload');
//sass = require('gulp-sass'),
//jshint = require('gulp-jshint');

var pathHTML=['./modulos/**/*.html','./index.html'];


var paths = {
	app : "app",
	lib : "app/lib",
	scss : "css",
	css : "css",
	target : "target"
};

var names = {
	anyFile : "/**/*",
	anyJS : "/**/*.js",
	anyHTML : "/**/*.html",
	anyCSS : "/**/*.css",
	anySCSS : "/**/*.scss",
	minJS : "app.min.js",
	minCSS : "app.min.css"
}


function startExpress() {
	var express = require('express');
	var app = express();

	app.use(require('connect-livereload')());
	app.use(express.static(__dirname + "/"));

		// Start livereload
	lr.listen(35729);
	
	app.listen(80);
}

function notifyLivereload(file) {
	lr.reload(file);
}


gulp.task('default', function () {
	startExpress();
	//gulp.watch(paths.scss+names.anyFile, ["compileCSS"]);
	gulp.watch("**/*.css", notifyLivereload);
	gulp.watch("**/*.js", notifyLivereload);
	gulp.watch("**/*.html", notifyLivereload);
});