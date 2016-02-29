'use strict';

var app = angular.module('argos', ['ngRoute','ngMaterial', 'ngMdIcons', 'rzModule', 'angular-intro']);
app.run(function(servicioRest, $rootScope, $http, $location) {

	// Establecemos las cabeceras por defecto. Las cabecera Authorization se modificara cuando el usuario se loge
	$http.defaults.headers.common['Accept'] = 'application/json, text/javascript';
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	
	$rootScope.limpiarCredenciales = function () {
		localStorage.clear();
		localStorage.removeItem("usuario");
		localStorage.removeItem("password");
		sessionStorage.clear();
		sessionStorage.removeItem("token");
		$http.defaults.headers.common['x-access-token'] = '';
	};
	
	$rootScope.cerrarSesion = function () {
		$rootScope.limpiarCredenciales();
		$location.path("/");
	};	
});

app.config(function($routeProvider) {

	$routeProvider
	.when('/', {
		templateUrl: 'modulos/logIn/logIn.html',
		controller: 'controladorLogIn'
	})
	.when('/admin', {
		templateUrl: 'modulos/admin/admin.html',
        controller: 'controladorAdmin'
	})
	.when('/tec', {
		templateUrl: 'modulos/tec/tec.html',
        controller: 'controladorTec'
	})
	.when('/entrevista', {
		templateUrl: 'modulos/entrevista/entrevista.html',
        controller: 'controladorEntrevista'
	})
	.when('/respuestasEntrevista', {
		templateUrl: 'modulos/entrevista/respuestasEntrevista.html',
        controller: 'controladorRespuestasEntrevista'
	})
	.when('/equipo', {
		templateUrl: 'modulos/equipo/equipo.html',
        controller: 'controladorEquipo'
	})
	.when('/pageNotFound', {
		templateUrl: 'modulos/error/templateError.html'
	})
	.otherwise({
		redirectTo: "/pageNotFound"
	});
});

app.service('servicioRest', ServicioREST);

app.filter("rol",function () {
  return function (valor) {
    if (valor === "ROLE_ADMIN") {
      return "administrador";
    } else if (valor === "ROLE_TECH") {
      return "técnico";
    }
  };
});
