'use strict'

angular.module('playerApp').directive('userSearch', function () {
  return {
    templateUrl: 'views/search/userSearch.html',
    restrict: 'E',
    scope: {
      users: '=',
      type: '='
    },
    link: function (scope, element, attrs) {
    },
    controller: 'adminController as admin'
  }
})
