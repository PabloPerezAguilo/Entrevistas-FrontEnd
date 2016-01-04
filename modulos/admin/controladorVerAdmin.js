app.controller('controladorVerAdmin', function ($scope, $mdDialog, indice) {
    
	console.log($scope.entrevistas[indice].leveledTags);
	$scope.tieneDNI = false;
	
	if ($scope.entrevistas[indice].DNI != undefined) {
		$scope.DNI = $scope.entrevistas[indice].DNI;
		$scope.tieneDNI = true;
	}
	
	$scope.nombre = $scope.entrevistas[indice].name;
	$scope.status = $scope.entrevistas[indice].status;
	$scope.leveledTags = $scope.entrevistas[indice].leveledTags;
	$scope.questions = "X preguntas de Java, Y pregunas de HTML";
	
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