/**
 * @author: Anuj Gupta
 * @description: This directive useful to assign badge in content or collection
 */

'use strict'

angular.module('playerApp')
  .directive('contentBadge', function () {
    return {
      templateUrl: 'views/badge/contentBadge.html',
      restrict: 'E',
      scope: {
        contentid: '=',
        data: '='
      },
        link: function (scope, element, attrs) {// eslint-disable-line
      },
      controller: 'contentBadgeController as contentBadge'
    }
  })
