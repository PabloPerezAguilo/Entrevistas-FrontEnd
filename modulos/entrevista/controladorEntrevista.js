app.controller('controladorEntrevista', function (servicioRest, $scope, $rootScope, $log, $mdDialog, $location, $http) {
	
	function escribirSaltosDeLinea(pregunta) {
		if (pregunta !== null) {
			var titulo = pregunta.title;
			var pos = [];
			var cont = 0;
			for (var i = 0; i < titulo.length; i++) {
				if(titulo.charAt(i) === '\n') {
					pos[cont] = i;
					cont++;
				}
			}
			pregunta.title = [];
			if(pos.length > 0) {
				pregunta.title[0] = titulo.substring(0, pos[0]);
				for (var i = 0; i < pos.length; i++) {
					pregunta.title[i] = titulo.substring(pos[i - 1] + 1, pos[i]);
				}
				pregunta.title[pregunta.title.length] = titulo.substring(pos[pos.length - 1] + 1, titulo.lastIndex);
			} else {
				pregunta.title[0] = titulo;
			}
		}
	}
	
	
	$rootScope.cargando = false;
	$rootScope.conFooter = false;
    $rootScope.logueado = false;
	
	if ($rootScope.indiceEntrevistaSeleccionada !== undefined) {
		sessionStorage.setItem("id", $rootScope.indiceEntrevistaSeleccionada);
	}
	
	var id = sessionStorage.getItem("id");
	
	var token = sessionStorage.getItem("token");
	
	var permiso = sessionStorage.getItem("permiso");
	
	var ver = sessionStorage.getItem("ver");
	
	var rol;
	if (sessionStorage.getItem("rol") !== null) {
		rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol") !== null) {
		rol = localStorage.getItem("rol");
	}
	
	if (rol === undefined) {
		$location.path('/');
	} else if (permiso === null && rol === "ROLE_ADMIN") {
		$location.path('/admin');
	} else if (rol === "ROLE_TECH") {
		$location.path('/tec');
	} else if (ver) {
		$location.path('/respuestasEntrevista');
	}
	
	$http.defaults.headers.common['x-access-token'] = token;

	$scope.hacerPreguntas = true;
	$scope.respuestas = [];
	
	var respondidas = [], notaMax = 0, nota = 0;
	
	function getPreguntas() {
		servicioRest.getPreguntasEntrevistaById(id)
				.then(function (data) {
					$scope.preguntas = data;
					for (var i = 0; i < $scope.preguntas.length; i++) {
						escribirSaltosDeLinea($scope.preguntas[i]);
					}
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
			servicioRest.postRespuestasEntrevista(id, answers)
				.then(function(data) {
					$scope.hacerPreguntas = false;
				}).catch(function(err) {
					$log.error("Error al guardar las respuestas: " + err);
				});
    	});
  };
	
	$scope.aceptarBtn = function () {
		$location.path("/respuestasEntrevista");
		sessionStorage.setItem("ver", true);
		sessionStorage.removeItem("permiso");
	}
});