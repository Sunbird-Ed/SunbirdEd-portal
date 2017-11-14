'use strict'

angular.module('playerApp').directive('announcementDetailsDirective', function () {
  return {
    templateUrl: 'views/announcement/announcementDetails.html',
    scope: {
      announcementDetails: '='
    }
  }
})
