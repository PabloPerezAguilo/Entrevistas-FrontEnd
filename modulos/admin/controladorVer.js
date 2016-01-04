app.controller('controladorVer', function ($scope, $mdDialog, indice) {
    
	console.log($scope.entrevistas[indice]);
	
	if ($scope.entrevistas[indice].DNI != undefined) {
		$scope.DNI = "DNI: 123456789";
	}
	
	$scope.nombre = "Nombre y apellidos: " + $scope.entrevistas[indice].name;
	$scope.status = "Estado de la entrevista: " + $scope.entrevistas[indice].status;
	$scope.leveledTags = "Aptitudes: " + $scope.entrevistas[indice].leveledTags;
	$scope.questions = "Preguntas: X preguntas de Java, Y pregunas de HTML";
	
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