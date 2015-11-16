app.controller('controladorCrear', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
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
    $scope.crearPAbierta=function(){
        console.log($scope.tituloAbierta);
        //pregunta._id=null;
        pregunta.title=$scope.tituloAbierta;
        pregunta.type="FREE";
        pregunta.tags[0]="algo";
        pregunta.level=$scope.nivelAbierta;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTest=function(){
        console.log();
        $scope.hide();
    };
    
    $scope.crearPTestAbierta=function(){
        console.log();
        $scope.hide();
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
    
    $scope.nivel = 5;
	$scope.respuestasTest = [];
	$scope.test = ['1', '2'];
	$scope.contTest = 2;
	
	
	$scope.masRespuestaTest = function () {
		$scope.contTest++;
		$scope.test.push($scope.contTest);
	}
});