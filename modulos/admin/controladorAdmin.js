app.controller('controladorAdmin', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
	
    $rootScope.cargando=false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="img/administrador.svg";
    $scope.entrevistas=[];
	
	if($rootScope.token === undefined || $rootScope.rol !== 'ROLE_ADMIN') {
		$location.path('/');
	}
    
  
	var nombresCargados, simulateQuery = false, nombreSeleccionado = null;
	
	$scope.fecha = new Date();

    $scope.crear = function(ev) {
        $mdDialog.show({
            controller: 'controladorAdminCrear',
            templateUrl: 'modulos/admin/adminCrear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            onComplete: function(){
                $rootScope.aniadirRespuestaTest();
                
            },
            clickOutsideToClose: false
        });
	};
	
	/* ----------------- AUTOCOMPLETE ---------------- */
	function cargarNombres(nombres) {
		return nombres.map(function (nombre) {
			nombre.valor = nombre.name.toLowerCase();
			return nombre;
		});
	}
	
	$rootScope.obtenerNombres = function () {
		var dia, mes;
		
		if ($scope.fecha.getDate() < 10) {
			dia = "0" + $scope.fecha.getDate();
		} else {
			dia = $scope.fecha.getDate();
		}
		
		if ($scope.fecha.getMonth() + 1 < 10) {
			mes = "0" + ($scope.fecha.getMonth() + 1);
		} else {
			mes = $scope.fecha.getMonth() + 1;
		}
			
		servicioRest.getNombresEntrevistas("?fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia)
			.then(function (data) {
				nombresCargados = cargarNombres(data);
			})
			.catch(function (err) {
				$log.error("Error al cargar los nombres: " + err);
			});
	};
	
	$rootScope.obtenerNombres();
	
	function buscarNombre(nombre) {
		var i;
		for (i = 0; i < nombresCargados.length; i++) {
			if (nombre === nombresCargados[i].valor) {
				return i;
			}
		}
		return -1;
	}
	
    $scope.selectedItemChange = function selectedItemChange(item) {
		if(item !== undefined) {
			if (!angular.isObject(item)) {
				item = {
					name: item,
					valor: item.toLowerCase()
				};
			}
			var index = buscarNombre(item.valor);

			if (index !== -1) {
				nombreSeleccionado = nombresCargados[index].name;
				getEntrevistas(nombreSeleccionado);
			}
			
		}
    }
	
    $scope.searchTextChange = function searchTextChange(text) {
		if (text === "") {
			nombreSeleccionado = null;
			getEntrevistas(nombreSeleccionado);
		}
    }
	
	//filtra por el nombre dado
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (nombre) {
			$scope.texto = nombre.valor;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
	
	$scope.queryBuscarNombre = function (query) {
		var results = query ? nombresCargados.filter(filtrar(query)) : nombresCargados,
			deferred;
		if (simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	};
	
	/* -------------------- LISTAR ENTREVISTAS ---------------------------- */
	function escribirHora() {
		for (var i = 0; i < $scope.entrevistas.length; i++) {
			$scope.entrevistas[i].date = $scope.entrevistas[i].date.slice(11,16);
		}	
	}
	
	function getEntrevistas(nombre) {
		var dia, mes, query;
		
		if ($scope.fecha.getDate() < 10) {
			dia = "0" + $scope.fecha.getDate();
		} else {
			dia = $scope.fecha.getDate();
		}
		
		if ($scope.fecha.getMonth() + 1 < 10) {
			mes = "0" + ($scope.fecha.getMonth() + 1);
		} else {
			mes = $scope.fecha.getMonth() + 1;
		}
		if (nombre === null) {
			query = "?fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia;
		} else {
			query = "?fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia + "&nombre=" + nombre;
		}
		
		servicioRest.getEntrevistas(query)
			.then(function (data) {
				$scope.entrevistas = data;
				escribirHora();
			})
			.catch(function (err) {
				$log.error("Error al cargar las entrevistas: " + err);
				if (err === 403) {
					$location.path('/');
				}
			});
	}
	
	getEntrevistas(nombreSeleccionado);
	
	$scope.cambioFecha = function() {
		getEntrevistas(nombreSeleccionado);
		$rootScope.obtenerNombres();
	}
	
	/* ------------------------------- Borrar y ver entrevista ------------------------------- */
	
	$scope.eliminar = function (indice) {
        var idEntrevista = $scope.entrevistas[indice]._id;
        servicioRest.deleteEntrevista(idEntrevista)
			.then(function (data) {
				$scope.entrevistas.splice(indice, 1);
				$rootScope.obtenerNombres();
			})
			.catch(function (err) {
				$log.error("Error al eliminar la entrevista: " + err);
			});
	};
	
	$scope.ver = function (ev, ind) {
		$mdDialog.show(
			{
				locals: { indice: ind },
				scope: $scope.$new(),
				controller: 'controladorVerAdmin',
				templateUrl: 'modulos/admin/ver.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			}
		);
	};

});