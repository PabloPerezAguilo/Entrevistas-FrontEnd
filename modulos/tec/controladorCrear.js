app.controller('controladorCrear', function (servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
    var Options = {
        title: String,
        Valid: Boolean
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
	
    $scope.crearPAbierta = function () {
        pregunta.title = $scope.tituloAbierta;
        pregunta.type = "FREE";
        pregunta.tags[0] = "algo";
        pregunta.level = $scope.nivelAbierta;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTest = function () {
        $scope.hide();
    };
    
    $scope.crearPTestAbierta = function () {
        $scope.hide();
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
    
    $scope.nivelAbierta = $scope.nivelTest = $scope.nivelTestAbierto = 5;
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