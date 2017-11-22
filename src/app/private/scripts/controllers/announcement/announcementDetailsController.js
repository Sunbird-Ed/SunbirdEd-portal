'use strict'

angular.module('playerApp')
  .controller('announcementDetailsController', ['$state', '$stateParams', '$rootScope', 'announcementService', 'toasterService', 'adminService',
    function ($state, $stateParams, $rootScope, announcementService, toasterService, adminService) {
      var announcementDetailsData = this
      announcementDetailsData.showLoader = true

      announcementDetailsData.renderAnnouncement = function () {
        announcementService.getAnnouncementById($stateParams.announcementId).then(function (apiResponse) {
          apiResponse = apiResponse.data
          if (apiResponse && apiResponse.responseCode === 'OK') {
            announcementDetailsData.announcementDetails = apiResponse.result
            announcementDetailsData.showLoader = false
            if (apiResponse.result.userid === $rootScope.userId) {
              announcementDetailsData.announcementDetails.showActions = true
            }
            $('#annDetailsModal').modal({
              closable: false,
              onHide: function () {
                window.history.back()
              },
              onVisible: function () {
                $('.ui.dropdown').dropdown()
              }
            }).modal('show')
          } else {
            toasterService.error(apiResponse.params.errmsg)
          }
        }).catch(function (err) {
          toasterService.error(err.data.params.errmsg)
        }).finally(function () {})
      }
    }
  ])
