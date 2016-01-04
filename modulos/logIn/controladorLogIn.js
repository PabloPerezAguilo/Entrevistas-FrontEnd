app.controller('controladorLogIn', function (servicioRest, config, $scope, $location, $rootScope, $mdToast, $log, $http) {


	$rootScope.logueado = false;
	$rootScope.rolUsuario = "";

	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}

	$scope.login = function () {
		$rootScope.cargando = true;
		var user = {};
		user.username = $scope.user;
		user.password = $scope.pass;
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
});
