app.controller('controladorLogIn', function(servicioRest, config, $scope, $location, $rootScope, $mdToast) {

	function toast(texto) {
		$mdToast.show(
	      $mdToast.simple()
	        .content(texto)
	        .position('top right')
	        .hideDelay(1500)
		);

	}

	$scope.login = function () {
        $rootScope.cargando = true;
		var user = {};
		user.username = $scope.user;
		user.password = $scope.pass;
		servicioRest.postAuthenticate(user)
			.then(function(data) {
				console.log(data.role);
				if(data.role === "ROLE_ADMIN") {
					$location.path("/admin");
				} else {
					$location.path("/tech");
				}
			})
			.catch(function(err) {
                $rootScope.cargando = false;
				console.log("Error");
				console.log(err);
				if (err === "Servicio no disponible") {
					toast("Error de conexión");
				} else if($scope.user == null && $scope.pass == null) {
					toast("Debe introducir su usuario y contraseña");
				} else if($scope.user == null) {
					toast("Debe introducir su usuario");
				} else if($scope.pass == null) {
					toast("Debe introducir su contraseña");
				} else {
					toast("El usuario o la contraseña es incorrecta");
				}
			});
	}
});
