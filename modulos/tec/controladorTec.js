app.controller('controladorTec', function(servicioRest, $scope, $rootScope, $mdDialog, $timeout, $q, $log) {
    
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
	
	$rootScope.cargando = false;
    $rootScope.logueado = true;
    $rootScope.rolUsuario = "Técnico";
    
    /*---------------------------Inicializar lista------------------------------*/
    
    servicioRest.getPreguntas()
		.then(function (data) {
			$scope.preguntas = data;
		})
		.catch(function (err) {
			console.log("Error");
        	console.log(err);
    	});
    
    /*--------------------------Funciones--------------------------*/        

    
    $scope.eliminar = function (indice) {
        var idPregunta = $scope.preguntas[indice]._id;
        servicioRest.deletePregunta(idPregunta)
			.then(function(data) {
				$scope.preguntas.splice(indice, 1);
			})
			.catch(function(err) {
				console.log("Error");
            	console.log(err);
			});
	};
    
    $scope.crear = function(ev) {
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
            
                if(datosPregunta.type === "FREE") {
                    pregunta.directive = datosPregunta.directive;
                    pregunta.answers = null;
                }
                else {
                    pregunta.directive = null;
                    pregunta.answers = datosPregunta.answers; 
                }
                servicioRest.postPregunta(pregunta)
                    .then(function(data) {
                    pregunta._id = data.data._id;
                        $scope.preguntas.push({
                            _id: pregunta._id,
                            title: pregunta.title,
                            tags: pregunta.tags,
                            level: pregunta.level,
                            directive: pregunta.directive,
                            answers: pregunta.answers,
                            type: pregunta.type
                        })
                        console.log(data);
                    })
                    .catch(function(err) {
                        console.log("Error");
                    	console.log(err);
                    });
			});
    };
	
	$scope.ver = function(ev,ind) {
    	$mdDialog.show({
            locals: {
                indice: ind
            },
            scope: $scope.$new(),
      		controller: 'controladorVer',
      		templateUrl: 'modulos/tec/ver.tmpl.html',
      		parent: angular.element(document.body),
      		targetEvent: ev,
      		clickOutsideToClose: true
    	})
	};
	
	/* ----------------- AUTOCOMPLETE ---------------- */
	var self = this;
	$scope.temas;
	$scope.temasCargados;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchText = null;	
	$scope.listaTemas = [];
	self.simulateQuery = false;
	
	servicioRest.getTemas()
		.then(function(data) {
			$scope.temas = data;
			$scope.temasCargados = cargarTemas();
		})
		.catch(function (err) {
		});
	
    function cargarTemas() {
		var temasCargados = $scope.temas;
		return temasCargados.map( function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;          
      });
	}
	
	function selectedItemChange(item) {

      $log.info('Item recogido ' + JSON.stringify(item));
		console.log(item);
		if(item != null) {
			var tema = {
				tags: [String]
			}
			tema.tags = item.tag;
			servicioRest.postPreguntasByTag(tema)
				.then(function(data) {
					$scope.preguntas = data;
				})
				.catch(function (err) {
					console.log(err);
				});
			}
    }
	
	function searchTextChange(text) {
		$log.info('texto seleccionado ' + text);
    }
	
    /**
     * Return the proper object when the append is called.
     */
    $scope.transformChip = function transformChip(chip) {
		// If it is an object, it's already a known chip
		if (angular.isObject(chip)) {
			return chip;
		}
		return { valor: chip};
	}
	
    function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		
		return function filterFn(tema) {
			return (tema.valor.indexOf(lowercaseQuery) === 0);
		};
	}
		
    $scope.queryBuscarTema = function (query) {
		
		var results = query ? $scope.temasCargados.filter( filtrar(query) ) : $scope.temasCargados,
			deferred;
		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve( results );
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
	
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (tema) {
			$scope.texto = tema.tag;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
});