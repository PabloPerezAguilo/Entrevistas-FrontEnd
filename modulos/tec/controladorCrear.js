app.controller('controladorCrear', function (servicioRest, $scope, $mdDialog, $mdToast, $rootScope, $log) {
    
	$scope.entendido = true;
	$scope.entendidoAbierta = true;
	$scope.entendidoTest = true;
	$scope.entendidoTestAbierto = true;
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
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
    
	/* ----------- Respuestas tests ----------- */
	var temas, temasCargados;
	$scope.nivelAbierta = 5;
    $scope.nivelTest = 5;
    $scope.nivelTestAbierto = 5;
	
	$scope.respuestasTest = [];
	$scope.test = ['1', '2'];
	$scope.radioTest = 1;
	var contTest = 2;
	
	$scope.respuestasTestAbierto = [];
	$scope.testAbierto = ['1', '2'];
	$scope.checkTestAbierto = [false, false];
	var contTestAbierto = 2;
	
	$scope.temasAbierta = [];
	$scope.temasTest = [];
	$scope.temasTestAbierto = [];
	
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
	
	function preguntaVacia(tipoP) {
        var resp = false;
        if (tipoP === "abierta") {
            if ($scope.tituloAbierta === undefined || $scope.temasAbierta === undefined || $scope.tituloAbierta === "" || $scope.temasAbierta.length === 0) {
				resp = true;
            }
        } else if (tipoP === "test") {
			if ($scope.tituloTest === undefined || $scope.temasTest === undefined || $scope.respuestasTest[0] === undefined || $scope.respuestasTest[1] === undefined || $scope.tituloTest === "" || $scope.temasTest.length === 0 || $scope.respuestasTest[0] === "" || $scope.respuestasTest[1] === "") {
                resp = true;
            }
        } else if (tipoP === "testAbierta") {
            if ($scope.tituloTestAbierto === undefined || $scope.temasTestAbierto === undefined || $scope.respuestasTestAbierto[0] === undefined || $scope.respuestasTestAbierto[1] === undefined || $scope.tituloTestAbierto === "" || $scope.temasTestAbierto.length === 0 || $scope.respuestasTestAbierto[0] === "" || $scope.respuestasTestAbierto[1] === "") {
                resp = true;
            }
        }
        return resp;
    }
	
	function cargarTemas() {
		temasCargados = temas;
		return temasCargados.map(function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;
		});
	}
	
    $scope.crearPAbierta = function () {
        if (preguntaVacia("abierta")) {
            toast("Rellena todos los campos obligatorios");
        } else {
            pregunta.title = $scope.tituloAbierta;
            pregunta.type = "FREE";
            for (var i = 0; i < $scope.temasAbierta.length; i++) {
                pregunta.tags[i] = $scope.temasAbierta[i].tag;
            }
            pregunta.level = $scope.nivelAbierta;
            pregunta.directive = $scope.directivasAbierta;
            $scope.hide(pregunta);
        }
    };
	
    $scope.crearPTest = function () {
		if (preguntaVacia("test")) {
            toast("Rellena todos los campos obligatorios");
        } else {
            pregunta.title = $scope.tituloTest;
            pregunta.type = "SINGLE_CHOICE";
            for (var i = 0; i < $scope.temasTest.length; i++) {
                pregunta.tags[i] = $scope.temasTest[i].tag;
            }
			pregunta.level = $scope.nivelTest;
            pregunta.answers = [];
            for (var i = 0; i < contTest; i++) {
                pregunta.answers.push({title: $scope.respuestasTest[i], valid: false});
            }

            pregunta.answers[$scope.radioTest - 1].valid = true;
            $scope.hide(pregunta);
        }
    };
	
    $scope.crearPTestAbierta = function () {		
        if (preguntaVacia("testAbierta")) {
            toast("Rellena todos los campos obligatorios");
        } else {
            pregunta.title = $scope.tituloTestAbierto;
            pregunta.type = "MULTI_CHOICE";
            for (var i = 0; i < $scope.temasTestAbierto.length; i++) {
                pregunta.tags[i] = $scope.temasTestAbierto[i].tag;
            }
            pregunta.level = $scope.nivelTestAbierto;
            pregunta.answers = [];
            for (var i = 0; i < contTestAbierto; i++) {
                pregunta.answers.push({title: $scope.respuestasTestAbierto[i], valid: $scope.checkTestAbierto[i]});
            }
            $scope.hide(pregunta);
        }
    };
    
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
		contTest += 1;
		$scope.test.push(contTest);
	};
	
	$scope.aniadirRespuestaTestAbierto = function () {
		contTestAbierto += 1;
		$scope.testAbierto.push(contTestAbierto);
		$scope.checkTestAbierto.push(false);
	};
	
	
	/* ----------- Input temas ----------- */
	
	servicioRest.getTemas()
		.then(function (data) {
			temas = data;
			temasCargados = cargarTemas();
		})
		.catch(function (err) {
			$log.error("Error al cargar los temas: " + err);
		});
	
	function buscarTema(tema, array) {
		for (var i = 0; i < array.length; i++) {
			if (tema === array[i].valor) {
				return i;
			}
		}
		return -1;
	}
	
	$scope.transformChip = function (chip, tipo) {
		var index;
		if (!angular.isObject(chip)) {
			index = buscarTema(chip.toLowerCase(), temasCargados);
		} else {
			index = buscarTema(chip.valor, temasCargados);
		}
		
		//si existe el tema
		if (index !== -1) {
			//si no esta en la lista de los temas ya seleccionados de la pregunta correspondiente añadirlo
			if (tipo === 'ABIERTA') {
				if (buscarTema(temasCargados[index].valor, $scope.temasAbierta) === -1) {
					return temasCargados[index];
				}
			}
			if (tipo === 'TEST') {
				if (buscarTema(temasCargados[index].valor, $scope.temasTest) === -1) {
					return temasCargados[index];
				}
			}
			if (tipo === 'TEST_ABIERTO') {
				if (buscarTema(chip.valor, $scope.temasTestAbierto) === -1) {
					return temasCargados[index];
				}
			}
		}
		
		chip = {
			tag: chip,
			valor: chip.toLowerCase()
		};
		
		//si no existe el tema
		if (tipo === 'ABIERTA') {
			if (buscarTema(chip.valor, $scope.temasAbierta) === -1) {
				$scope.confirmacionAbierta = true;
				$scope.temaAbierta = chip.tag;
				$scope.deshabilitadoAbierta = true;
				return chip;
			}
		}
		
		if (tipo === 'TEST') {
			if (buscarTema(chip.valor, $scope.temasTest) === -1) {
				$scope.confirmacionTest = true;
				$scope.temaTest = chip.tag;
				$scope.deshabilitadoTest = true;
				return chip;
			}
		}
		
		if (tipo === 'TEST_ABIERTO') {
			if (buscarTema(chip.valor, $scope.temasTest) === -1) {
				$scope.confirmacionTestAbierto = true;
				$scope.temaTestAbierto = chip.tag;
				$scope.deshabilitadoTestAbierto = true;
				return chip;
			}
		}
		return null;
	};
	
	$scope.deleteChip = function () {
		if ($scope.confirmacionAbierta) {
			$scope.confirmacionAbierta = false;
			$scope.deshabilitadoAbierta = false;
		}
		
		if ($scope.confirmacionTest) {
			$scope.confirmacionTest = false;
			$scope.deshabilitadoTest = false;
		}
		
		if ($scope.confirmacionTestAbierto) {
			$scope.confirmacionTestAbierto = false;
			$scope.dehsabilitadoTestAbierto = false;
		}
	};
	
	/*confirmacion*/
	
	function nuevoTema(tema) {
		servicioRest.postTema(tema)
			.then(function (data) {
				$rootScope.obtenerTemas();
            })
			.catch(function (err) {
				$log.error("Error al crear el tema: " + err);
			});
	}
	
	$scope.crearTema = function (chip) {
		if ($scope.confirmacionAbierta) {
			nuevoTema($scope.temaAbierta);
			$scope.confirmacionAbierta = false;
			$scope.deshabilitadoAbierta = false;
		}
		
		if ($scope.confirmacionTest) {
			nuevoTema($scope.temaTest);
			$scope.confirmacionTest = false;
			$scope.deshabilitadoTest = false;
		}
		
		if ($scope.confirmacionTestAbierto) {
			nuevoTema($scope.temaTestAbierto);
			$scope.confirmacionTestAbierto = false;
			$scope.deshabilitadoTestAbierto = false;
		}
	};
	
	//obtener la posicion de un tema en el array del md-chip, no he conseguido hacerlo con $index
	$scope.cerrarConfirm = function (chip) {
		if ($scope.confirmacionAbierta) {
			$scope.confirmacionAbierta = false;
			$scope.deshabilitadoAbierta = false;
			var indexAbierta = buscarTema($scope.temaAbierta, $scope.temasAbierta);
			if (indexAbierta === 0) {
				$scope.temasAbierta = [];
			} else {
				$scope.temasAbierta.splice(indexAbierta, 1);
			}
		}
		
		if ($scope.confirmacionTest) {
			$scope.confirmacionTest = false;
			$scope.deshabilitadoTest = false;
			var indexTest = buscarTema($scope.temaTest, $scope.temasTest);
			if (indexTest === 0) {
				$scope.temasTest = [];
			} else {
				$scope.temasTest.splice(indexTest, 1);
			}
		}
		
		if ($scope.confirmacionTestAbierto) {
			$scope.confirmacionTestAbierto = false;
			$scope.deshabilitadoTestAbierto = false;
			var indexTestAbierto = buscarTema($scope.temaTestAbierto, $scope.temasTestAbierto);
			if (indexTestAbierto === 0) {
				$scope.temasTestAbierto = [];
			} else {
				$scope.temasTestAbierto.splice(indexTestAbierto, 1);
			}
		}
	};
	
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
		var results = query ? temasCargados.filter(filtrar(query)) : [];
		return results;
	};
});