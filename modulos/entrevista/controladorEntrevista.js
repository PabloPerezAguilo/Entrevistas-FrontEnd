app.controller('controladorEntrevista', function (servicioRest, $scope, $rootScope, $log, $mdDialog, $location) {
 
	$rootScope.cargando = false;
    $rootScope.logueado = true;
    $rootScope.rolUsuario = "img/entrevistado.svg";
	
	if ($rootScope.pulsaBoton === undefined || !$rootScope.pulsaBoton) {
		$location.path('/admin');
	}
	
	/* ---------------------------------------------------
	-------------------- Para probar ---------------------
	--------------------------------------------------- */
	
	//$rootScope.indiceEntrevistaSeleccionada = "5694e974f371495c2291c5c2"; //2 preguntas abierta
	//$rootScope.indiceEntrevistaSeleccionada = "568fb06fccef6ff8108d0859"; //2 preguntas test
	//$rootScope.indiceEntrevistaSeleccionada = "568fb061ccef6ff8108d0858"; //2 preguntas multiples
	$rootScope.indiceEntrevistaSeleccionada = "56962a9d8c5d19002284d4e4"; //6 preguntas combinadas
	/* ---------------------------------------------------
	-------------------- Para probar ---------------------
	--------------------------------------------------- */
	$scope.hacerPreguntas = true;
	$scope.aceptarPreguntas = false;
	$scope.acabarEntrevista = false;
	$scope.respuestas = [];
	$scope.correccion = [];
	$scope.correccionStyle = {};
	$scope.correccionTest = [];
	$scope.tieneDirectiva = false;
	
	var respondidas = [];
	
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
      		$scope.hacerPreguntas = false;
			$scope.aceptarPreguntas = true;
			var answers = {
				answers: $scope.respuestas
			}
			servicioRest.posrtRespuestasEntrevista($rootScope.indiceEntrevistaSeleccionada, answers)
				.then(function(data) {
					$scope.hacerPreguntas = false;
					$scope.aceptarPreguntas = true;
				
				}).catch(function(err) {
					$log.error("Error al guardar las respuestas: " + err);
				});
    	});
  };
	
	
	$scope.seguirEntrevista = function () {
		$scope.aceptarPreguntas = false;
		$scope.acabarEntrevista = true;
		var auxCorreccion = {};
		for (var i = 0; i < $scope.preguntas.length; i++) {
			if ($scope.preguntas[i].type === "FREE") {
				auxCorreccion.type = "FREE";
				auxCorreccion.title = $scope.preguntas[i].title;
				if ($scope.respuestas[i] === undefined) {
					auxCorreccion.answer = "No ha contestado a la pregunta";
					$scope.correccionStyle[i] = {"color":"red"};
				} else {
					auxCorreccion.answer = $scope.respuestas[i];						
				}
				if($scope.preguntas[i].directive != undefined) {
					auxCorreccion.directive = $scope.preguntas[i].directive;
					$scope.tieneDirectiva = true;
				} else {
					auxCorreccion.directive = "";
				}			
				$scope.correccion[i] = {
					type: "FREE",
					title: auxCorreccion.title,
					answer: auxCorreccion.answer,
					directive: auxCorreccion.directive
				}
				
			} else if ($scope.preguntas[i].type === "SINGLE_CHOICE") {
				$scope.correccion[i] = {
					type: $scope.preguntas[i].type,
					title: $scope.preguntas[i].title,
					answers: $scope.preguntas[i].answers
				}
				$scope.correccionTest[i] = $scope.respuestas[i];
				//hay que inicializar el array en esa posicion a un objeto
				$scope.correccionStyle[i] = {};
				//señalo las respuestas correctas en verde
				for(var j = 0; j < $scope.preguntas[i].answers.length; j++) {
					if ($scope.preguntas[i].answers[j].valid === true) {
						$scope.correccionStyle[i][j] = {"color":"#04B704"};
						break;
					}
				}
				//compruebo si las respuestas son correctas, si no lo son se marcan en rojo
				if($scope.correccionStyle[i][$scope.respuestas[i]] === undefined) {
					$scope.correccionStyle[i][$scope.respuestas[i]] = {"color":"red"};
				}
				
			} else {
				$scope.correccion[i] = {
					type: $scope.preguntas[i].type,
					title: $scope.preguntas[i].title,
					answers: $scope.preguntas[i].answers
				}
				//hay que inicializar el array en esa posicion a un objeto
				$scope.correccionStyle[i] = {};
				//señalo las respuestas correctas en verde
				for( var j = 0; j < $scope.preguntas[i].answers.length; j++) {
					if ($scope.preguntas[i].answers[j].valid === true) {
						$scope.correccionStyle[i][j] = {"color":"#04B704"};
					}
				}
				//compruebo si las respuestas son correctas, si no lo son se marcan en rojo
				if($scope.respuestas[i] != undefined) {
					$scope.correccionTest[i] = $scope.respuestas[i];
					for (var key in $scope.respuestas[i]) {
						if ($scope.correccionStyle[i][key] === undefined) {
							$scope.correccionStyle[i][key] = {"color":"red"};
						}
						
					}
				}
			}
		}
	}
	
	$scope.cerrarEntrevista = function () {
		$location.path("/admin");
	}
});