app.controller('controladorAdmin', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
	$rootScope.cargando=false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="Administrador";
    
    $scope.crear = function(ev) {
        $mdDialog.show({
            controller: 'controladorCrear',
            templateUrl: 'modulos/admin/crear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })
        .then(function (datosPregunta) {
				/*pregunta.title = datosPregunta.title;
                pregunta.tags = datosPregunta.tags;
                pregunta.level = datosPregunta.level;
                pregunta.type = datosPregunta.type;
            
                if(datosPregunta.type === "FREE") {
                    pregunta.directive = datosPregunta.directive;
                    pregunta.answers = null;
                }
                else {
                    pregunta.directive = null;
                    pregunta.answers = datosPregunta.answers; 
                }
                servicioRest.postPregunta(pregunta)
                    .then(function(data) {
                    pregunta._id = data.data._id;
                        $scope.preguntas.push({
                            _id: pregunta._id,
                            title: pregunta.title,
                            tags: pregunta.tags,
                            level: pregunta.level,
                            directive: pregunta.directive,
                            answers: pregunta.answers,
                            type: pregunta.type
                        })
                        console.log(data);
                    })
                    .catch(function(err) {
                        console.log("Error");
                    	console.log(err);
                    });*/
			});
    };
});
