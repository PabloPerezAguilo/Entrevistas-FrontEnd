app.controller('controladorCrear', function (servicioRest, config, $scope, $location, $rootScope, $mdDialog, $mdToast) {
    
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
            if($scope.tituloAbierto===undefined||$scope.temasAbierto===undefined||$scope.respuestasAbierto[0]===undefined||$scope.respuestasAbierto[1]===undefined||$scope.tituloAbierto===""||$scope.temasAbierto===""||$scope.respuestasAbierto[0]===""||$scope.respuestasAbierto[1]==="")
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
	
	$scope.aniadirRespuestaTest = function () {
		$scope.contTest += 1;
		$scope.test.push($scope.contTest);
	};
	
	$scope.aniadirRespuestaTestAbierto = function () {
		$scope.contTestAbierto += 1;
		$scope.testAbierto.push($scope.contTestAbierto);
		$scope.checkTestAbierto.push(false);
	};
});