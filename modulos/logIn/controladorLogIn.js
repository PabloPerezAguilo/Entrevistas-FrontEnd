app.controller('controladorLogIn', function(servicioRest, config, $scope) {

	$scope.campo1 = "valor";
	$scope.campo2 = config.atributoConstante;
	$scope.peticionAJAX = function () {
		servicioRest.getEntidades()
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				console.log("Error");
			});
	}

	$scope.title1 = 'Button';
  	$scope.title4 = 'Warn';
  	$scope.isDisabled = true;
  	$scope.googleUrl = 'http://google.com';


});
