app.controller('controladorTec', function(servicioRest, config,$scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
    
    /*---------------------------Inicializar vista------------------------------*/
    var Options={
        title: String,
        valid: Boolean
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
                    pregunta.directive=null;
                    pregunta.answers=datosPregunta.answers; 
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
	
	/* ----------------- AUTOCOMPLETE ---------------- */
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    //self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;   

   
    function querySearch (query) {
      var results = query ? self.allStates.filter( createFilterFor(query) ) : self.allStates,
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

	self.t = [];
	servicioRest.getTemas()
		.then(function(data) {
			$scope.tag = data;				
			self.t = data;
			self.allStates = loadAll();
		})
		.catch(function (err) {
		});
	
    function loadAll() {
		var allStates = self.t;
		return allStates.map( function (state) {
			state.value = state.tag.toLowerCase();
			return state;          
      });
    }

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