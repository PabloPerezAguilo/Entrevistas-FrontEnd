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

    self.simulateQuery = false;
    self.isDisabled    = false;

    $scope.querySearch   = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;
	
	servicioRest.getTemas()
		.then(function(data) {
			self.listaTemas = data;			
			$scope.temas = data;
			cadenaTemas();
			$scope.listaTemas = loadAll();
		})
		.catch(function (err) {
		});

   
    function querySearch (query) {
		var results = query ? self.listaTemas.filter( filtrar(query) ) : self.listaTemas,
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
    };

    function searchTextChange(text) {
		$log.info('texto seleccionado ' + text);
    }

    function selectedItemChange(item) {

      $log.info('Item recogido ' + JSON.stringify(item));
		if(item != null) {
			var tema = {
				tag: String
			}
			tema.tag = item.tag;
			servicioRest.postPreguntasByTag(tema)
				.then(function(data) {
					$scope.preguntas = data;
				})
				.catch(function (err) {
					console.log(err);
				});
			}
    }
	
	function cadenaTemas() {
		for(var i = 0; i < $scope.temas.length; i++) {
			$scope.cadena += $scope.temas[i].tag + '*' + i + ', ';
		}
	}

    function loadAll() {
		
		var allTags = $scope.cadena;
		return allTags.split(/, +/g).map(function(tema) {
			return {
				value: tema.toLowerCase()
			};
		});
    };
	
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (tema) {
			$scope.texto = tema.tag;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
});