app.controller('controladorTecCrear', function(servicioRest, config, $scope, $location, $rootScope, $mdDialog) {
    
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    
    $scope.barra = 5;
});