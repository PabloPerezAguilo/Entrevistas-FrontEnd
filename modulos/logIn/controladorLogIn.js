app.controller('controladorLogIn', function(servicioRest, config, $scope, $location, $rootScope, $mdToast) {

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
				if($scope.user == null) {
					if($scope.pass == null) {
						$mdToast.show(
					      $mdToast.simple()
					        .content('Debe introducir su usuario y contraseña.')
					        .position('top right')
					        .hideDelay(1500)
					    );
					} else {
						$mdToast.show(
					      $mdToast.simple()
					        .content('Debe introducir su usuario.')
					        .position('top right')
					        .hideDelay(1500)
					    );
					}
				} else if($scope.pass == null) {
					$mdToast.show(
				      $mdToast.simple()
				        .content('Debe introducir su contraseña.')
				        .position('top right')
				        .hideDelay(1500)
				    );
				} else {
					$mdToast.show(
				      $mdToast.simple()
				        .content('El usuario o la contraseña es incorrecta.')
				        .position('top right')
				        .hideDelay(1500)
				    );
				}
			});
	}
});
