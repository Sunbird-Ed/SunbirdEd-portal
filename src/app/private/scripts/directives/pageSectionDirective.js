'use strict'

angular.module('playerApp').directive('pageSection', function () {
  return {
    templateUrl: 'views/common/pageSection.html',
    restrict: 'E',
    scope: {
      type: '='
    },
        link: function (scope, element, attrs) {// eslint-disable-line

        },
    controller: 'pageSectionCtrl as section'
  }
})
