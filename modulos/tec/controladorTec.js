app.controller('controladorTec', function (servicioRest, $scope, $rootScope, $mdDialog, $timeout, $q, $log, $mdToast) {
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	function escribirTipo(preguntas) {
		var i;
		for (i = 0; i < preguntas.length; i++) {
			if (preguntas[i].type === "FREE") {
				preguntas[i].type = "Pregunta Abierta";
			} else if (preguntas[i].type === "SINGLE_CHOICE") {
				preguntas[i].type = "Pregunta Tipo Test";
			} else {
				preguntas[i].type  = "Pregunta Tipo Test Abierto";
			}
		}
	}
	
	function getPreguntas() {
		servicioRest.getPreguntas()
			.then(function (data) {
				$scope.preguntas = data;
				escribirTipo($scope.preguntas);
			})
			.catch(function (err) {
				$log.error("Error al cargar los temas: " + err);
			});
	}
    
    /*---------------------------Inicializar vista------------------------------*/
    var Options = {
        title: String,
        valid: Boolean
    }, pregunta = {
        _id: { type: String },
        title: { type: String, required: true },
        type: { type: String, required: true },
        tags: [String],
        level: { type: Number, min: 1, max: 10, required: true },
        directive: { type: String },
        answers: [Options]
	}, simulateQuery = false;
	
	$rootScope.cargando = false;
    $rootScope.logueado = true;
    $rootScope.rolUsuario = "img/tecnico.svg";
    
    /*---------------------------Inicializar lista------------------------------*/
    
	getPreguntas();
    
    /*--------------------------Funciones--------------------------*/

	$rootScope.cargarTemas = function () {
		var temasCargados = $rootScope.temas;
		return temasCargados.map(function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;
		});
	};
    
    $scope.eliminar = function (indice) {
        var idPregunta = $scope.preguntas[indice]._id;
        servicioRest.deletePregunta(idPregunta)
			.then(function (data) {
				$scope.preguntas.splice(indice, 1);
				servicioRest.getTemas()
					.then(function (data) {
						$scope.temas = data;
						$scope.temasCargados = cargarTemas();
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
                        console.log(data);
						$rootScope.obtenerTemas();
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
	
	$rootScope.obtenerTemas = function () {
		servicioRest.getTemas()
			.then(function (data) {
				$rootScope.temas = data;
				$rootScope.temasCargados = $rootScope.cargarTemas();
			})
			.catch(function (err) {
				$log.error("Error al cargar los temas: " + err);
			});
	};
	
	$rootScope.obtenerTemas();
	
	//Al seleccionar un chip lo crea o lo añade al array de tags
	function selectedItemChange(item) {
		$log.info('Item recogido ' + JSON.stringify(item));
		if (item !== undefined) {
			var tema = {
				tags: [String]
			};
			tema.tags = item.tag.toLowerCase();
			servicioRest.postPreguntasByTag(tema)
				.then(function (data) {
					$scope.preguntas = data;
					escribirTipo($scope.preguntas);
				})
				.catch(function (err) {
					$scope.preguntas = null;
					$log.error("Error al crear el tema: " + err);
				});
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
		
		var results = query ? $scope.temasCargados.filter(filtrar(query)) : $scope.temasCargados,
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
		if ($scope.listaTemas.length === 0) {
			getPreguntas();
		} else {
			var tema = {
				tags: [String]
			}, i;
			for (i = 0; i < $scope.listaTemas.length; i++) {
				tema.tags[i] = $scope.listaTemas[i].tag;
			}
			servicioRest.postPreguntasByTag(tema)
				.then(function (data) {
					$scope.preguntas = data;
					escribirTipo($scope.preguntas);
				});
		}
	};
});
