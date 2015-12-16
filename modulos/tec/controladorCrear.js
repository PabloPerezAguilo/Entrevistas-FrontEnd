app.controller('controladorCrear', function (servicioRest, $scope, $mdDialog, $mdToast, $rootScope) {
    
    var Options = {
        title: { type: String },
        valid: { type: Boolean }
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
	
    function toast(texto) {
		$mdToast.show(
	      $mdToast.simple()
	        .content(texto)
	        .position('top right')
	        .hideDelay(1500)
		);
	}
    
	/* ----------- Respuestas tests ----------- */
	$scope.nivelAbierta = 1;
    $scope.nivelTest = 1;
    $scope.nivelTestAbierto = 1;
		
	$scope.respuestasTest = [];
	$scope.test = ['1', '2'];
	$scope.contTest = 2;
	$scope.radioTest = 1;
	
	$scope.respuestasTestAbierto = [];
	$scope.testAbierto = ['1', '2'];
	$scope.contTestAbierto = 2;
	$scope.checkTestAbierto = [false, false];
	
	$scope.temas;
	$scope.temasCargados;
	$scope.temasAbierta = [];
	$scope.temasTest = [];
	$scope.temasTestAbierto = [];
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
	
	
    $scope.crearPAbierta = function () {
        if(preguntaVacia("abierta"))
        {
            toast("Rellena todos los campos obligatorios");
        }
        else
        {
            pregunta.title = $scope.tituloAbierta;
            pregunta.type = "FREE";

            for(var i=0;i<$scope.temasAbierta.length;i++)
            {
                pregunta.tags[i] = $scope.temasAbierta[i].valor;
            }
            pregunta.level = $scope.nivelAbierta;
            pregunta.directive = $scope.directivasAbierta;
            $scope.hide(pregunta);
        }
    };
    
    $scope.crearPTest = function () {
		var i;
        if(preguntaVacia("test"))
        {
            toast("Rellena todos los campos obligatorios");
        }
        else
        {
            pregunta.title = $scope.tituloTest;
            pregunta.type = "SINGLE_CHOICE";
            servicioRest.getTemas()
			.then(function(data) {
				$scope.temas = data;			
				$scope.temasCargados = cargarTemas();
			})
			.catch(function (err) {
			});
            for(i=0;i<$scope.temasTest.length;i++)
            {
                pregunta.tags[i] = $scope.temasTest[i].valor;
            }
            pregunta.level = $scope.nivelTest;
            pregunta.answers = [];

            for (i = 0;i < $scope.contTest;i++) {            
                pregunta.answers.push({title: $scope.respuestasTest[i], valid: false});
            }

            pregunta.answers[$scope.radioTest - 1].valid = true;
            $scope.hide(pregunta);
        }
    };
    
    $scope.crearPTestAbierta = function () {
		var i;
        if(preguntaVacia("testAbierta"))
        {
            toast("Rellena todos los campos obligatorios");
        }
        else
        {
            pregunta.title = $scope.tituloTestAbierto;
            pregunta.type = "MULTI_CHOICE";
            servicioRest.getTemas()
		.then(function(data) {
			$scope.temas = data;			
			$scope.temasCargados = cargarTemas();
		})
		.catch(function (err) {
		});
            for(i=0;i<$scope.temasTestAbierto.length;i++)
            {
                pregunta.tags[i] = $scope.temasTestAbierto[i].valor;
            }
            pregunta.level = $scope.nivelTestAbierto;
            pregunta.answers = [];

            for (i = 0; i < $scope.contTestAbierto; i++) {            
                pregunta.answers.push({title: $scope.respuestasTestAbierto[i], valid: $scope.checkTestAbierto[i]});
            }

            $scope.hide(pregunta);
        }
    };
    
    function preguntaVacia(tipoP){
       var resp=false;
        if(tipoP==="abierta")
        {
            if($scope.tituloAbierta===undefined||$scope.temasAbierta===undefined||$scope.tituloAbierta===""||$scope.temasAbierta==="")
            {
                resp=true;
            }
        }
        else if(tipoP==="test")
        {
            if($scope.tituloTest===undefined||$scope.temasTest===undefined||$scope.respuestasTest[0]===undefined||$scope.respuestasTest[1]===undefined||$scope.tituloTest===""||$scope.temasTest===""||$scope.respuestasTest[0]===""||$scope.respuestasTest[1]==="")
            {
                resp=true;
            }
        }
        else if(tipoP==="testAbierta")
        {
            if($scope.tituloTestAbierto===undefined||$scope.temasTestAbierto===undefined||$scope.respuestasTestAbierto[0]===undefined||$scope.respuestasTestAbierto[1]===undefined||$scope.tituloTestAbierto===""||$scope.temasTestAbierto===""||$scope.respuestasTestAbierto[0]===""||$scope.respuestasTestAbierto[1]==="")
            {
                resp=true;
            }
        }
        return resp;
    }
    
    $scope.hide = function (respuesta) {
        $mdDialog.hide(respuesta);
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
	
	$scope.aniadirRespuestaTest = function () {
		$scope.contTest += 1;
		$scope.test.push($scope.contTest);
	};
	
	$scope.aniadirRespuestaTestAbierto = function () {
		$scope.contTestAbierto += 1;
		$scope.testAbierto.push($scope.contTestAbierto);
		$scope.checkTestAbierto.push(false);
	};
	
	
	/* ----------- Input temas ----------- */
	
	servicioRest.getTemas()
		.then(function(data) {
			$scope.temas = data;			
			$scope.temasCargados = cargarTemas();
		})
		.catch(function (err) {
		});
	
    function cargarTemas() {
		$scope.temasCargados = $scope.temas;
		return $scope.temasCargados.map( function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;          
      });
	}
	
    $scope.transformChip = function (chip, tipo) {
		var index = buscarTema(chip, $scope.temasCargados);
		console.log($scope.temasCargados)
		//si existe el tema
		if (buscarTema(chip, $scope.temasCargados) != -1)  {
			var tema = {
				tag: chip,
				valor: chip.toLowerCase()
			}
			if(tipo === 'ABIERTA') {
				//si no esta en la lista de los temas ya seleccionados añadirlo
				if(buscarTema(chip, $scope.temasAbierta) === -1) {
					return tema;	
				}
			}
			if(tipo === 'TEST') {
				//si no esta en la lista de los temas ya seleccionados añadirlo
				if(buscarTema(chip, $scope.temasTest) === -1) {
					return tema;	
				}
			}
			if(tipo === 'TEST_ABIERTO') {
				//si no esta en la lista de los temas ya seleccionados añadirlo
				if(buscarTema(chip, $scope.temasTestAbierto) === -1) { 
					return tema;	
				}
			}
		}
		
		//si lo selecciona de la lista desplegable
		if(angular.isObject(chip)) {
			if(tipo === 'ABIERTA') {
				//si no esta en la lista de los temas ya seleccionados añadirlo
				if(buscarTema(chip, $scope.temasAbierta) === -1) {
					console.log($scope.temasCargados);
					return chip;	
				}
			}
			if(tipo === 'TEST') {
				//si no esta en la lista de los temas ya seleccionados añadirlo
				if(buscarTema(chip, $scope.temasTest) === -1) {
					return chip;	
				}
			}
			if(tipo === 'TEST_ABIERTO') {
				//si no esta en la lista de los temas ya seleccionados añadirlo
				if(buscarTema(chip, $scope.temasTestAbierto) === -1) { 
					return chip;	
				}
			}
		}
		
		//si no existe el tema
		if(tipo === 'ABIERTA') {			
			if(buscarTema(chip, $scope.temasAbierta) === -1) {
				$scope.confirmacionAbierta = true;
				$scope.temaAbierta = chip;
				$scope.deshabilitadoAbierta = true;
				return { valor: chip};
			}
		}
		
		if(tipo === 'TEST') {
			if(buscarTema(chip, $scope.temasTest) === -1) {
				$scope.confirmacionTest = true;
				$scope.temaTest = chip;
				$scope.deshabilitadoTest = true;
				return { valor: chip};
			}
		}
		
		if(tipo === 'TEST_ABIERTO') {
			if(buscarTema(chip, $scope.temasTest) === -1) {
				$scope.confirmacionTestAbierto = true;
				$scope.temaTestAbierto = chip;
				$scope.deshabilitadoTestAbierto = true;
				return { valor: chip};
			}
		}
		return null;
	}
	
	$scope.deleteChip = function() {
		if($scope.confirmacionAbierta) {
			$scope.confirmacionAbierta = false;
			$scope.deshabilitadoAbierta = false;
		}
		
		if($scope.confirmacionTest) {
			$scope.confirmacionTest = false;
			$scope.deshabilitadoTest = false;
		}
		
		if($scope.confirmacionTestAbierto) {
			$scope.confirmacionTestAbierto = false;
			$scope.dehsabilitadoTestAbierto = false;
		}        
	}
	
	/*confirmacion*/
	
	function nuevoTema(tema) {
		servicioRest.postTema(tema)
			.then(function(data) {
				$rootScope.obtenerTemas();
            })
			.catch(function(err) {
			console.log("Error");
			console.log(err);
			});
	}
	
	$scope.crearTema = function(chip) {
		if($scope.confirmacionAbierta) {
			nuevoTema($scope.temaAbierta);
			$scope.confirmacionAbierta = false;
			$scope.deshabilitadoAbierta = false;
		}
		
		if($scope.confirmacionTest) {
			nuevoTema($scope.temaTest);
			$scope.confirmacionTest = false;
			$scope.deshabilitadoTest = false;
		}
		
		if($scope.confirmacionTestAbierto) {
			nuevoTema($scope.temaTestAbierto);
			$scope.confirmacionTestAbierto = false;
			$scope.deshabilitadoTestAbierto = false;
		}
	}
	
	//obtener la posicion de un tema en el array del md-chip, no he conseguido hacerlo con $index
	function buscarTema(tema, array) {
		for(var i = 0; i < array.length; i++) {
			if(tema === array[i].valor || tema === array[i].valor.toLowerCase()) {
				return i;
			}
		}
		return -1;
	}
	
	$scope.cerrarConfirm = function(chip) {
		if($scope.confirmacionAbierta) {
			$scope.confirmacionAbierta = false;
			$scope.deshabilitadoAbierta = false;
			var indexAbierta = buscarTema($scope.temaAbierta, $scope.temasAbierta);
			if(indexAbierta === 0) { 
				$scope.temasAbierta = [];
			} else {
				$scope.temasAbierta.splice(indexAbierta, 1);
			}
		}
		
		if($scope.confirmacionTest) {
			$scope.confirmacionTest = false;
			$scope.deshabilitadoTest = false;
			var indexTest = buscarTema($scope.temaTest, $scope.temasTest);
			if(indexTest === 0) { 
				$scope.temasTest = [];
			} else {
				$scope.temasTest.splice(indexTest, 1);
			}
		}
		
		if($scope.confirmacionTestAbierto) {
			$scope.confirmacionTestAbierto = false;
			$scope.deshabilitadoTestAbierto = false;
			var indexTestAbierto = buscarTema($scope.temaTestAbierto, $scope.temasTestAbierto);
			if(indexTestAbierto === 0) { 
				$scope.temasTestAbierto = [];
			} else {
				$scope.temasTestAbierto.splice(indexTestAbierto, 1);
			}
		}        
	}
	
    function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		
		return function filterFn(tema) {
			return (tema.valor.indexOf(lowercaseQuery) === 0);
		};
	}
	
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (tema) {
			$scope.texto = tema.valor;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
		
    $scope.queryBuscarTema = function (query) {
		var results = query ? $scope.temasCargados.filter(filtrar(query)) : [];
		return results;
	}
});