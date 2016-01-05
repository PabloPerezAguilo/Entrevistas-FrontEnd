app.controller('controladorAdminCrear', function (servicioRest, $scope, $mdDialog, $mdToast, $rootScope, $log) {
    
    $scope.minSliderValue = [];
    $scope.temasEntrevista = [];
	$scope.errorTema = [];
	
    var Options = {
        tag: String,
        max: Number,
        min: Number
    }, entrevista = {
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
    function preguntaVacia(){
		if($scope.nombreEntrevista === undefined || $scope.nombreEntrevista === "" || sinTemas() 
		   || $scope.fecha === undefined || $scope.horas === undefined || $scope.minutos === undefined) {
			return true;
		}
		return false;
    }
    
    $scope.crearEntrevista = function () {
		var i, j, fecha_hora, dia, mes, minutos;
        
        if (preguntaVacia()) {
            toast("Rellena todos los campos obligatorios");
        } else {
			dia = $scope.fecha.getDate();
			mes = $scope.fecha.getMonth() + 1;
			minutos = $scope.minutos;
			
			if (dia < 10) {
				dia = '0' + dia;
			}
			
			if (mes < 10) {
				mes = '0' + mes;
			}
			
			if (minutos < 10) {
				minutos = '0' + minutos;
			}

            entrevista.leveledTags = [];
            entrevista.name = $scope.nombreEntrevista;
            entrevista.DNI = $scope.dniEntrevista;
            entrevista.date = $scope.fecha.getFullYear() + "-" + mes + "-" + dia + "T" + $scope.horas + ":" + minutos;
			
            for (i = 0; i < $scope.contTest; i++) {
                for (j = 0; j < $scope.temasEntrevista[i].length; j++) {
					entrevista.leveledTags.push({tag: $scope.temasEntrevista[i][j].tag,
											 max: $scope.minSliderValue[i].maxSliderG,
											 min: $scope.minSliderValue[i].minSliderG});
				}
            }
			
			$scope.entrevistas = [];
			servicioRest.postInterview(entrevista)
				.then(function(data) {
					console.log("Crear Entrevista");
					console.log(data);
					$scope.entrevistas.push({
						_id: data.data._id,
						name: data.data.name,
						DNI: data.data.DNI,
						date: data.data.date,
						leveledTags: data.data.leveledTags
					});
					
					console.log(data);
					$scope.hide(entrevista);

					var resul = "Se ha creado una entrevista con: ";
					for (var i = 0; i < data.recuento.length; i++) {
						if (i === data.recuento.length - 1) {
							resul += data.recuento[i].count + " del tema " + data.recuento[i].tag + ".";
						} else {
							resul += data.recuento[i].count + " del tema " + data.recuento[i].tag + ", ";
						}
					}

					$mdDialog.show(
					  $mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Entrevista creada')
						.textContent(resul)
						.ariaLabel('Alert Dialog Demo')
						.ok('Ok')
					);

				})
				.catch(function(err) {
					$log.error("Error al crear la entrevista");
					if (err.status === 500) {
						console.log(err)
						$scope.error = true;
						$scope.temas = err.data.leveledTags;
					}
				});

            console.log(entrevista);
        }
    };
	
	$scope.cerrarError = function (indice) {
		console.log(indice)
		if ($scope.error) {
			$scope.error = false;
		}
		
		if ($scope.errorTema[indice]) {
			$scope.errorTema[indice] = false;
		}
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
        $scope.temasEntrevista[$scope.contTest - 1] = [];
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
	
	$scope.temasAbierta = [];
	$scope.temasTest = [];
	$scope.temasEntrevista = [];
	$scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.numberBuffer = '';
	
	var temasCargados, temas;
	
	function cargarTemas() {
		temasCargados = temas;
		return temasCargados.map( function (tema) {
			tema.valor = tema.tag.toLowerCase();
			return tema;          
      });
	}
	
	servicioRest.getTemas()
		.then(function(data) {
			temas = data;			
			$scope.temasCargados = cargarTemas();
		})
		.catch(function (err) {
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
	
	function selectedItemChange(item) {
		
		if(item !== undefined) {
			if (!angular.isObject(item)) {
				item = {
					tag: item,
					valor: item.toLowerCase()
				};
			}			
		}
    }
	
	$scope.selectedItemChange = selectedItemChange;
    /**
     * Return the proper object when the append is called.
     */
    $scope.transformChip = function transformChip(chip, indice) {
		// If it is an object, it's already a known chip
		if (angular.isObject(chip)) {
			return chip;
		}
		
		var index = buscarTema(chip.toLowerCase());
		if (index !== -1) {
			selectedItemChange(chip);
			return temasCargados[index];
		}
		console.log(indice)
		$scope.errorTema[indice] = true;
		console.log($scope.errorTema[indice]);
		console.log($scope.errorTema);
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
