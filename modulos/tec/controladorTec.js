app.controller('controladorTec', function (servicioRest, $scope, $rootScope, $mdDialog, $timeout, $q, $log, $mdToast, $location) {
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	function escribirTipo() {
		for (var i = 0; i < $scope.preguntas.length; i++) {
			if ($scope.preguntas[i].type === "FREE") {
				$scope.preguntas[i].type = "Pregunta abierta";
			} else if ($scope.preguntas[i].type === "SINGLE_CHOICE") {
				$scope.preguntas[i].type = "Pregunta tipo test";
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
				console.log("Error");
				console.log(err);
				if(err === 'No token provided.') {
					$location.path('/');
				}
				$log.error("Error al cargar los temas: " + err);
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
	
	var simulateQuery = false, temas, temasCargados;
	var filtroTemas = {
		tags: []
	};
	
	$rootScope.cargando = false;
    $rootScope.logueado = true;
    $rootScope.rolUsuario = "img/tecnico.svg";
    
    /*---------------------------Inicializar lista------------------------------*/
    
	getPreguntas();
    
    /*--------------------------Funciones--------------------------*/
	function cargarTemas() {
		temasCargados = temas;
		return temasCargados.map(function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;
		});
	}
    
    $scope.eliminar = function (indice) {
        var idPregunta = $scope.preguntas[indice]._id;
        servicioRest.deletePregunta(idPregunta)
			.then(function (data) {
				$scope.preguntas.splice(indice, 1);
				servicioRest.getTemas()
					.then(function (data) {
						temas = data;
						temasCargados = cargarTemas();
					})
					.catch(function (err) {
						$log.error("Error cargar los temas: " + err);
					});
			})
			.catch(function (err) {
				$log.error("Error al eliminar la pregunta: " + err);
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
							tipo = "Pregunta Abierta";
						} else if (pregunta.type === "SINGLE_CHOICE") {
							tipo = "Pregunta Tipo Test";
						} else {
							tipo = "Pregunta Tipo Test Abierto";
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
	var simulateQuery = false;
	
	$rootScope.obtenerTemas = function () {
		servicioRest.getTemas()
			.then(function (data) {
				temas = data;
				temasCargados = cargarTemas();
			})
			.catch(function (err) {
				$log.error("Error al cargar los temas: " + err);
			});
	};
	
	$rootScope.obtenerTemas();
	
	function buscarTema(tema) {
		for (var i = 0; i < temasCargados .length; i++) {
			if (tema === temasCargados[i].valor) {
				return i;
			}
		}
		return -1;
	}
	
	//Al introducir un tema nuevo filtra las preguntas por el mismo
	/*function selectedItemChange(item) {
		if (item !== undefined) {
			var tema = {
				tags: [String]
			};
			tema.tags = item.tag.toLowerCase();
			servicioRest.postPreguntasByTag(tema)
				.then(function (data) {
					$scope.preguntas = data;
					escribirTipo();
				})
				.catch(function (err) {
					$scope.preguntas = null;
					$log.error("Error al filtrar el tema: " + err);
				});
		}
    }*/
	
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
				})
				.catch(function (err) {
					$scope.preguntas = null;
					$log.error("Error al filtrar el tema: " + err);
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
			selectedItemChange(chip)
			return temasCargados[index];
		}
		return null;
    }
});
