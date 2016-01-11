app.controller('controladorEntrevista', function (servicioRest, $scope, $rootScope, $log) {
 /* ------------------------------------------------------
	-------------------- Para probar ---------------------
	--------------------------------------------------- */
	
	//$rootScope.indiceEntrevistaSeleccionada = "568fb07cccef6ff8108d085a"; //2 preguntas abierta
	//$rootScope.indiceEntrevistaSeleccionada = "568fb06fccef6ff8108d0859"; //2 preguntas test
	//$rootScope.indiceEntrevistaSeleccionada = "568fb061ccef6ff8108d0858"; //2 preguntas multiples
	$rootScope.indiceEntrevistaSeleccionada = "568fb0a0d4ee6a282327f5df"; //6 preguntas combinadas
 /* ------------------------------------------------------
	-------------------- Para probar ---------------------
	--------------------------------------------------- */
	$scope.respuestas = [];
	
	var respondidas = [];
	
	function getPreguntas() {
		servicioRest.getEntrevistasById($rootScope.indiceEntrevistaSeleccionada)
				.then(function (data) {
					$scope.preguntas = data;
				})
				.catch(function (err) {
					$scope.preguntas = null;
					$log.error("Error al cargar las preguntas: " + err);
				});
	}
	
	getPreguntas();
	
	$scope.guardarRespuestas = function () {
		console.log($scope.respuestas);
	};
});