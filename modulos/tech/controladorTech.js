app.controller('controladorTech', function(servicioRest, config,$scope, $location, $rootScope, $mdDialog) {
    
    /*---------------------------Inicializar vista------------------------------*/
    
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
        }
    ];
    
    /*--------------------------Funciones--------------------------*/
    
    $scope.crear= function () {
        $scope.preguntas.push({
            titulo: 'pregunta1',
            tema: 'java',
            nivel: '6',
            tipo: "test"
        })
    };
    
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
    
    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
            controller: 'controladorCrear',
            templateUrl: 'modulos/tech/crear.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
    };
    
    function controladorCrear(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
        $scope.hide = function(){
            $mdDialog.hide();
        };
        $scope.cancel = function(){
            $mdDialog.cancel();
        };
        $scope.answer = function(answer){
            $mdDialog.hide(answer);
        };
    };
});
