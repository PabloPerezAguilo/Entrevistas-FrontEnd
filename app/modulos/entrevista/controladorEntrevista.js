app.controller('controladorEntrevista', function (servicioRest, $scope, $rootScope, $log, $mdDialog, $location, $http, $mdToast) {
	$rootScope.verCabecera = false;
	
	if (sessionStorage.getItem("mostrar") === null) {
		sessionStorage.setItem("mostrar", 'bienvenida');
	}
	
	if (sessionStorage.getItem("rol") !== null) {
		$rootScope.rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol")) {
		$rootScope.rol = localStorage.getItem("rol");
	}
	
	if ($rootScope.rol === undefined) {
		$rootScope.cerrarSesion();
		return null;
	} else if (sessionStorage.getItem("permiso") === null && $rootScope.rol === "ROLE_ADMIN") {
		$location.path('/admin');
		return null;
	} else if ($rootScope.rol === "ROLE_TECH") {
		$location.path('/tec');
		return null;
	} else if (sessionStorage.getItem("ver")) {
		$location.path('/respuestasEntrevista');
		return null;
	} else {
		//muestra la pagina cuando se comprueba que no ha entrado aqui incorrectamente
		$scope.mostrar = sessionStorage.getItem("mostrar");
		$rootScope.verCabecera = true;
	}
	
	var token = sessionStorage.getItem("token");
	$http.defaults.headers.common['x-access-token'] = token;
	
	
	
	
	
	Storage.prototype.setObj = function (key, obj) {
		return this.setItem(key, JSON.stringify(obj));
	};
	Storage.prototype.getObj = function (key) {
		return JSON.parse(this.getItem(key));
	};
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	if ($rootScope.temas !== undefined) {
		sessionStorage.setObj("temas", $rootScope.temas);
	} else {
		$rootScope.temas = sessionStorage.getObj("temas");
	}
	
	
	
	
	$rootScope.cargando = false;
	$rootScope.conFooter = false;
    $rootScope.logueado = false;
	
	$scope.nivelUsuario = [];
	$scope.respuestas = [];
	
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
	
	$scope.bienvenida = function() {
		sessionStorage.setItem("mostrar", 'evaluacion');
		$scope.mostrar = sessionStorage.getItem("mostrar");
	}
	
	if ($rootScope.indiceEntrevistaSeleccionada !== undefined) {
		sessionStorage.setItem("id", $rootScope.indiceEntrevistaSeleccionada);
	}
	var id = sessionStorage.getItem("id");
	
	function nivelesValidos () {
		for (var i = 0; i < $rootScope.temas.length; i++) {
			if ($scope.nivelUsuario[i] === undefined) {
				return false;
			}
		}
		return true;
	}
	
	$scope.evaluacion = function() {
		if (nivelesValidos()) {
			var evaluacion = [];
			for (var i = 0; i < $rootScope.temas.length; i++) {
				evaluacion.push({
					tag: $rootScope.temas[i].tag,
					nota: $scope.nivelUsuario[i]
				});
			}
			servicioRest.postEvaluacion(id, evaluacion)
				.then(function (data) {
					console.log(data);
					sessionStorage.setItem("mostrar", 'entrevista');
					$scope.mostrar = sessionStorage.getItem("mostrar");
				})
				.catch(function (err) {
					$log.error("Error al guardar la valoración: " + err);
				})
		} else {
			toast("Debe indicar un nivel para cada tema")
		}
	}
	
	if($rootScope.nombre !== undefined) {
		sessionStorage.setItem("nombreEntrevistado", $rootScope.nombre);
	}
	
	$scope.nombreEntrevistado = sessionStorage.getItem("nombreEntrevistado");
	
	
	
	
	
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
					sessionStorage.setItem("mostrar", 'mensajeFinal');
					$scope.mostrar = sessionStorage.getItem("mostrar");
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