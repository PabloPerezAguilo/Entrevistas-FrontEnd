app.controller('controladorAdminCrear', function (servicioRest, $scope, $mdDialog, $mdToast) {
    
    
    $scope.minSliderValue={floor: 1};
    
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
	
	/* ----------- Input temas ----------- */

	
	
    
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
            for(i=0;i<$scope.temasTest.length;i++)
            {
                pregunta.tags[i] = $scope.temasTest[i].tag;
            }
            pregunta.level = $scope.nivelTest;
            pregunta.answers = [];

            for (i = 0;i < $scope.contTest;i++) {            
                pregunta.answers.push({title: $scope.respuestasTest[i], valid: false});
            }
            console.log(pregunta.title);

            pregunta.answers[$scope.radioTest - 1].valid = true;
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
	

	
	
	
	
	
	
	
	
	$scope.temas;
	$scope.temasCargados;
	$scope.temasAbierta = [];
	$scope.temasTest = [];
	$scope.temasTestAbierto = [];
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
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
		if (angular.isObject(chip)) {
			return chip;
		}
		console.log(chip);
		// Otherwise, create a new one
		servicioRest.postTema(chip)
			.then(function(data) {
				
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