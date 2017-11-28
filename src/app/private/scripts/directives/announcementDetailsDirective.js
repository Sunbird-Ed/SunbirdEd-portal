'use strict'

angular.module('playerApp').directive('announcementDetailsDirective', function () {
  return {
    templateUrl: 'views/announcement/announcementDetailsTemplate.html',
    scope: {
      announcementDetails: '='
    }
  }
})
