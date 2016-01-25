app.controller('controladorVerAdmin', function ($scope, $rootScope, $mdDialog, indice) {
	
	$scope.ayuda = function() {
		$scope.ver = !$scope.ver;
		if(!$scope.ver) {
			$scope.cabeceraVer = '- Ayuda';
		} else {
			$scope.cabeceraVer = '';
		}
	}
    
	$scope.tieneDNI = false;
	
	if ($scope.entrevistas[indice].DNI != undefined) {
		$scope.DNI = $scope.entrevistas[indice].DNI;
		$scope.tieneDNI = true;
	}
	
	$scope.nombre = $scope.entrevistas[indice].name;
	$scope.status = $scope.entrevistas[indice].status;
	$scope.preguntas = $scope.entrevistas[indice].nquestions;
	
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