app.controller('controladorVer', function ($scope, $mdDialog, indice) {
	
	function escribirSaltosDeLinea() {
		var titulo = $scope.preguntas[indice].title;
		var pos = [];
		var cont = 0;
		for (var i = 0; i < titulo.length; i++) {
			if(titulo.charAt(i) === '\n') {
				pos[cont] = i;
				cont++;
			}
		}
		$scope.titulo = [];
		for (var i = 0; i < pos.length; i++) {
			if (i === 0) {
				$scope.titulo[0] = titulo.substring(0, pos[0]);
			} else {
				$scope.titulo[i] = titulo.substring(pos[i - 1] + 1, pos[i]);
			}
		}
		$scope.titulo[$scope.titulo.length] = titulo.substring(pos[pos.length - 1] + 1, titulo.lastIndex);
	}
	
	$scope.index = indice;
    if ($scope.preguntas[indice].type === "Pregunta abierta") {
        $scope.cabeceraVer = "- Abierta";
        $scope.temas_nivel = $scope.preguntas[indice].tags[0];
        for (var i = 1; i < $scope.preguntas[indice].tags.length; i++) {
            $scope.temas_nivel += ", " + $scope.preguntas[indice].tags[i];
        }
        
        $scope.temas_nivel += " / " + $scope.preguntas[indice].level;
		escribirSaltosDeLinea();
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
        //$scope.titulo = $scope.preguntas[indice].title;
		escribirSaltosDeLinea();
        
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