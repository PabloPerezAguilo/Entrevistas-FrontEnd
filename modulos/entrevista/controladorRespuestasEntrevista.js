app.controller('controladorRespuestasEntrevista', function (servicioRest, $scope, $rootScope, $log, $mdDialog, $location) {
	
	$rootScope.cargando = false;
    $rootScope.logueado = true;
	$scope.correccion = [];
	$scope.correccionStyle = {};
	$scope.correccionTest = [];
	$scope.tieneDirectiva = [];
	$scope.notaPregunta = [];
	var preguntas = [], respuestas = [];
	
	function calcularResultados () {
		var nota = 0, notaMax = 0;
		var auxCorreccion = {};
		for (var i = 0; i < preguntas.length; i++) {
			
			if(preguntas[i] != null) {
				if (preguntas[i].type === "FREE") {
					auxCorreccion.type = "FREE";
					auxCorreccion.title = preguntas[i].title;
					if (respuestas[i] === undefined) {
						auxCorreccion.answer = "No ha contestado a la pregunta";
						$scope.correccionStyle[i] = {"color":"red"};
					} else {
						auxCorreccion.answer = respuestas[i];						
					}
					if(preguntas[i].directive != undefined) {
						auxCorreccion.directive = preguntas[i].directive;
						$scope.tieneDirectiva[i] = true;
					} else {
						auxCorreccion.directive = "";
					}			
					$scope.correccion[i] = {
						type: "FREE",
						title: auxCorreccion.title,
						answer: auxCorreccion.answer,
						directive: auxCorreccion.directive
					}

				} else if (preguntas[i].type === "SINGLE_CHOICE") {
					notaMax++;
					$scope.correccion[i] = {
						type: preguntas[i].type,
						title: preguntas[i].title,
						answers: preguntas[i].answers
					}
					$scope.correccionTest[i] = respuestas[i];
					//hay que inicializar el array en esa posicion a un objeto
					$scope.correccionStyle[i] = {};
					//señalo las respuestas correctas en verde
					for(var j = 0; j < preguntas[i].answers.length; j++) {
						if (preguntas[i].answers[j].valid === true) {
							$scope.correccionStyle[i][j] = {"color":"#04B704"};
							break;
						}
					}
					//compruebo si la respuesta es correcta, si no lo es la marco en rojo y no sumo a la puntuación
					if($scope.correccionStyle[i][respuestas[i]] === undefined) {
						$scope.correccionStyle[i][respuestas[i]] = {"color":"red"};
						$scope.notaPregunta[i] = 0;
					} else {
						nota++;
						$scope.notaPregunta[i] = 1;
					}

				} else if (preguntas[i].type === "MULTI_CHOICE"){
					notaMax++;
					$scope.correccion[i] = {
						type: preguntas[i].type,
						title: preguntas[i].title,
						answers: preguntas[i].answers
					}
					//hay que inicializar el array en esa posicion a un objeto
					$scope.correccionStyle[i] = {};
					
					//señalo las respuestas correctas en verde
					for(var j = 0; j < preguntas[i].answers.length; j++) {
						if (preguntas[i].answers[j].valid === true) {
							$scope.correccionStyle[i][j] = {"color":"#04B704"};
						}
					}
					var respuestaAux = [];
					//compruebo si las respuestas son correctas, si no lo son se marcan en rojo
					if(respuestas[i] != undefined) {
						var notaAux = preguntas[i].answers.length;
						$scope.correccionTest[i] = respuestas[i];
						for (var key in respuestas[i]) {
							if ($scope.correccionStyle[i][key] === undefined) {
								$scope.correccionStyle[i][key] = {"color":"red"};
							}
							respuestaAux[key] = true;
						}
						
						//calculo la puntuacion asociada a esa pregunta
						for (var j = 0; j < preguntas[i].answers.length; j++) {
							if(respuestaAux[j] === true && preguntas[i].answers[j].valid === false) {
								notaAux--;
							} else if (preguntas[i].answers[j].valid === true && respuestaAux[j] === undefined) {
								notaAux--;
							}
						}
						if(notaAux > 0) {
							nota += notaAux / preguntas[i].answers.length;
							$scope.notaPregunta[i] = (notaAux / preguntas[i].answers.length).toFixed(2);
						}
					} else {
						$scope.notaPregunta[i] = 0;
					}
				}
			} else {
				$scope.correccion[i] = null;
			}
		}
		$scope.nota = (nota / notaMax * 10).toFixed(2);
	}
	
	function getPreguntas() {
		servicioRest.getPreguntasEntrevistaById($rootScope.indiceEntrevistaSeleccionada)
				.then(function (data) {
					preguntas = data;
					calcularResultados();
				})
				.catch(function (err) {
					preguntas = null;
					$log.error("Error al cargar las preguntas: " + err);
				});
	}
	
	function getRespuestas() {
		servicioRest.getEntrevistas($rootScope.indiceEntrevistaSeleccionada)
			.then(function (data) {
				respuestas = data.answers;
				$scope.observaciones = data.feedback;
				getPreguntas();
			})
			.catch(function (err) {
				preguntas = null;
				$log.error("Error al cargar las respuestas: " + err);
			});
	}
	
	getRespuestas();
	
	$scope.cerrarEntrevista = function () {
		var enviarPost = {
			feedback: $scope.observaciones
		};
		
		servicioRest.postFeedback($rootScope.indiceEntrevistaSeleccionada, enviarPost)
			.then(function(data) {
				$location.path("/admin");
			}).catch(function(err) {
				$log.error("Error al guardar las observaciones de la entrevista: " + err);
			});
	}
});