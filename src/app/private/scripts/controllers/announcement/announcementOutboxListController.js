'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService) {
      var announcementOutboxData = this
      announcementOutboxData.showLoader = true

      announcementOutboxData.renderAnnouncementList = function() {
        announcementService.getOutBoxAnnouncementList().then(function(apiResponse) {
            apiResponse = apiResponse.data

            if (apiResponse && apiResponse.responseCode === 'OK') {
              announcementOutboxData.listData = apiResponse.result.announcements
            } else {
              alert()
              toasterService.error(apiResponse.params.errmsg)
              // announcementOutboxData.showDataDiv = false
            }
          })
          .catch(function(err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function() {
            announcementOutboxData.showLoader = false
          });
      }
    }

  ])
