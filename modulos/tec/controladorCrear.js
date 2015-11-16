app.controller('controladorCrear', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
    var Options={
        title: {
            type: String
        },
        Valid: {
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
        console.log($scope.tituloAbierta);
        //pregunta._id=null;
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
        
        console.log(pregunta);
       for(var i=0 ; i<$scope.contTest ; i++)
        {            
            pregunta.answers.push({title: $scope.respuestasTest[i],Valid:false});
        }
        
        pregunta.answers[0].Valid=true;
        $scope.hide(pregunta);
    };
    
    $scope.crearPTestAbierta=function(){
        console.log();
        /*pregunta.title=$scope.tituloTest;
        pregunta.type="MULTI_CHOICE";
        pregunta.tags[0]=$scope.temasTest;
        pregunta.level=$scope.nivelTest;*/
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
    
    $scope.nivelAbierta = 5;
    $scope.nivelTest = 5;
	$scope.respuestasTest = [];
	$scope.test = ['1', '2'];
	$scope.contTest = 2;
	
	
	$scope.masRespuestaTest = function () {
		$scope.contTest++;
		$scope.test.push($scope.contTest);
	}
});