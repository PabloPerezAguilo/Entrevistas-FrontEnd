app.controller('controladorCrear', function (servicioRest, $scope, $mdDialog, $mdToast) {

    
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
	$scope.temas = [];
	$scope.temasAbierta = [];
	$scope.temasTest = [];
	$scope.temasTestAbierto = [];
	
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = querySearch;
    $scope.numberChips = [];
    $scope.numberChips2 = [];
    $scope.numberBuffer = '';
    $scope.transformChip = transformChip;
	
	
	servicioRest.getTemas()
		.then(function (data) {
			for(var i = 0; i < data.length; i++) {
					$scope.temas[i] = data[i].tag;
			}
			console.log($scope.temas);
		})
		.catch(function (err) {
			console.log("Error al cargar los temas");
    	});
	
    $scope.crearPAbierta = function () {
        if(preguntaVacia("abierta"))
        {
            toast("Rellena todos los campos obligatorios");
        }
        else
        {
            pregunta.title = $scope.tituloAbierta;
            pregunta.type = "FREE";
            pregunta.tags[0] = $scope.temasAbierta;
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
            pregunta.tags[0] = $scope.temasTest;
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
            pregunta.tags[0] = $scope.temasTestAbierto;
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
  

    /**
     * Return the proper object when the append is called.
     */
    function transformChip(chip) {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }
		console.log('hola');
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
      return { name: chip, type: 'new' }
    }

    /**
     * Search for vegetables.
     */
    function querySearch (query) {
		for
      var results = query ? $scope.temas.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(tema) {
        return (tema.indexOf(lowercaseQuery) === 0);
      };

    }
});