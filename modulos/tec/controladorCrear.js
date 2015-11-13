app.controller('controladorCrear', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    
    $scope.nivel = 5;
	$scope.respuestasTest = [];
	$scope.test = ['1', '2'];
	$scope.contTest = 2;
	
	
	$scope.masRespuestaTest = function () {
		$scope.contTest++;
		$scope.test.push($scope.contTest);
		console.log($scope.respuestasTest);
	}
});