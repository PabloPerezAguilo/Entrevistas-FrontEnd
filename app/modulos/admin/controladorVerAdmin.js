app.controller('controladorVerAdmin', function ($scope, $rootScope, $mdDialog, $location, indice) {

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
	
	if($scope.entrevistas[indice].status === "Realizada") {
		$scope.entrevistaHecha = true;
	} else {
		$scope.entrevistaHecha = false;
	}
	
	$scope.nombre = $scope.entrevistas[indice].name;
	$scope.fecha = $scope.entrevistas[indice].date;
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
	
	$scope.verRespuestas = function () {
		$rootScope.indiceEntrevistaSeleccionada = $scope.entrevistas[indice]._id;
		sessionStorage.setItem("ver", true);
		$location.path("/respuestasEntrevista");
	}
});