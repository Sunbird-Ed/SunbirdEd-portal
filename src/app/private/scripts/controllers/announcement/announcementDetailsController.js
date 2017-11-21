'use strict'

angular.module('playerApp')
  .controller('announcementDetailsController', ['announcementService', '$state', '$stateParams', 'toasterService', 'adminService',
    function (announcementService, $state, $stateParams, toasterService, adminService) {
      var announcementDetailsData = this
      announcementDetailsData.showLoader = true

      announcementService.getAnnouncementById($stateParams.announcementId).then(function (apiResponse) {
        apiResponse = apiResponse.data
        if (apiResponse && apiResponse.responseCode === 'OK') {
          announcementDetailsData.announcementDetails = apiResponse.result
          announcementDetailsData.showLoader = false
          $('#annDetailsModal').modal({
            closable: false,
            onHide: function () {
              window.history.back()
            }
          }).modal('show')
        } else {
          toasterService.error(apiResponse.params.errmsg)
        }
      }).catch(function (err) {
        toasterService.error(err.data.params.errmsg)
      }).finally(function () {})
    }
  ])
