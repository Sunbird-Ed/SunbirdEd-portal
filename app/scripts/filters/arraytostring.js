'use strict';

/**
 * @ngdoc filter
 * @name playerApp.filter:arrayToString
 * @function
 * @description
 * # arrayToString
 * Filter in the playerApp.
 */
angular.module('playerApp')
  .filter('arrayToString', function () {
    return function (input) {
      return input.toString();
    };
  });
