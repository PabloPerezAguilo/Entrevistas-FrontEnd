app.controller('controladorVer', function ($scope, $mdDialog, indice) {
	
	$scope.index = indice;
    if ($scope.preguntas[indice].type === "Pregunta abierta") {
        $scope.cabeceraVer = "- Abierta";
        $scope.temas_nivel = $scope.preguntas[indice].tags[0];
        for (var i = 1; i < $scope.preguntas[indice].tags.length; i++) {
            $scope.temas_nivel += ", " + $scope.preguntas[indice].tags[i];
        }
        
        $scope.temas_nivel += " / " + $scope.preguntas[indice].level;
        $scope.titulo = $scope.preguntas[indice].title;
        $scope.directiva = $scope.preguntas[indice].directive;
    } else {
        if ($scope.preguntas[indice].type === "Pregunta tipo Test") {
            $scope.cabeceraVer = "- Test";
        } else {
            $scope.cabeceraVer = "- Selección múltiple";
        }
        
        $scope.temas_nivel = $scope.preguntas[indice].tags[0];
        for (var i = 1; i < $scope.preguntas[indice].tags.length; i++) {
            $scope.temas_nivel += ", " + $scope.preguntas[indice].tags[i];
        }
        
        $scope.temas_nivel += " / " + $scope.preguntas[indice].level;
        $scope.titulo = $scope.preguntas[indice].title;
        
        $scope.items = [];
        for (var i = 0; i < $scope.preguntas[indice].answers.length; i++) {
            $scope.items.push({ 
                esCorrecta: $scope.preguntas[indice].answers[i].valid,
                respuesta: $scope.preguntas[indice].answers[i].title
            });
        }
    }
	var aux;
	if($scope.ver) {
		aux = $scope.cabeceraVer;
	}
	$scope.ayuda = function() {		
		$scope.ver = !$scope.ver;
		if(!$scope.ver) {
			$scope.cabeceraVer = '- Ayuda';
		} else {
			$scope.cabeceraVer = aux;
		}
	}
	
	$scope.hide = function () {
		$mdDialog.hide();
	};
  	$scope.cancel = function () {
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});