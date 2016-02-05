app.controller('controladorLogIn', function (servicioRest, config, $scope, $location, $rootScope, $mdToast, $log, $http) {


	$rootScope.logueado = false;
	$rootScope.sinLoguear = true;
	$rootScope.rolUsuario = "";
	var checkeado;
	
	$scope.cambioCheck = function () {
		checkeado = $scope.checkRecordar;
	};	
	
	//RECORDAR SESION
	if (localStorage.getItem("usuario") !== undefined && localStorage.getItem("usuario") !== null) {
		var user = {
			username: localStorage.getItem("usuario"),
			password: Aes.Ctr.decrypt(localStorage.getItem("password"), localStorage.getItem("usuario"), 256)
		};
		servicioRest.postAuthenticate(user)
			.then(function (data) {
				$http.defaults.headers.common['x-access-token'] = data.token;
				$rootScope.token = data.token;
				$rootScope.rol = data.role;
				if (data.role === "ROLE_ADMIN") {
					$location.path("/admin");
				} else {
					$location.path("/tec");
				}
			})
			.catch(function (err) {
				$log.error("Error al recordar sesión: " + err);
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
		user.password = $scope.pass;
		$rootScope.usuario = $scope.user;
		servicioRest.postAuthenticate(user)
			.then(function (data) {
				$http.defaults.headers.common['x-access-token'] = data.token;
				$rootScope.token = data.token;
				$rootScope.rol = data.role;
				if(checkeado) {
					localStorage.setItem("usuario", user.username);
					localStorage.setItem("password", Aes.Ctr.encrypt(user.username, $scope.pass, 256));
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
		if (pressEvent.charCode === 13) {
			$scope.login();
		}
	}
});
