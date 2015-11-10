app.controller('controladorTech', function(servicioRest, config, $scope, $location, $rootScope) {
    
    /*---------------------------Inicializar vista------------------------------*/
    
	$rootScope.cargando=false;
    
    $scope.preguntas = [
      {
        titulo: 'hola this weekend?',
        tema: 'Min Li Chan',
        nivel: '3:08PM',
        tipo: " I'll be in your neighborhood doing errands"
      },
      {
        titulo: 'hola this weekend?',
        tema: 'Min Li Chan',
        nivel: '3:08PM',
        tipo: " I'll be in your neighborhood doing errands"
      },
    ];
    
    /*--------------------------Funciones--------------------------*/
    
    $scope.crear= function () {
        
        $scope.p=true;
    }
    
    $scope.terminarCrear= function () {
        $scope.p=false;
        /*
        $scope.preguntas.push({
            titulo: 'pregunta1',
            tema: 'java',
            nivel: '6',
            tipo: "test"
        })
        */
        $scope.preguntas.push({
            titulo: $scope.titulo,
            tema: $scope.tema,
            nivel: $scope.nivel,
            tipo: $scope.tipo
        })
    }
    
    $scope.modificar = function (indice) {
        /*function(item) {
        angular.element(document.getElementById("modal")).scope().item = item;
    };*/
        /*$rootScope.cargando = true;
		var user = {};
		user.username = $scope.user;
		user.password = $scope.pass;
		servicioRest.postAuthenticate(user)
			.then(function(data) {
				console.log(data.role);
				if(data.role === "ROLE_ADMIN") {
					$location.path("/admin");
				} else {
					$location.path("/tech");
				}
			})
			.catch(function(err) {
                $rootScope.cargando = false;
				console.log("Error");
				console.log(err);
				if (err === "Servicio no disponible") {
					toast("Error de conexión");
				} else if($scope.user == null && $scope.pass == null) {
					toast("Debe introducir su usuario y contraseña");
				} else if($scope.user == null) {
					toast("Debe introducir su usuario");
				} else if($scope.pass == null) {
					toast("Debe introducir su contraseña");
				} else {
					toast("El usuario o la contraseña es incorrecta");
				}
			});*/
	}
    
    $scope.eliminar = function (indice) {
        $scope.preguntas.splice(indice,1);
        
        /* SOLUCION
        
        $scope.delete = function ( idx ) {
  var person_to_delete = $scope.persons[idx];

  API.DeletePerson({ id: person_to_delete.id }, function (success) {
    $scope.persons.splice(idx, 1);
  });
};
        
        */
	}
    
});
