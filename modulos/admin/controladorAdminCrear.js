app.controller('controladorAdminCrear', function (servicioRest, $scope, $mdDialog, $mdToast, $rootScope, $log) {
    
    $scope.minSliderValue = [];
    $scope.temasEntrevista = [];
	$scope.errorTema = [];
	$scope.haciendoEntrevista = true;
	
    var Options = {
        tag: String,
        max: Number,
        min: Number
    }, entrevista = {
        name: { type: String, required: true },
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
    
	$scope.temasChip = [];
	$scope.contTemasChip = 0;
	
	$scope.temasEntrevista = [];
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
	
	var temasCargados;

	
	/* ----------- Input temas ----------- */
	
	//comprueba que hay temas en todos los autocomplete
	function sinTemas() {
		if ($scope.temasEntrevista.length === 0) {
			return true;
		} else {
			for (var i = 0; i < $scope.temasEntrevista.length; i++) {
				if ($scope.temasEntrevista[i].length === 0) {
					return true;
				}
			}
		}
		return false;
	}
    
	//comprueba que estén rellenos todos los campos obligatorios
    function entrevistaVacia(){
		if($scope.nombreEntrevista === undefined || $scope.nombreEntrevista === "" || sinTemas() 
		   || $scope.fecha === undefined || $scope.horas === undefined || $scope.minutos === undefined) {
			return true;
		}
		return false;
    }
    
    $scope.crearEntrevista = function () {
		var i, j, fecha_hora, dia, mes, minutos, hora;
        
        if (entrevistaVacia()) {
            toast("Rellena todos los campos obligatorios");
        } else {
			dia = $scope.fecha.getDate();
			mes = $scope.fecha.getMonth() + 1;
			minutos = $scope.minutos;
			hora = $scope.horas;
			
			if (dia < 10) {
				dia = '0' + dia;
			}
			
			if (mes < 10) {
				mes = '0' + mes;
			}
			
			if (minutos < 10) {
				minutos = '0' + minutos;
			}
			
			if(hora < 10) {
				hora = '0' + hora;
			}

            entrevista.leveledTags = [];
            entrevista.name = $scope.nombreEntrevista;
            entrevista.DNI = $scope.dniEntrevista;
            entrevista.date = $scope.fecha.getFullYear() + "-" + mes + "-" + dia + "T" + hora + ":" + minutos;
			
            for (i = 0; i < $scope.contTemasChip; i++) {
                for (j = 0; j < $scope.temasEntrevista[i].length; j++) {
					entrevista.leveledTags.push({tag: $scope.temasEntrevista[i][j].tag,
											 max: $scope.minSliderValue[i].maxSliderG,
											 min: $scope.minSliderValue[i].minSliderG});
				}
            }
			
			servicioRest.postInterview(entrevista)
				.then(function(data) {
					$scope.mensaje = [];
					$scope.mensaje[0] = "Se ha creado una entrevista con: ";
					for (var i = 0; i < data.recuento.length; i++) {
						if (i === data.recuento.length - 1) {
							if (data.recuento[i].count === 1) {
								$scope.mensaje[i + 1] = data.recuento[i].count + " pregunta de  " + data.recuento[i].tag + ".";
							} else {
								$scope.mensaje[i + 1] = data.recuento[i].count + " preguntas de " + data.recuento[i].tag + ".";
							}
						} else {
							if (data.recuento[i].count === 1) {
								$scope.mensaje[i + 1] = data.recuento[i].count + " pregunta de " + data.recuento[i].tag + ",";
							} else {
								$scope.mensaje[i + 1] = data.recuento[i].count + " preguntas de " + data.recuento[i].tag + ",";
							}
						}
					}
				$scope.haciendoEntrevista = false;
			})
				.catch(function(err) {
					$log.error("Error al crear la entrevista");
					if (err.status === 500) {
						$scope.error = true;
						$scope.temas = err.data.leveledTags;
					}
				});
        }
    };
	
	$scope.cerrarError = function (indice) {
		if ($scope.error) {
			$scope.error = false;
		}
		
		if ($scope.errorTema[indice]) {
			$scope.errorTema[indice] = false;
		}
	}
    
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
	
	//al dar al boton mas añade un nuevo slider y un tema
	$rootScope.aniadirSliderTemas = function () {
		$scope.contTemasChip += 1;
		$scope.temasChip.push($scope.contTemasChip);
        $scope.minSliderValue[$scope.contTemasChip - 1] = {
                    minSliderG: 1,
                    maxSliderG: 10,
                    options: {
                        floor: 1,
                        ceil: 10,
                        step: 1
                    }
                };
        $scope.temasEntrevista[$scope.contTemasChip - 1] = [];
	};
	
	$scope.deshabilitar = function () {
		if($scope.error === true) {
			return true;
		}
		for(var i = 0; i < $scope.errorTema.length; i++) {
			if($scope.errorTema[i] === true) {
				return true;
			}
		}
		return false;
	}
	
	/* ----------------------- CHIPS TEMAS ----------------------- */
	
	function cargarTemas(temas) {
		return temas.map( function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;          
      });
	}
	
	servicioRest.getTemas()
		.then(function(data) {			
			$scope.temasCargados = cargarTemas(data);
		})
		.catch(function (err) {
			$log.error("Error al cargar las aptitudes: " + err);
		});
	
	function buscarTema(tema) {
		var i;
		for (i = 0; i < temasCargados.length; i++) {
			if (tema === temasCargados[i].valor) {
				return i;
			}
		}
		return -1;
	}   
	
    $scope.transformChip = function transformChip(chip, indice) {
		if (angular.isObject(chip)) {
			return chip;
		}
		
		var index = buscarTema(chip.toLowerCase());
		if (index !== -1) {
			return temasCargados[index];
		}
		//aparece mensaje de error en el chip en el que estes cuando no existe ese tema
		$scope.errorTema[indice] = true;
		return null;
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
			$scope.texto = tema.valor;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
		
    $scope.queryBuscarTema = function (query) {
		var results = query ? $scope.temasCargados.filter(filtrar(query)) : [];
		return results;
	}
});
