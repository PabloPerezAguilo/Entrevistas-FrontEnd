app.controller('controladorLogIn', function (servicioRest, config, $scope, $location, $rootScope, $mdToast, $log, $http) {
	'use strict';
	$scope.verLogin = false;
	$rootScope.verCabecera = true;
	$rootScope.logueado = false;
	$rootScope.conFooter = true;
	$rootScope.rolUsuario = "";
	
	var checkeado;
	
	var rol;
	if (sessionStorage.getItem("rol") !== null) {
		rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol") !== null) {
		rol = localStorage.getItem("rol");
	}
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	if (localStorage.getItem("usuario") !== null) { //RECORDAR SESION
		$rootScope.cargandoSesion = true;
		var user = {
			username: localStorage.getItem("usuario"),
			password: localStorage.getItem("password")
		};
		servicioRest.postAuthenticate(user)
			.then(function (data) {
				$http.defaults.headers.common['x-access-token'] = data.token;
				$rootScope.rol = data.role;
				sessionStorage.setItem("token", data.token);
				if (data.role === "ROLE_ADMIN") {
					$location.path("/admin");
					return null;
				} else {
					$location.path("/tec");
					return null;
				}
			})
			.catch(function (err) {
				$log.error("Error al recordar sesión: " + err);
				$rootScope.cargandoSesion = false;
				$scope.verLogin = true;
				$rootScope.cerrarSesion();
				toast("Error al recordar sesión");
				return null;
			});
	} else if (rol === "ROLE_TECH") {
		$location.path("/tec");
		return null;
	} else if (sessionStorage.getItem("permiso")) {
		$location.path("/entrevista");
		return null;
	} else if (sessionStorage.getItem("ver")) {
		$location.path("/respuestasEntrevista");
		return null;
	} else if (rol === "ROLE_ADMIN") {
		$location.path("/admin");
		return null;
	} else {
		//muestra la pagina cuando se comprueba que no ha entrado aqui incorrectamente
		$scope.verLogin = true;
		$rootScope.verCabecera = true;
	}
	
	$scope.cambioCheck = function () {
		checkeado = $scope.checkRecordar;
	};

	$scope.login = function () {
		if ($scope.user === undefined && $scope.pass === undefined) {
			toast("Debe introducir su usuario y contraseña");
		} else if ($scope.user === undefined) {
			toast("Debe introducir su usuario");
		} else if ($scope.pass === undefined) {
			toast("Debe introducir su contraseña");
		} else {
			$rootScope.cargando = true;
			var user = {};
			user.username = $scope.user.toLowerCase();
			if(config.ldap) {
				user.password = window.btoa($scope.pass);
			} else {
				user.password = $scope.pass;
			}
			$rootScope.usuario = $scope.user;
			servicioRest.postAuthenticate(user)
				.then(function (data) {
					$http.defaults.headers.common['x-access-token'] = data.token;
					$rootScope.rol = data.role;
					if (checkeado) {
						localStorage.setItem("usuario", user.username);
						localStorage.setItem("password", user.password);
						localStorage.setItem("rol", data.role);
					} else {
						sessionStorage.setItem("usuario", user.username);
						sessionStorage.setItem("rol", data.role);
					}
					sessionStorage.setItem("token", data.token);
					if (data.role === "ROLE_ADMIN") {
						$location.path("/admin");
						return null;
					} else {
						$location.path("/tec");
						return null;
					}
				})
				.catch(function (err) {
					$rootScope.cargando = false;
					$scope.pass = undefined;
					if (err === "Servicio no disponible") {
						toast("Error de conexión");
						$log.error("Error al conectar con el servidor: " + err);
					} else if(err === "Authentication failed. User not found.") {
						toast("El usuario o la contraseña es incorrecta");
					} else if (err.data.message === "LDAP time out") {
						toast("Error de conexión con LDAP");
						$log.error("Error al conectar con LDAP: " + err.data.message);
					}
				});
		}
	};
	
	$scope.enter = function (pressEvent) {
		if (pressEvent.keyCode === 13 || pressEvent.which === 13) {
			$scope.login();
		}
	};
});
