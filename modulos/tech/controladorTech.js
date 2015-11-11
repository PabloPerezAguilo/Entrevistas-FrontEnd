app.controller('controladorTech', function(servicioRest, config, $scope, $location, $rootScope) {
    
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
        
        if($scope.tipo==="abierto")
        {
            //pregunta.answers=$scope.respuestas;
            pregunta.answers=null;
        }
        else
        {
           pregunta.answers=null; 
        }
        console.log(pregunta);
        servicioRest.postPregunta(pregunta)
			.then(function(data) {
                console.log(data.data.level);
				
            pregunta._id=data._id;
            console.log(pregunta);
				$scope.preguntas.push({
                    id: data._id,
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
    
});
