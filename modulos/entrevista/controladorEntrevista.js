app.controller('controladorEntrevista', function(servicioRest, config, $scope, $location, $rootScope) {
	$rootScope.cargando=false;
    $rootScope.logueado=true;
    $rootScope.rolUsuario="Entrevista";
});