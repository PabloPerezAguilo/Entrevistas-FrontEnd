app.controller('controladorAdminCrear', function (servicioRest, $scope, $mdDialog, $mdToast, $rootScope) {
    
    $scope.minSliderValue = [];
    $scope.temasTestAbierto = [];
    
    
    
    var Options = {
        tag: String,
        max: Number,
        min: Number
    };
    var entrevista = {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        DNI: { type: String, required: true },
        date: { type: String, required: true },
        leveledTags: [Options]
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
	$scope.respuestasTest = [];
	$scope.test = [];
	$scope.contTest = 0;
	$scope.radioTest = 1;
	

	
	/* ----------- Input temas ----------- */

	
    
    $scope.crearEntrevista = function () {
		var i;
        var j;
        var fecha_hora        
        
        if(false)//preguntaVacia())
        {
            toast("Rellena todos los campos obligatorios");
        }
        else
        {
            entrevista.leveledTags=[];
            entrevista.name = $scope.nombreEntrevista;
            entrevista.surname = $scope.apellidosEntrevista;
            entrevista.DNI = $scope.dniEntrevista
            entrevista.date = $scope.fecha.getFullYear() + "-" + ($scope.fecha.getMonth()+1) + "-" + $scope.fecha.getDate();
            entrevista.date +=  "T" + $scope.horas + ":" + $scope.minutos;
            
            console.log($scope.temasTestAbierto.length);
            for (i = 0;i < $scope.contTest;i++) {
                for (j = 0;j < $scope.temasTestAbierto[i].length;j++)
                entrevista.leveledTags.push({tag: $scope.temasTestAbierto[i][j].valor, max: $scope.minSliderValue[i].maxSliderG, min: $scope.minSliderValue[i].minSliderG});
            }
            
            console.log(entrevista);
            $scope.hide(entrevista);
        }
    };
    
    function preguntaVacia(){
       var resp=false;
            if($scope.nombreEntrevista===undefined||$scope.apellidosEntrevista===undefined||$scope.dniEntrevista===undefined||$scope.preguntasEntrevistas[0]===undefined||$scope.preguntasEntrevistas[1]===undefined||$scope.nombreEntrevista===""||$scope.apellidosEntrevista===""||$scope.dniEntrevista===""||$scope.preguntasEntrevistas[0]===""||$scope.preguntasEntrevistas[1]==="")
            {
                resp=true;
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
	
	$rootScope.aniadirRespuestaTest = function () {
		$scope.contTest += 1;
		$scope.test.push($scope.contTest);
        $scope.minSliderValue[$scope.contTest-1] = {
                    minSliderG: 1,
                    maxSliderG: 10,
                    options: {
                        floor: 1,
                        ceil: 10,
                        step: 1
                    }
                };
        $scope.temasTestAbierto[$scope.contTest-1] = [];
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
	
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (tema) {
			$scope.texto = tema.tag;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
		
    $scope.queryBuscarTema = function (query) {
		var results = query ? $scope.temasCargados.filter(filtrar(query)) : [];
		return results;
	}
});