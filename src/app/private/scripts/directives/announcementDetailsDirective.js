'use strict'

angular.module('playerApp').directive('announcementDetailsDirective', function () {
  return {
    templateUrl: 'views/announcement/announcementDetailsDirective.html',
    controller: ['$scope', function ($scope) {
      $scope.parJson = function (json) {
        return JSON.parse(json)
      }
    }],
    scope: {
      announcementDetails: '='
    }
  }
})
