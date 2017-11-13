'use strict'

angular.module('playerApp')
  .controller('announcementInboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function ($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService) {
      var announcementInboxData = this
      announcementInboxData.showLoader = true

      announcementInboxData.renderAnnouncementList = function (limit) {
        announcementInboxData.limit = limit || 'all'
        announcementService.getInboxAnnouncementList($rootScope.userId).then(function(apiResponse) {
        	apiResponse = apiResponse.data;
            if (apiResponse && apiResponse.responseCode === 'OK') {
              announcementInboxData.result = apiResponse.result
              announcementInboxData.listData = apiResponse.result.announcements
              if (announcementInboxData.listData.length > 0) {
                announcementInboxData.showDataDiv = true
              }
            } else {
              toasterService.error(apiResponse.params.errmsg)
            }
          })
          .catch(function(err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function() {
            announcementInboxData.showLoader = false
          });
      }

      announcementInboxData.getFileExtension = function (mimeType) {
        return announcementService.getFileExtension(mimeType)
      }

      announcementInboxData.showAnnouncementDetails = function (announcementDetails, id) {
		var req = {
			"request": {
				"userId": $rootScope.userId,
				"announcementId": announcementDetails.id,
				"channel": "web"
			}
		}
		announcementService.readAnnouncement(req);
        angular.element(document.querySelector('#annInboxDiv-' + id)).removeClass('announcementCardLeftBorder')
        $scope.announcementInboxData.announcementDetails = announcementDetails
        $('#announcementDetailsModal').modal('show')
      }
    }

  ])
