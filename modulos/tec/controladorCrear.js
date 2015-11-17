app.controller('controladorCrear', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
    var Options={
        title: {
            type: String
        },
        valid: {
            type: Boolean
        }
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
        answers: [Options]
    }
    $scope.crearPAbierta=function(){
        pregunta.title=$scope.tituloAbierta;
        pregunta.type="FREE";
        pregunta.tags[0]=$scope.temasAbierta;
        pregunta.level=$scope.nivelAbierta;
        pregunta.directive=$scope.directivasAbierta;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTest=function(){
        pregunta.title=$scope.tituloTest;
        pregunta.type="SINGLE_CHOICE";
        pregunta.tags[0]=$scope.temasTest;
        pregunta.level=$scope.nivelTest;
        pregunta.answers=[];

       for(var i=0 ; i<$scope.contTest ; i++)
        {            
            pregunta.answers.push({title: $scope.respuestasTest[i],valid:false});
        }
        
        pregunta.answers[$scope.radioTest-1].valid=true;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTestAbierta=function(){
        pregunta.title=$scope.tituloTestAbierto;
        pregunta.type="MULTI_CHOICE";
        pregunta.tags[0]=$scope.temasTestAbierto;
        pregunta.level=$scope.nivelTestAbierto;
        pregunta.answers=[];

       for(var i=0 ; i<$scope.contTestAbierto ; i++)
        {            
            pregunta.answers.push({title: $scope.respuestasTestAbierto[i],valid:$scope.checkTestAbierto[i]});
        }
        
        $scope.hide(pregunta);
    };
    
    $scope.hide = function (respuesta) {
        $mdDialog.hide(respuesta);
        console.log("aqui");
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