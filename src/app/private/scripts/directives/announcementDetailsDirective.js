'use strict'

angular.module('playerApp').directive('announcementDetailsDirective', function () {
  return {
    templateUrl: 'views/announcement/announcementDetails.html',
    controller: ['$scope', function ($scope) {
    	$scope.getJson = function(json){
    		return JSON.parse(json)
    	}
    }],
    scope: {
      announcementDetails: '='
    }
  }
})
