'use strict'

angular.module('playerApp')
    .directive('contentFlag', function () {
      return {
        templateUrl: 'views/common/contentFlagModal.html',
        restrict: 'E',
        scope: {
          type: '=',
          contentid: '=',
          contentname: '=',
          versionkey: '=',
          redirect: '='
        },
        link: function (scope, element, attrs) {// eslint-disable-line

        },
        controller: 'contentFlagController as contentFlag'
      }
    })
