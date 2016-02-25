app.controller('controladorAdmin', function (servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log, $http, $mdToast) {
	
	$scope.abrirUsuarios = function(ev) {
		$mdDialog.show({
            controller: 'controladorUsuarios',
            templateUrl: 'modulos/usuario/usuario.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        });
	};
	
	var permiso = sessionStorage.getItem("permiso");
	var ver = sessionStorage.getItem("ver");
	
	if (permiso) {
		$location.path('/entrevista');
	} else if(ver) {
		$location.path('/respuestasEntrevista');
	}
	
	var rol;
	if (sessionStorage.getItem("rol") !== null) {
		rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol") !== null) {
		rol = localStorage.getItem("rol");
	}
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	$scope.introOptions = {
        steps: [
			{
				element: '#seccionAdmin',
				intro: 'Esta es la sección del administrador, aquí podrá ver el listado de las entrevistas, ' +
					'ver en detalle una entrevista, eliminar entrevistas, abrir una pantalla para crear nuevas ' +
					'entrevistas y abrir otra pantalla para hacer la entrevista.'
			},
			{
				element: '#idBtnUsuarios',
				intro: 'Si pulsa este botón se abrirá una ventana para dar de alta usuarios y listarlos según su rol.'
			},
            {
                element: '#idAdminBtnCrear',
                intro: "Si pulsa este botón se abrirá una ventana para crear una entrevista."
            },
			{
				element: '#idListaAdmin',
				intro: 'Esta es la lista con las entrevistas.'
			},
			{
                element: '#idAutocompleteAdmin',
                intro: 'Con este campo podrá filtrar las entrevistas por el nombre del entrevistado.'
            },
			{
				element: '#idCalendarAdmin',
				intro: 'En este calendario podrá seleccionar el día del que desee ver las entrevistas.'
			},
			{
				element: '#idAdminCheck',
				intro: 'Marcando este checkbox se mostrarán todas las entrevistas, sin filtro por fecha.'
			},
			{
				element: '#ver',
				intro: 'Si pulsa este botón se abrirá una ventana con la información más detallada de la entrevista.'
			},
			{
				element: '#eliminar',
				intro: 'Si pulsa este botón se eliminará la entrevista.'
			},
			/*{
				element: '#hacerEntrevista',
				intro: 'Si pulsa este botón se abrirá una ventana para hacer la entrevista.'
			},*/
			{
				element: '#idSwitchAdmin',
				intro: 'Con este botón podrá cambiar entre las entrevistas realizadas y pendientes.'
			}
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: '<strong>Siguiente</strong>',
        prevLabel: '<span>Anterior</span>',
        skipLabel: 'Cerrar',
        doneLabel: 'Fin'
    };
	setTimeout(function () {
		if (!$scope.entrevistasRealizadas) {
			$scope.introOptions.steps.splice($scope.introOptions.steps.length - 1, 0, {
				element: '#hacerEntrevista',
				intro: 'Si pulsa este botón se abrirá una ventana para hacer la entrevista.'
			});
		}
		$rootScope.lanzarAyuda = $scope.lanzarAyuda;
	}, 1000);
	
	$scope.mensajeEntrevistaCreada = true;
    $rootScope.cargando = false;
    $rootScope.logueado = true;
	$rootScope.conFooter = false;
    $scope.entrevistas = [];
	$scope.hayEntrevistas = false;
	$rootScope.pulsaBoton = false;
	//si no se filtra por fecha ni por nombre se desactivan dichos elementos y se hace un get entrevistas
	$scope.mostrarTodasEntrevistas = false;
	$scope.disableCalendario = false;
	var paginaActual = 1;
	
	if (localStorage.getItem("usuario") !== null) {
		$rootScope.usuario = localStorage.getItem("usuario");
	} else {
		$rootScope.usuario = sessionStorage.getItem("usuario");
	}
	
	if (sessionStorage.getItem("rol") !== null) {
		$rootScope.rol = sessionStorage.getItem("rol");
	} else if (localStorage.getItem("rol")) {
		$rootScope.rol = localStorage.getItem("rol");
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
			if($scope.mostrarTodasEntrevistas) {
				$scope.entrevistas[i].date = $scope.entrevistas[i].date.slice(0, 10) + " / " + 
					$scope.entrevistas[i].date.slice(11, 16);
			} else {
				$scope.entrevistas[i].date = $scope.entrevistas[i].date.slice(11, 16);
			}
		}
	}
	
	function calcular () {
		$scope.paginacion = [];
		$scope.stylePaginacion = [];
		//relleno la paginacion por la izquierda
		if(paginaActual > 2) {
			$scope.paginacion[$scope.paginacion.length] = paginaActual - 2;
			$scope.paginacion[$scope.paginacion.length] = paginaActual - 1;
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
		
		if ($scope.entrevistasRealizadas) {
			query += "&estado=Realizada";
		} else {
			query += "&estado=Pendiente"
		}
		
		if(!$scope.mostrarTodasEntrevistas) {
			escribirDiaMes();
		
			if (nombre === null) {
				query += "&fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia;
			} else {
				query +=  "&fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia + "&nombre=" + nombre;
			}
		} else if (nombre != null) {
			query += "&nombre=" + nombre;
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
				if (err === 403 && token !== null && rol === "ROLE_TECH") {
					//cuando entra a admin desde tec
					$location.path('/tec');
				} else if (err === 403 || err === 'Servicio no disponible') {
					if (err === 403) {
						toast("Su sesión ha expirado");
					} else {
						toast("Error de conexión");
					}
					$location.path('/');
					$rootScope.limpiarCredenciales();
				}
			});
	}
	
	$scope.calcularPaginas = function(pagina) {
		getEntrevistas(nombreSeleccionado, pagina)
	}
	
	function cargarNombres(nombres) {
		return nombres.map(function (nombre) {
			nombre.valor = nombre.name.toLowerCase();
			return nombre;
		});
	}
	
	function obtenerNombres() {
		var query = "";
		if ($scope.entrevistasRealizadas) {
			query = "?estado=Realizada";
		} else {
			query = "?estado=Pendiente"
		}
		if(!$scope.mostrarTodasEntrevistas) {
			escribirDiaMes();
			query += "&fecha=" + $scope.fecha.getFullYear() + "-" + mes + "-" + dia;
		}
		
			
		servicioRest.getNombresEntrevistas(query)
			.then(function (data) {
				nombresCargados = cargarNombres(data);
			})
			.catch(function (err) {
				$log.error("Error al cargar los nombres: " + err);
			});
	};
	
	$scope.abrirUsuarios = function(ev) {
		$mdDialog.show({
            controller: 'controladorUsuarios',
            templateUrl: 'modulos/usuario/usuario.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })
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
			console.log("entra")
				getEntrevistas(nombreSeleccionado, paginaActual);
				obtenerNombres();
			})
			.catch(function (err) {
			console.log("blablablaaa")
				$log.error("Error al crear la entrevista: " + err);
            });
			
	};
	
	/* ----------------- AUTOCOMPLETE ---------------- */
	obtenerNombres();
	
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
				getEntrevistas(nombreSeleccionado, 1);
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
		return results;
	};
	
	/* -------------------- LISTAR ENTREVISTAS ---------------------------- */
	getEntrevistas(nombreSeleccionado, paginaActual);
	
	$scope.getTodasEntervistas = function () {
		$scope.disableCalendario = !$scope.disableCalendario;
		getEntrevistas(nombreSeleccionado, paginaActual);
		obtenerNombres();
	}
	
	$scope.cambioFechaSwitch = function() {
		getEntrevistas(nombreSeleccionado, 1);
		obtenerNombres();
	};
	
	/* ------------------------------- Borrar, ver y hacer entrevista ------------------------------- */
	
	$scope.eliminar = function (ev, indice) {
        var idEntrevista = $scope.entrevistas[indice]._id;
		var confirm = $mdDialog.confirm()
        	.title('Procederás a borrar la entrevista')
			.textContent('¿Estás seguro?')
			.ariaLabel('Confirmacion guardar respuestas')
			.targetEvent(ev)
			.ok('Sí')
			.cancel('No');

    	$mdDialog.show(confirm).then(function() {
			servicioRest.deleteEntrevista(idEntrevista)
				.then(function (data) {
					$scope.entrevistas.splice(indice, 1);
					obtenerNombres();
				})
				.catch(function (err) {
					$log.error("Error al eliminar la entrevista: " + err);
				});
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
	
	$scope.hacerEntrevista = function (ev, ind) {
		var confirm = $mdDialog.confirm()
        	.title('Procederás a realizar la entrevista')
			.textContent('¿Estás seguro?')
			.ariaLabel('Confirmacion guardar respuestas')
			.targetEvent(ev)
			.ok('Sí')
			.cancel('No');

    	$mdDialog.show(confirm).then(function() {
			sessionStorage.setItem("permiso", true);
			$rootScope.indiceEntrevistaSeleccionada = $scope.entrevistas[ind]._id;
			$rootScope.nombre = $scope.entrevistas[ind].name;
			$rootScope.temas = $scope.entrevistas[ind].leveledTags;
			$location.path("/entrevista");
    	});
	};

});