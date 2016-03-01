app.controller('controladorTec', function (servicioRest, $scope, $rootScope, $mdDialog, $timeout, $q, $log, $mdToast, $location, $http) {
	
	$scope.verTecnico = false;
	$rootScope.verCabecera = false;
	$rootScope.cargandoSesion = false;
	
	if (sessionStorage.getItem("rol") !== null) {
		$rootScope.rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol") !== null) {
		$rootScope.rol = localStorage.getItem("rol");
	}
	
	if (localStorage.getItem("usuario") !== null) {
		$rootScope.usuario = localStorage.getItem("usuario");
	} else {
		$rootScope.usuario = sessionStorage.getItem("usuario");
	}
	
	if (sessionStorage.getItem("permiso")) {
		$location.path("/entrevista");
		return null;
	} else if(sessionStorage.getItem("ver")) {
		$location.path("/respuestasEntrevista");
		return null;
	} else if ($rootScope.rol === "ROLE_ADMIN") {
		//cuando entra a tec desde admin
		$location.path("/admin");
		return null;
	} else if ($rootScope.rol === undefined) {
		$rootScope.cerrarSesion();
		return null;
	} else {
		//muestra la pagina cuando se comprueba que no ha entrado aqui incorrectamente
		$scope.verTecnico = true;
		$rootScope.verCabecera = true;
	}
	
	var token = sessionStorage.getItem("token");
	if(token !== null) {
		$http.defaults.headers.common['x-access-token'] = token;
	}
	
	//para quitar el foco de los txt en las tablets android que se queda ahi pillado sin esta sentencia 
	//(se obliga poner el foco en un boton random de la app)
	$scope.quitarFoco = function() {
		if (navigator.userAgent.match(/Android/i)) {
			document.getElementById("botonid").focus();
		}
	}
	
	$scope.introOptions = {
        steps:[
			{
				element: '#seccionTec',
				intro: 'Esta es la sección del técnico, aquí podrá ver el listado de las preguntas creadas, ' +
					'ver en detalle una pregunta, eliminar preguntas y abrir una pantalla para crear nuevas preguntas'
			},
			{
				element: '#elementoListaPreguntas',
				intro: 'Este es el listado de todas las preguntas creadas'
			},
			{
				element: '#idBtnCrearTec',
				intro: 'Pulsando en este botón se abrirá una pantalla con los campos necesarios para crear una pregunta'
			},
			{
				element: '#idBuscadorTec',
				intro: 'Aquí podrá filtrar las preguntas en función de las aptitudes deseadas'
			},
			{
				element: '#ver',
				intro: 'Pulsando en este botón se abrirá una pantalla con la información detallada de la pregunta'
			},
			{
				element: '#eliminar',
				intro: 'Pulsando aquí podrá eliminar la pregunta'
			}
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>Siguiente</strong>',
        prevLabel: '<span>Anterior</span>',
        skipLabel: 'Cerrar',
        doneLabel: 'Fin'
    };
	
	setTimeout(function() {
		$rootScope.lanzarAyuda = $scope.lanzarAyuda;
	}, 1000);
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	$scope.hayPreguntas = false;
	
	function escribirTipo() {
		var i;
		for (i = 0; i < $scope.preguntas.length; i++) {
			if ($scope.preguntas[i].type === "FREE") {
				$scope.preguntas[i].type = "Pregunta abierta";
			} else if ($scope.preguntas[i].type === "SINGLE_CHOICE") {
				$scope.preguntas[i].type = "Pregunta tipo Test";
			} else {
				$scope.preguntas[i].type  = "Pregunta de selección múltiple";
			}
		}
	}
	
	function getPreguntas() {
		servicioRest.getPreguntas()
			.then(function (data) {
				$scope.preguntas = data;
				escribirTipo();
			})
			.catch(function (err) {
				$log.error("Error al cargar las preguntas: " + err);
				
				if (err === 403 || err === 'Servicio no disponible') {
					if (err === 403) {
						toast("Su sesión ha expirado");
					} else {
						toast("Error de conexión");
					}
					$rootScope.cerrarSesion();
				}
			});
	}
    
    /*---------------------------Inicializar vista------------------------------*/
    var Options = {
        title: String,
        valid: Boolean
	};
	var pregunta = {
        _id: { type: String },
        title: { type: String, required: true },
        type: { type: String, required: true },
        tags: [String],
        level: { type: Number, min: 1, max: 10, required: true },
        directive: { type: String },
        answers: [Options]
	};
	var simulateQuery = false, temasCargados;
	var filtroTemas = {
		tags: []
	};
	
	$rootScope.cargando = false;
    $rootScope.logueado = true;
	$rootScope.conFooter = true;
    $rootScope.rolUsuario = "img/tecnico.svg";
    
    /*---------------------------Inicializar lista------------------------------*/
    
	getPreguntas();
    
    /*--------------------------Funciones--------------------------*/		
    $scope.eliminar = function (ev, indice) {
        var idPregunta = $scope.preguntas[indice]._id;
		
		var confirm = $mdDialog.confirm()
        	.title('Procederás a borrar la pregunta')
			.textContent('¿Estás seguro?')
			.ariaLabel('Confirmacion borrar pregunta')
			.targetEvent(ev)
			.ok('Sí')
			.cancel('No');

    	$mdDialog.show(confirm).then(function() {
			servicioRest.deletePregunta(idPregunta)
				.then(function (data) {
					$scope.preguntas.splice(indice, 1);
					$rootScope.obtenerTemas();
				})
				.catch(function (err) {
					$log.error("Error al eliminar la pregunta: " + err);
				});
    	});
	};
    
    $scope.crear = function (ev) {
        $mdDialog.show({
            controller: 'controladorCrear',
            templateUrl: 'modulos/tec/crear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })
			.then(function (datosPregunta) {
				pregunta.title = datosPregunta.title;
                pregunta.tags = datosPregunta.tags;
                pregunta.level = datosPregunta.level;
                pregunta.type = datosPregunta.type;
            
                if (datosPregunta.type === "FREE") {
                    pregunta.directive = datosPregunta.directive;
                    pregunta.answers = null;
                } else {
                    pregunta.directive = null;
                    pregunta.answers = datosPregunta.answers;
                }
                servicioRest.postPregunta(pregunta)
                    .then(function (data) {
						pregunta._id = data.data._id;
						var tipo = '';
						if (pregunta.type === "FREE") {
							tipo = "Pregunta abierta";
						} else if (pregunta.type === "SINGLE_CHOICE") {
							tipo = "Pregunta tipo Test";
						} else {
							tipo = "Pregunta de selección múltiple";
						}
                        $scope.preguntas.push({
                            _id: pregunta._id,
                            title: pregunta.title,
                            tags: pregunta.tags,
                            level: pregunta.level,
                            directive: pregunta.directive,
                            answers: pregunta.answers,
                            type: tipo
                        });
                    })
                    .catch(function (err) {
                        $log.error("Error al crear la pregunta: " + err);
                    });
			
				if (filtroTemas.tags.length != 0) {
					servicioRest.postPreguntasByTag(filtroTemas)
					.then(function (data) {
						$scope.preguntas = data;
						escribirTipo();
					})
					.catch(function (err) {
						$scope.preguntas = null;
						$log.error("Error al filtrar el tema: " + err);
					});
				} else {
					getPreguntas();
				}
			});
    };
	
	$scope.ver = function (ev, ind) {
		$mdDialog.show(
			{
				locals: { indice: ind },
				scope: $scope.$new(),
				controller: 'controladorVer',
				templateUrl: 'modulos/tec/ver.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			}
		);
	};
	
	/* ----------------- AUTOCOMPLETE ---------------- */
	$scope.listaTemas = [];
	
	function cargarTemas(temas) {
		return temas.map(function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;
		});
	}
	
	$rootScope.obtenerTemas = function () {
		servicioRest.getTemas()
			.then(function (data) {
				temasCargados = cargarTemas(data);
			})
			.catch(function (err) {
				$log.error("Error al cargar los temas: " + err);
			});
	};
	
	$rootScope.obtenerTemas();
	
	function buscarTema(tema) {
		var i;
		for (i = 0; i < temasCargados.length; i++) {
			if (tema === temasCargados[i].valor) {
				return i;
			}
		}
		return -1;
	}
	
	//Al introducir un tema nuevo filtra las preguntas por el mismo
	function selectedItemChange(item) {
		
		if(item !== undefined) {
			if (!angular.isObject(item)) {
				item = {
					tag: item,
					valor: item.toLowerCase()
				};
			}
			var index = buscarTema(item.valor);

			if (index !== -1) {
				filtroTemas.tags.push(temasCargados[index].tag);
				
				servicioRest.postPreguntasByTag(filtroTemas)
				.then(function (data) {
					$scope.preguntas = data;
					escribirTipo();
					$scope.hayPreguntas = false;
				})
				.catch(function (err) {
					$scope.hayPreguntas = true;
					$scope.preguntas = null;
					$log.error("Error al filtrar el tema: " + err.data.message);
				});
			}
			
		}
    }
	
	$scope.selectedItemChange = selectedItemChange;
	
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (tema) {
			$scope.texto = tema.valor;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
	
    $scope.queryBuscarTema = function (query) {
		
		var results = query ? temasCargados.filter(filtrar(query)) : temasCargados,
			deferred;
		if (simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	};
	
	$scope.deleteChip = function () {
		filtroTemas.tags = [];
		if ($scope.listaTemas.length === 0) {
			getPreguntas();
			$scope.hayPreguntas = false;
		} else {
			for (var i = 0; i < $scope.listaTemas.length; i++) {
				filtroTemas.tags[i] = $scope.listaTemas[i].tag;
			}
			servicioRest.postPreguntasByTag(filtroTemas)
				.then(function (data) {
					$scope.preguntas = data;
					escribirTipo();
				});
		}
	};
		
	//Cada vez que se crea un chip se llama a esta funcion
	$scope.transformChip = function (chip) {
		if (angular.isObject(chip)) {
			return chip;
		}
		
		var index = buscarTema(chip.toLowerCase());
		if (index !== -1) {
			selectedItemChange(chip);
			return temasCargados[index];
		}
		
		$mdDialog.show(
			$mdDialog.alert()
			.clickOutsideToClose(true)
			.title('Esta aptitud no existe')
			.textContent('Debes escoger una aptitud de la lista')
			.ariaLabel('Alert no existe tema')
			.ok('Ok')
    );
		return null;
    };
});
