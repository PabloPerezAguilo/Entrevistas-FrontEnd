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
    $scope.terminarCrear = function () {
        $scope.p = false;
        pregunta.title = $scope.titulo;
        pregunta.tags[0] = $scope.tema;
        pregunta.level = $scope.nivel;
        pregunta.type = $scope.tipo;
        if($scope.tipo === "FREE") {
            pregunta.answers = null;
        }
        else {
            //pregunta.answers=$scope.respuestas;
           pregunta.answers = null; 
        }
        servicioRest.postPregunta(pregunta)
			.then(function(data) {
            pregunta._id = data.data._id;
				$scope.preguntas.push({
                    _id: pregunta._id,
                    title: pregunta.title,
                    tags: pregunta.tags[0],
                    level: pregunta.level,
                    type: pregunta.type
                })
			})
			.catch(function(err) {
				console.log("Error");
            	console.log(err);
			});
    };
    
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
                            tags: pregunta.tags[0],
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
			})
    };
	
	$scope.ver = function(ev) {
    	$mdDialog.show({
      		controller: 'controladorVer',
      		templateUrl: 'modulos/tec/ver.tmpl.html',
      		parent: angular.element(document.body),
      		targetEvent: ev,
      		clickOutsideToClose: true
    	});
	};
	
	/* ----------------- AUTOCOMPLETE ---------------- */
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
	
	//almaceno los temas en un array
	self.listaTemas = [];
	servicioRest.getTemas()
		.then(function(data) {
			self.listaTemas = data;
			self.allTags = loadAll();
		})
		.catch(function (err) {
		});

   
    function querySearch (query) {
      var results = query ? self.allTags.filter( createFilterFor(query) ) : self.allTags,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
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
		console.log(item.tag);
		var question = {
			tag : String
		}
		question.tag = item.tag;
		console.log(question);
		servicioRest.postPreguntasByTag(question)
			.then(function(data) {
				$scope.preguntas=data;
			})
			.catch(function (err) {
				console.log(err);
			});
    }

    function loadAll() {
		var allTags = self.listaTemas;
		return allTags.map( function (state) {
			state.value = state.tag.toLowerCase();
			return state;          
      });
    };

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }

});
