'use strict'

angular.module('playerApp')
  .directive('contentShare', function () {
    return {
      templateUrl: 'views/common/contentSharing.html',
      restrict: 'E',
      scope: {
        id: '=',
        type: '=',
        icon: '=',
        data: '='
      },
        link: function (scope, element, attrs) {// eslint-disable-line

      },
      controller: 'contentSharingController as contentShare'
    }
  })
