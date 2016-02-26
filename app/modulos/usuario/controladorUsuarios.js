app.controller('controladorUsuarios', function (servicioRest, config, $scope, $rootScope, $mdDialog, $log, $timeout, $q, $mdToast) {
	
	$scope.administradores = [];
	$scope.tecnicos = [];
	$scope.verCarga = null;
	
	function obtenerUsuarios(rol, array) {
		if (rol === "ROLE_ADMIN") {
			servicioRest.getUsuarios(rol)
				.then(function (data) {
					$scope.administradores = data;
				})
				.catch(function (err) {
					$log.error("Error al cargar los administradores: " + err);
				});
		} else {
			servicioRest.getUsuarios(rol)
				.then(function (data) {
					$scope.tecnicos = data;
				})
				.catch(function (err) {
					$log.error("Error al cargar los tecnicos: " + err);
				});
		}
	}
	
	obtenerUsuarios("ROLE_ADMIN");
	obtenerUsuarios("ROLE_TECH");
	
	var nombresCargadosAdmin, nombresCargadosTec, simulateQuery = false;
	
	function datosValidos() {
		return $scope.radioRol !== undefined && ($scope.nick !== undefined && $scope.nick !== "");
	}
	
	function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
	
	$scope.altaUsuario = function () {
		if (datosValidos()) {
			$scope.verCarga = 'indeterminate';
			var usuario = {
				username: $scope.nick
			};
			if ($scope.radioRol === "admin") {
				usuario.role = "administrador";
			} else {
				usuario.role = "tecnico";
			}

			servicioRest.postUsuario(usuario)
				.then(function (data) {
					if (data.data.role === "ROLE_ADMIN") {
						$scope.administradores.push(data.data);
					} else {
						$scope.tecnicos.push(data.data);
					}
					$scope.creado = true;
					$scope.verCarga = null;
				})
				.catch(function (err) {
					$log.error(err);
					$scope.verCarga = null;
					toast('No existe el usuario "' + $scope.nick + '" en la base de datos');
				});
		} else {
			toast("Debe rellenar los campos");
		}
	};
	
	$scope.cerrarMensaje = function () {
		$scope.creado = false;
		$scope.nick = "";
		$scope.radioRol = undefined;
	};
	
	
	$scope.eliminar = function (indice, rol) {
		var nick;
        if (rol === "tecnico") {
			nick = $scope.tecnicos[indice].username;
			servicioRest.deleteUsuario(nick)
				.then(function (data) {
					$scope.tecnicos.splice(indice, 1);
				})
				.catch(function (err) {
					$log.error("Error al eliminar la entrevista: " + err);
				});
		} else if("admin") {
			nick = $scope.administradores[indice].username;
			servicioRest.deleteUsuario(nick)
				.then(function (data) {
					$scope.administradores.splice(indice, 1);
				})
				.catch(function (err) {
					$log.error("Error al eliminar la entrevista: " + err);
				});
		}
	};
	
	$scope.cancel = function () {
        $mdDialog.hide();
    };
	
	$scope.enter = function (pressEvent) {
		if (pressEvent.keyCode === 13 || pressEvent.which === 13) {
			$scope.altaUsuario();
		}
	};
	
	/* ----------------- AUTOCOMPLETE ---------------- */
	
	function cargarNombres(nombres) {
		return nombres.map(function (nombre) {
			nombre.username = nombre.username.toLowerCase();
			return nombre;
		});
	}
	
	function obtenerNombres() {
		servicioRest.getUsuarios("ROLE_ADMIN")
			.then(function (data) {
				nombresCargadosAdmin = cargarNombres(data);
			})
			.catch(function (err) {
				$log.error("Error al cargar los nombres: " + err);
			});
		
		servicioRest.getUsuarios("ROLE_TECH")
			.then(function (data) {
				nombresCargadosTec = cargarNombres(data);
			})
			.catch(function (err) {
				$log.error("Error al cargar los nombres: " + err);
			});
	}
	
	obtenerNombres();
	
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function (nombre) {
			$scope.texto = nombre.username;
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	}
	
	$scope.queryBuscarNombreTec = function (query) {
		var results = query ? nombresCargadosTec.filter(filtrar(query)) : nombresCargadosTec,
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
	
	$scope.queryBuscarNombreAdmin = function (query) {
		var results = query ? nombresCargadosAdmin.filter(filtrar(query)) : nombresCargadosAdmin,
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
	
	$scope.searchTextChange = function (text, rol) {
		if (text === "") {
			if (rol === "tecnico") {
				obtenerUsuarios("ROLE_TECH");
			} else {
				obtenerUsuarios("ROLE_ADMIN");
			}
		}
    };
	
	$scope.selectedItemChangeTec = function (item) {
		if (item !== undefined) {
			servicioRest.getUsuario(item.role, item.username)
				.then(function (data) {
					$scope.tecnicos = data;
				})
				.catch(function (err) {
					$log.error("Error al cargar el usuario con rol " + item.role + " y nick: "
							   + item.username + ": " + err);
				});
		}
    };
	
	$scope.selectedItemChangeAdmin = function (item) {
		if (item !== undefined) {
			servicioRest.getUsuario(item.role, item.username)
				.then(function (data) {
					$scope.administradores = data;
				})
				.catch(function (err) {
					$log.error("Error al cargar el usuario con rol " + item.role + " y nick: " + item.username + ": " + err);
				});
		}
    };
	
});