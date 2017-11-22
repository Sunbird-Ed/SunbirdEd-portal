'use strict'

angular.module('playerApp').directive('conceptPicker', function () {
  return {
    templateUrl: 'views/common/conceptSelector.html',
    restrict: 'E',
    scope: {
      type: '=',
      selectedConcepts: '=',
      isSearchPage: '='
    },
    link: function (scope, element, attrs) {

    },
    controller: 'ConceptPickerController'
  }
})
