'use strict'

angular.module('playerApp')
  .directive('profileVisibility', function () {
    return {
      templateUrl: 'views/common/profilePrivateField.html',
      restrict: 'E',
      scope: {
        field: '=',
        update: '=',
        top: '='
      },
      controller: 'profileVisibilityController as profVisCtrl'
    }
  })
