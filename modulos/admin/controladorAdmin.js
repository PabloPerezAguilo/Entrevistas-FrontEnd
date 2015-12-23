app.controller('controladorAdmin', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog, $timeout, $q, $log) {
	
    $rootScope.cargando=false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="img/administrador.svg";
    $scope.entrevistas=[];
	
	if($rootScope.token === undefined || $rootScope.rol !== 'ROLE_ADMIN') {
		$location.path('/');
	}
    
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
        });
	}
});
