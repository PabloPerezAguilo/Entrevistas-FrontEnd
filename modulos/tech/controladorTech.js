app.controller('controladorTech', function(servicioRest, config, $scope, $location, $rootScope) {
    
    /*---------------------------Inicializar vista------------------------------*/
    var Options={
        title: String,
        Valid: Boolean
    }
    var pregunta={
        title:{
            type:String,
            required:true 
        },
        type:{
            type:String,
            required:true
        },
        tags:[String],
        level:{
            type: Number,
        min:1,
        max:10,
        required:true
        },
        answers:[Options]
    }
	$rootScope.cargando = false;
    
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
    
    $scope.ver= function () {
        
        servicioRest.getPreguntas()
			.then(function(data) {
                console.log(data);
				console.log(pregunta);
            //while
				$scope.preguntas.push({
                    titulo: $scope.titulo,
                    tema: $scope.tema,
                    nivel: $scope.nivel,
                    tipo: $scope.tipo
                })
			})
			.catch(function(err) {
				console.log("Error");
                console.log(err);
			});
    }
    
    $scope.crear= function () {
        
        $scope.p = true;
    }
    
    $scope.terminarCrear= function () {
        $scope.p = false;
        /*
        $scope.preguntas.push({
            titulo: 'pregunta1',
            tema: 'java',
            nivel: '6',
            tipo: "test"
        })
        */
        pregunta.title=$scope.titulo
        pregunta.tags=$scope.tema
        pregunta.level=$scope.nivel
        pregunta.type=$scope.tipo
        if($scope.tipo==="abierto")
        {
            //pregunta.answers=$scope.respuestas;
        }
        servicioRest.postPregunta(pregunta)
			.then(function(data) {
                console.log(data);
				console.log(pregunta);
				$scope.preguntas.push({
                    titulo: $scope.titulo,
                    tema: $scope.tema,
                    nivel: $scope.nivel,
                    tipo: $scope.tipo
                })
			})
			.catch(function(err) {
				console.log("Error");
            console.log(err);
			});
        
        
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
        $scope.preguntas.splice(indice, 1);
        
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
