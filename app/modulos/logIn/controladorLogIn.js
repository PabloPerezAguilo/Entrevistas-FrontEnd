app.controller('controladorLogIn', function (servicioRest, config, $scope, $location, $rootScope, $mdToast, $log, $http) {
	
	$rootScope.logueado = false;
	$rootScope.conFooter = true;
	$rootScope.rolUsuario = "";
	var checkeado;
	
	var permiso = sessionStorage.getItem("permiso");
	if (permiso) {
		$location.path('/entrevista');
	}
	
	var rol;
	if (sessionStorage.getItem("rol") !== null) {
		rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol") !== null) {
		rol = localStorage.getItem("rol");
	}
	
	if (rol === "ROLE_TECH") {
		$location.path('/tec');
	} else if (rol === "ROLE_ADMIN") {
		$location.path('/admin');
	}
	
	var ver = sessionStorage.getItem("ver");
	
	if (ver) {
		$location.path('/respuestasEntrevista');
	}
	
	$scope.cambioCheck = function () {
		checkeado = $scope.checkRecordar;
	};
	
	//RECORDAR SESION
	if (localStorage.getItem("usuario") !== null) {
		var user = {
			username: localStorage.getItem("usuario"),
			password: localStorage.getItem("password")
		};
		servicioRest.postAuthenticate(user)
			.then(function (data) {
				$http.defaults.headers.common['x-access-token'] = data.token;
				$rootScope.rol = data.role;
				if (data.role === "ROLE_ADMIN") {
					$location.path("/admin");
				} else {
					$location.path("/tec");
				}
			})
			.catch(function (err) {
				$log.error("Error al recordar sesión: " + err);
				//$location.path('/');
			})
	}

	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	};

	$scope.login = function () {
		$rootScope.cargando = true;
		var user = {};
		user.username = $scope.user.toLowerCase();
		//user.password = window.btoa($scope.pass);
		user.password = $scope.pass;
		$rootScope.usuario = $scope.user;
		servicioRest.postAuthenticate(user)
			.then(function (data) {
				$http.defaults.headers.common['x-access-token'] = data.token;
				$rootScope.rol = data.role;
				if(checkeado) {
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
				} else {
					$location.path("/tec");
				}
			})
			.catch(function (err) {
			$rootScope.cargando = false;
			if (err === "Servicio no disponible") {
				toast("Error de conexión");
				$log.error("Error al conectar con el servidor: " + err);
			} else if ($scope.user === null && $scope.pass === null) {
				toast("Debe introducir su usuario y contraseña");
			} else if ($scope.user === null) {
				toast("Debe introducir su usuario");
			} else if ($scope.pass === null) {
				toast("Debe introducir su contraseña");
			} else {
				toast("El usuario o la contraseña es incorrecta");
			}
		});
	};
	
	$scope.enter = function (pressEvent) {
		if (pressEvent.keyCode === 13 || pressEvent.which === 13) {
			$scope.login();
		}            
	}
});