app.controller('controladorCrear', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    
    $scope.nivel = 5;
	$scope.respuestasTest = [];
	$scope.test = ['1', '2'];
	$scope.contTest = 2;
	$scope.radioTest = 1;
	
	$scope.respuestasTestAbierto = [];
	$scope.testAbierto = ['1', '2'];
	$scope.contTestAbierto = 2;
	$scope.checkTestAbierto = [false, false];
	
	$scope.aniadirRespuestaTest = function () {
		$scope.contTest += 1;
		$scope.test.push($scope.contTest);
		$scope.radioTest($scope.contTest);
	};
	
	$scope.aniadirRespuestaTestAbierto = function () {
		$scope.contTestAbierto += 1;
		$scope.testAbierto.push($scope.contTestAbierto);
		$scope.checkTestAbierto.push(false);
	};
});