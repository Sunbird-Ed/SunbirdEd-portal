'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:batchDetials
 * @author Harish Kumar Gangula
 * @description
 */

angular.module('playerApp')
  .directive('batchDetails', function() {
    return {
      restrict: 'E',
      bindToController: { batchInfo: '=' },
      controller: 'BatchController',
      controllerAs: 'batch',
      scope: {},
      templateUrl: 'views/batch/batchDetails.html'
    };
  });
