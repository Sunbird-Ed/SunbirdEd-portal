'use strict'

angular.module('playerApp')
    .directive('batchCard', function () {
      return {
        templateUrl: 'views/batch/batchCard.html',
        restrict: 'E',
        scope: {
          showbatchcard: '=',
          coursecreatedby: '='
        },
        link: function (scope, element, attrs, batch) {
          $('#batchStatusOptions').dropdown('set selected ', batch.status)
          batch.getCouserBatchesList()
        },
        controller: 'BatchController as batch',
        bindToController: true
      }
    })
