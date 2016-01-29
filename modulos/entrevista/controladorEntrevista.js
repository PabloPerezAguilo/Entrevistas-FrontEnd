app.controller('controladorEntrevista', function (servicioRest, $scope, $rootScope, $log, $mdDialog, $location) {
	
	$rootScope.cargando = false;
    $rootScope.logueado = false;
	
	if ($rootScope.pulsaBoton === undefined || !$rootScope.pulsaBoton) {
		$location.path('/admin');
	}

	$scope.hacerPreguntas = true;
	$scope.respuestas = [];
	
	var respondidas = [], notaMax = 0, nota = 0;
	
	function getPreguntas() {
		servicioRest.getPreguntasEntrevistaById($rootScope.indiceEntrevistaSeleccionada)
				.then(function (data) {
					$scope.preguntas = data;
				})
				.catch(function (err) {
					$scope.preguntas = null;
					$log.error("Error al cargar las preguntas: " + err);
				});
	}
	
	getPreguntas();
	
	$scope.guardarRespuestas = function(ev) {
    	var confirm = $mdDialog.confirm()
        	.title('Las respuestas se guardarán')
			.textContent('¿Estás seguro?')
			.ariaLabel('Confirmacion guardar respuestas')
			.targetEvent(ev)
			.ok('Sí')
			.cancel('No');

    	$mdDialog.show(confirm).then(function() {
			var answers = {
				answers: $scope.respuestas,
			}
			servicioRest.postRespuestasEntrevista($rootScope.indiceEntrevistaSeleccionada, answers)
				.then(function(data) {
					$scope.hacerPreguntas = false;
				}).catch(function(err) {
					$log.error("Error al guardar las respuestas: " + err);
				});
    	});
  };
	
	$scope.aceptarBtn = function () {
		$location.path("/respuestasEntrevista");
	}
});