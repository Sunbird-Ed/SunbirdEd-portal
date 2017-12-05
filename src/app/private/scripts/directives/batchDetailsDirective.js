'use strict'

angular.module('playerApp')
  .directive('batchDetails', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'E',
      controller: 'BatchController',
      controllerAs: 'batch',
      scope: {
        batchInfo: '='
      },
      link: function (scope, element, attrs, batch) {
        $rootScope.$on('batchDetails', function (e, data) {
          // batch.batchInfo = {data: dataObj.data, names: dataObj.names};
          batch.batchInfo = data
        })
      },
      replace: true,
      templateUrl: 'views/batch/batchDetails.html'
    }
  }])
