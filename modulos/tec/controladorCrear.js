app.controller('controladorCrear', function (servicioRest, $scope, $mdDialog) {
    
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
	
	/* ----------- Input temas ----------- */

	
	
	
	
	
	
	
	
	
    $scope.crearPAbierta = function () {
        pregunta.title = $scope.tituloAbierta;
        pregunta.type = "FREE";
        pregunta.tags[0] = $scope.temasAbierta;
        pregunta.level = $scope.nivelAbierta;
        pregunta.directive = $scope.directivasAbierta;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTest = function () {
		var i;
        pregunta.title = $scope.tituloTest;
        pregunta.type = "SINGLE_CHOICE";
        pregunta.tags[0] = $scope.temasTest;
        pregunta.level = $scope.nivelTest;
        pregunta.answers = [];

       	for (i = 0;i < $scope.contTest;i++) {            
            pregunta.answers.push({title: $scope.respuestasTest[i], valid: false});
        }
        
        pregunta.answers[$scope.radioTest - 1].valid = true;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTestAbierta = function () {
		var i;
        pregunta.title = $scope.tituloTestAbierto;
        pregunta.type = "MULTI_CHOICE";
        pregunta.tags[0] = $scope.temasTestAbierto;
        pregunta.level = $scope.nivelTestAbierto;
        pregunta.answers = [];
		
		for (i = 0; i < $scope.contTestAbierto; i++) {            
            pregunta.answers.push({title: $scope.respuestasTestAbierto[i], valid: $scope.checkTestAbierto[i]});
        }
        
        $scope.hide(pregunta);
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
		$scope.contTest += 1;
		$scope.test.push($scope.contTest);
	};
	
	$scope.aniadirRespuestaTestAbierto = function () {
		$scope.contTestAbierto += 1;
		$scope.testAbierto.push($scope.contTestAbierto);
		$scope.checkTestAbierto.push(false);
	};
	
	
	
	
	
	
	
	
	$scope.temas;
	$scope.temasCargados;
	$scope.temasAbierta = [];
	$scope.temasTest = [];
	$scope.temasTestAbierto = [];
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.numberChips = [];
    $scope.numberChips2 = [];
    $scope.numberBuffer = '';	
	
	
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
	
    /**
     * Return the proper object when the append is called.
     */
    $scope.transformChip = function transformChip(chip) {
		// If it is an object, it's already a known chip
		console.log('antes if');
		if (angular.isObject(chip)) {
			return chip;
		}
		console.log('despues if');
		console.log(chip);
		// Otherwise, create a new one
		servicioRest.postTema(chip)
			.then(function(data) {
				chip = data.tag;
            })
			.catch(function(err) {
			console.log("Error");
			console.log(err);
			});
		return { valor: chip};
	}
	
    function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		
		return function filterFn(tema) {
			return (tema.valor.indexOf(lowercaseQuery) === 0);
		};
	}
		
    $scope.queryBuscarTema = function (query) {
		var results = query ? $scope.temasCargados.filter(createFilterFor(query)) : [];
		return results;
	}
});