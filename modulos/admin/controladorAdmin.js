app.controller('controladorAdmin', function (servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log, $http) {
	$scope.mensajeEntrevistaCreada = true;
    $rootScope.cargando = false;
    $rootScope.logueado = true;
    $scope.entrevistas = [];
	$scope.hayEntrevistas = false;
	$rootScope.pulsaBoton = false;
	var paginaActual = 1;
	
	if (localStorage.getItem("usuario") !== null) {
		$rootScope.usuario = localStorage.getItem("usuario");
	} else {
		$rootScope.usuario = sessionStorage.getItem("usuario");
	}
	
	if (localStorage.getItem("rol") === "ROLE_ADMIN" || sessionStorage.getItem("rol") === "ROLE_ADMIN") {
		$rootScope.rol = "administrador";
	}
	
	var token = sessionStorage.getItem("token");
	if(token !== null) {
		$http.defaults.headers.common['x-access-token'] = token;
	}
  
	var nombresCargados, simulateQuery = false, nombreSeleccionado = null, dia, mes;
	
	$scope.fecha = new Date();
	
	function escribirDiaMes() {
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
	}

	function escribirHora() {
		for (var i = 0; i < $scope.entrevistas.length; i++) {
			$scope.entrevistas[i].date = $scope.entrevistas[i].date.slice(11, 16);
		}
	}
	
	function calcular () {
		$scope.paginacion = [];
		$scope.stylePaginacion = [];
		//relleno la paginacion por la izquierda
		if(paginaActual > 2) {
			$scope.paginacion[$scope.paginacion.length] = paginaActual - 2;
			$scope.paginacion[$scope.paginacion.length] = paginaActual - 1
		} else if (paginaActual === 2) {
			$scope.paginacion[$scope.paginacion.length] = paginaActual - 1;
		}
		
		$scope.paginacion[$scope.paginacion.length] = paginaActual;
		$scope.stylePaginacion[$scope.paginacion.length - 1] = {"background-color": "#E4E4E4", "color": "#EF6C00"};
		//relleno la paginacion por la derecha
		if(paginaActual + 1 < $scope.ultimaPagina) {
			$scope.paginacion[$scope.paginacion.length] = paginaActual + 1;
			$scope.paginacion[$scope.paginacion.length] = paginaActual + 2;
		}
		else if (paginaActual === $scope.ultimaPagina - 1) {
			$scope.paginacion[$scope.paginacion.length] = $scope.ultimaPagina;
		}
	}
	
	function getEntrevistas(nombre, pagina) {
		paginaActual = pagina;
		var query = "?pagina=" + paginaActual;
		
		if(!$scope.mostrarTodasEntrevistas) {
			escribirDiaMes();
		
			if (nombre === null) {
				query = "?pagina=" + paginaActual + "&fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia;
			} else {
				query = "?pagina=" + paginaActual + "&fecha=" + 
					$scope.fecha.getFullYear() + "-" + mes + "-" + dia + "&nombre=" + nombre;
			}
		} else if (nombre != null) {
			query = "?pagina=" + paginaActual + "&" + nombre;
		}
		
		servicioRest.getEntrevistas(query)
			.then(function (data) {
				$scope.entrevistas = data.results;
				$scope.ultimaPagina = data.total;
				if (data.total < 2) {
					$scope.mostrarPaginacion = false;
				} else {
					$scope.mostrarPaginacion = true;
				}
				escribirHora();
				if (data.length === 0) {
					$scope.hayEntrevistas = true;
				} else {
					$scope.hayEntrevistas = false;
				}
				calcular();
			})
			.catch(function (err) {
				$log.error("Error al cargar las entrevistas: " + err);
				if (err === 403 && token !== null) {
					//cuando entra a admin desde tec
					$location.path('/tec');
				} /*else {
					$location.path('/');
				}*/
			});
	}
	
	$scope.calcularPaginas = function(pagina) {
		getEntrevistas(nombreSeleccionado, pagina)
	}
	
    $scope.crear = function (ev) {
        $mdDialog.show({
            controller: 'controladorAdminCrear',
            templateUrl: 'modulos/admin/adminCrear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            onComplete: function () {
                $rootScope.aniadirSliderTemas();
                
            },
            clickOutsideToClose: false
        })
			.then(function (data) {
				getEntrevistas(nombreSeleccionado, paginaActual);
			})
			.catch(function (err) {
				$log.error("Error al crear la entrevista: " + err);
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
		var query = "";
		if(!$scope.mostrarTodasEntrevistas) {
			escribirDiaMes();
			query = "?fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia;
		}
		
			
		servicioRest.getNombresEntrevistas(query)
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
		if (item !== undefined) {
			var index = buscarNombre(item.valor);

			if (index !== -1) {
				nombreSeleccionado = nombresCargados[index].name;
				getEntrevistas(nombreSeleccionado, paginaActual);
			}
			
		}
    };
	
    $scope.searchTextChange = function searchTextChange(text) {
		if (text === "") {
			nombreSeleccionado = null;
			getEntrevistas(nombreSeleccionado, paginaActual);
		}
    };
	
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
	getEntrevistas(nombreSeleccionado, paginaActual);
	
	//si no se filtra por fecha ni por nombre se desactivan dichos elementos y se hace un get entrevistas
	$scope.mostrarTodasEntrevistas = false;
	$scope.disableCalendario = false;
	
	$scope.getTodasEntervistas = function () {
		$scope.disableCalendario = !$scope.disableCalendario;
		getEntrevistas(nombreSeleccionado, paginaActual);
		$rootScope.obtenerNombres();
	}
	
	
	$scope.cambioFecha = function() {
		getEntrevistas(nombreSeleccionado, paginaActual);
		$rootScope.obtenerNombres();
	};
	
	/* ------------------------------- Borrar, ver y hacer entrevista ------------------------------- */
	
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
	
	$scope.hacerEntrevista = function (ind) {
		$rootScope.pulsaBoton = true;
		$rootScope.indiceEntrevistaSeleccionada = $scope.entrevistas[ind]._id;
		$location.path("/entrevista");
	};

});