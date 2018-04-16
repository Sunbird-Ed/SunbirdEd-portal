/**
 * @author: Anuj Gupta
 * @description: This directive useful to show badge in user profile
 */

'use strict'

angular.module('playerApp')
  .directive('profileBadge', function () {
    return {
      templateUrl: 'views/badge/profileBadge.html',
      restrict: 'E',
      scope: {
        isshowadd: '=',
        badgelist: '=',
        otheruserid: '=',
        isprofileinfo: '='
      },
        link: function (scope, element, attrs) {// eslint-disable-line
      },
      controller: 'profileBadgeController as profileBadge'
    }
  })
