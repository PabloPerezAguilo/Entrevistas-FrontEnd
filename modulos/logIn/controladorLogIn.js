app.controller('controladorLogIn', function(servicioRest, config, $scope, $location) {

	$scope.login = function () {
		var user = {};
		user.username = $scope.user;
		user.password = $scope.pass;
		servicioRest.postAuthenticate(user)
			.then(function(data) {
				console.log(data.role);
				if(data.role === "ROLE_ADMIN") {
					//$location.path("#/modulos/menuAdmin");
					alert("Es administrador");
				} else {
					//$location.path("#/modulos/menuTech");
					alert("Es técnico");
				}
			})
			.catch(function(err) {
				console.log("Error");
			});
	}


});
