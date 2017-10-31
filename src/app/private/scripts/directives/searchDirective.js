'use strict'

angular.module('playerApp').directive('search', function () {
  return {
    templateUrl: 'views/header/search.html',
    restrict: 'E',
    scope: {
      type: '='
    },
    link: function (scope, element, attrs) {

    },
    controller: 'SearchResultController'
  }
})
