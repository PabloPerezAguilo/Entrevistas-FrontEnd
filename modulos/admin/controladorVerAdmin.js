app.controller('controladorVerAdmin', function ($scope, $mdDialog, indice) {
    
	console.log($scope.entrevistas[indice]);
	$scope.tieneDNI = false;
	
	if ($scope.entrevistas[indice].DNI != undefined) {
		$scope.DNI = $scope.entrevistas[indice].DNI;
		$scope.tieneDNI = true;
	}
	
	$scope.nombre = $scope.entrevistas[indice].name;
	$scope.status = $scope.entrevistas[indice].status;
	$scope.preguntas = $scope.entrevistas[indice].nquestions;
	$scope.chipText = 'Football';
	
	$scope.hide = function () {
		$mdDialog.hide();
	};
  	$scope.cancel = function () {
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});