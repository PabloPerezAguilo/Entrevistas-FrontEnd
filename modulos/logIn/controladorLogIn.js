app.controller('controladorLogIn', function(servicioRest, config, $scope, $location, $rootScope) {

	$scope.login = function () {
        $rootScope.cargando=true;
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
				console.log("Error");
			});
	}


});
