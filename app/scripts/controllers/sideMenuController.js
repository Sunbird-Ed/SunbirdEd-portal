'use strict';

angular.module('playerApp')
    .controller('sideMenuCtrl', function($scope, $rootScope, $location) {
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPath = $location.path();
        });
        $scope.currentPath = $location.path();

    });