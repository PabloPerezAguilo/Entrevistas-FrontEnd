app.controller('controladorTec', function(servicioRest, config,$scope, $location, $rootScope, $mdDialog) {
    
    /*---------------------------Inicializar vista------------------------------*/
    var Options={
        title: String,
        Valid: Boolean
    }
    
    var pregunta={
        _id:{
            type: String
        },
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
    $rootScope.logueado=true;
    $rootScope.rolUsuario="Técnico";
    
    /*---------------------------Inicializar lista------------------------------*/
    
    servicioRest.getPreguntas()
        .then(function(data) {
        console.log(data);
        $scope.preguntas=data;
    })
        .catch(function(err) {
        console.log("Error");
        console.log(err);
    });
    
    /*--------------------------Funciones--------------------------*/
    
    $scope.ver= function () {
        
        
    }
    
    $scope.crear= function () {
        $scope.p = true;
    }
    
    $scope.terminarCrear= function () {
        $scope.p = false;
        pregunta.title=$scope.titulo;
        pregunta.tags[0]=$scope.tema;
        pregunta.level=$scope.nivel;
        pregunta.type=$scope.tipo;
        if($scope.tipo==="FREE")
        {
            
            pregunta.answers=null;
        }
        else
        {
            //pregunta.answers=$scope.respuestas;
           pregunta.answers=null; 
        }
        console.log(pregunta);
        servicioRest.postPregunta(pregunta)
			.then(function(data) {
            pregunta._id=data.data._id;
				$scope.preguntas.push({
                    _id: pregunta._id,
                    title: pregunta.title,
                    tags: pregunta.tags[0],
                    level: pregunta.level,
                    type: pregunta.type
                })
			})
			.catch(function(err) {
				console.log("Error");
            console.log(err);
			});
    }
    
    $scope.modificar = function (indice) {
        
	}
    
    $scope.eliminar = function (indice) {
        var idPregunta = $scope.preguntas[indice]._id;
        servicioRest.deletePregunta(idPregunta)
			.then(function(data) {
                console.log(data);
				
				$scope.preguntas.splice(indice, 1);
			})
			.catch(function(err) {
				console.log("Error");
            console.log(err);
			});
	}
    
    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
            controller: 'controladorCrear',
            templateUrl: 'modulos/tec/crear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
    };
});
