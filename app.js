'use strict';

var app = angular.module('magni', ['ngRoute','ngMaterial', 'ngMdIcons']);
app.run(function(servicioRest, $rootScope, $http, $location) {

	// Establecemos las cabeceras por defecto. Las cabecera Authorization se modificara cuando el usuario se loge
	$http.defaults.headers.common['Accept'] = 'application/json, text/javascript';
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	
});

app.config(function($routeProvider) {

	$routeProvider
	/*.when('/', {
		templateUrl: 'modulos/logIn/logIn.html',
		controller: 'controladorLogIn'
	})*/
	.when('/admin', {
		templateUrl: 'modulos/admin/admin.html',
        controller: 'controladorAdmin'
	})
	.when('/', {
		templateUrl: 'modulos/tec/tec.html',
        controller: 'controladorTec'
	})
    
	.when('/entrevista', {
		templateUrl: 'modulos/entrevista/entrevista.html',
        controller: 'controladorEntrevista'
	})
	.when('/pageNotFound', {
		templateUrl: 'modulos/error/templateError.html'
	})
	.otherwise({
		redirectTo: "/pageNotFound"
	});
});

app.service('servicioRest', ServicioREST);

