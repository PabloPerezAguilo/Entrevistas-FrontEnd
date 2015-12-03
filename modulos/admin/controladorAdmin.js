app.controller('controladorAdmin', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
	
    $rootScope.cargando=false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="img/administrador.svg";
    $scope.entrevistas=[];
    
    var Options = {
        tag: String,
        max: Number,
        min: Number
    };
    var entrevista = {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        DNI: { type: String, required: true },
        date: { type: String, required: true },
        leveledTags: [Options]
	};
    
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
        })
        .then(function (datosPregunta) {
				entrevista.name = datosPregunta.name;
                entrevista.surname = datosPregunta.surname;
                entrevista.DNI = datosPregunta.DNI;
                entrevista.date = datosPregunta.date;
                entrevista.leveledTags = datosPregunta.leveledTags;
                servicioRest.postInterview(entrevista)
                    .then(function(data) {
                        $scope.entrevistas.push({
                            _id: data.data._id,
                            name: data.data.name,
                            surname: data.data.surname,
                            DNI: data.data.DNI,
                            date: data.data.date,
                            leveledTags: data.data.leveledTags
                        })
                        console.log(data);
                    })
                    .catch(function(err) {
                        console.log("Error");
                    	console.log(err);
                    });
			});
    };
});
