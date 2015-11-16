app.controller('controladorTec', function(servicioRest, config,$scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
    
    /*---------------------------Inicializar vista------------------------------*/
    var Options={
        title: String,
        Valid: Boolean
    }
    
    var pregunta={
        _id:{
            type: String
        },
        title:{
            type:String,
            required:true 
        },
        type:{
            type:String,
            required:true
        },
        tags:[String],
        level:{
            type: Number,
        min:1,
        max:10,
        required:true
        },
        directive:{
            type:String
        },
        answers:[Options]
    }
	$rootScope.cargando = false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="Técnico";
    
    /*---------------------------Inicializar lista------------------------------*/
    
    servicioRest.getPreguntas()
        .then(function(data) {
        $scope.preguntas=data;
    })
        .catch(function(err) {
        console.log("Error");
        console.log(err);
    });
    
    /*--------------------------Funciones--------------------------*/
    
    $scope.ver= function () {
        
        
    }
    
    $scope.crear= function () {
        $scope.p = true;
    }
    
    $scope.terminarCrear= function () {
        $scope.p = false;
        pregunta.title=$scope.titulo;
        pregunta.tags[0]=$scope.tema;
        pregunta.level=$scope.nivel;
        pregunta.type=$scope.tipo;
        if($scope.tipo==="FREE")
        {
            
            pregunta.answers=null;
        }
        else
        {
            //pregunta.answers=$scope.respuestas;
           pregunta.answers=null; 
        }
        servicioRest.postPregunta(pregunta)
			.then(function(data) {
            pregunta._id=data.data._id;
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
    }
    
    $scope.modificar = function (indice) {
        
	}
    
    $scope.eliminar = function (indice) {
        var idPregunta = $scope.preguntas[indice]._id;
        servicioRest.deletePregunta(idPregunta)
			.then(function(data) {
                console.log(data);
				
				$scope.preguntas.splice(indice, 1);
			})
			.catch(function(err) {
				console.log("Error");
            console.log(err);
			});
	}
    
    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
            controller: 'controladorCrear',
            templateUrl: 'modulos/tec/crear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
        .then(function(datosPregunta) {
                console.log(datosPregunta);
				pregunta.title=datosPregunta.title;
                pregunta.tags=datosPregunta.tags;
                pregunta.level=datosPregunta.level;
                pregunta.type=datosPregunta.type;
            
                if(datosPregunta.type==="FREE")
                {
                    pregunta.directive=datosPregunta.directive;
                    pregunta.answers=null;
                }
                else
                {
                    //pregunta.answers=$scope.respuestas;
                   pregunta.answers=null; 
                }
                console.log(pregunta);
                servicioRest.postPregunta(pregunta)
                    .then(function(data) {
                    pregunta._id=data.data._id;
                        $scope.preguntas.push({
                            _id: pregunta._id,
                            title: pregunta.title,
                            tags: pregunta.tags[0],
                            level: pregunta.level,
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
	
	/* ----------------- AUTOCOMPLETE ---------------- */
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.temas        = cargarTemas();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    self.newTema = newTema;

    function newTema(tema) {
      alert("Sorry! You'll need to create a Constituion for " + tema + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.temas.filter( createFilterFor(query) ) : self.temas,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
		var tema = JSON.stringify(item)
		$log.info('Item changed to ' + tema);
		if(item != null) {
			//se mostrarán las preguntas de ese tema
			/*servicioRest.getPreguntasByTag(item)
				.then(function(data) {
					$scope.preguntas = data;
					console.log(data);
				})
				.catch(function(err) {
					console.log("Error: " + err);
				});*/
			console.log("seleccionado: " + tema);
		}
		
    }

    /**
     * Build `states` list of key/value pairs
     */
    function cargarTemas() {
      var datos = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware'];

      return datos.map( function (tema) {
        return {
          value: tema.toLowerCase(),
          display: tema
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(tema) {
        return (tema.value.indexOf(lowercaseQuery) === 0);
      };

    }

});
