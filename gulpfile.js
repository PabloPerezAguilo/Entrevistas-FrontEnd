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

gulp.task('cdnReplace', function() {
	console.log("Reemplazamos las librerias por los CDNs de index");
	return gulp.src('target/files/index.html')
	.pipe(htmlreplace({
		
		'JSCDNs': [
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-mocks.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-messages.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-aria.min.js',
		'https://cdn.gitcdn.xyz/cdn/angular/bower-material/v1.0.1-master-a687bfc/angular-material.js',
		'https://cdn.gitcdn.xyz/cdn/angular/bower-material/v1.0.0-rc4/angular-material.css',
		'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/2.3.0/ng-tags-input.min.js',
		'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/assets-cache.js',
		'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js'],

		'CSSCDNs': [
		'https://cdn.gitcdn.xyz/cdn/angular/bower-material/v1.0.0-rc4/angular-material.css',
		'https://mbenford.github.io/ngTagsInput/css/ng-tags-input.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css']

	},{'keepUnassigned':true,'keepBlockTags':true}))
	.pipe(gulp.dest('target/files/'));
});


gulp.task('default', function () {
	startExpress();
	//gulp.watch(paths.scss+names.anyFile, ["compileCSS"]);
	gulp.watch("./**/*.css", notifyLivereload);
	gulp.watch("./**/*.js", notifyLivereload);
	gulp.watch("./**/*.html", notifyLivereload);
});