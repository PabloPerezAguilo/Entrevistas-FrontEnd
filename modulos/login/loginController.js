app.controller('logInController', function(servicioRest, config, $scope, $location) {

	$scope.login = function () {
		var user = {};
		user.username = $scope.username;
		user.password = $scope.password;
		servicioRest.postAuthenticate(user)
			.then(function(data) {
				if(data.success) {
					servicioRest.getUserByToken(data.token)
						.then(function(data) {
							console.log(data);
							if(data.admin) {
								//mandarlo al menu del admin
								//$location.path("#/modulos/menuAdmin");
								alert("Es administrador");
							} else {
								//mandarlo al menu de tecnico
								//$location.path("#/modulos/menuTecnico");
								alert("Es técnico");
							}
						})
						.catch(function(err) {
							console.log("Error");
						});
				} else {
					alert("El usuario o la contraseña es incorrecta.");
				}
			})
			.catch(function(err) {
				console.log("Error");
			});
	}
});