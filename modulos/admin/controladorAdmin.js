app.controller('controladorAdmin', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
	
    $rootScope.cargando=false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="img/administrador.svg";
    $scope.entrevistas=[];
	
	if($rootScope.token === undefined || $rootScope.rol !== 'ROLE_ADMIN') {
		$location.path('/');
	}
    
  
	var nombresCargados, simulateQuery = false;
	
	$scope.myDate = new Date();

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
	
	
	function getEntrevistas() {
		servicioRest.getEntrevistas()
			.then(function (data) {
				$scope.entrevistas = data;
			})
			.catch(function (err) {
				$log.error("Error al cargar las entrevistas: " + err);
				if (err === 403) {
					$location.path('/');
				}
			});
	}
	
	getEntrevistas();
	
	/* ----------------- AUTOCOMPLETE ---------------- */
	function cargarNombres(nombres) {
		return nombres.map(function (nombre) {
			nombre.valor = nombre.name.toLowerCase();
			return nombre;
		});
	}
	
	$rootScope.obtenerNombres = function () {
		servicioRest.getNombres()
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
				
				servicioRest.getEntrevistasByNombre(nombresCargados[index].name)
				.then(function (data) {
					$scope.entrevistas = data;
				})
				.catch(function (err) {
					$scope.entrevistas = null;
					$log.error("Error al filtrar el nombre: " + err);
				});
			}
			
		}
    }
	
    $scope.searchTextChange = function searchTextChange(text) {
		if (text === "") {
			getEntrevistas();
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
	

});