'use strict'

angular.module('playerApp')
  .controller('announcementDetailsController', ['$state', '$stateParams', '$rootScope', 'toasterService', 'announcementAdapter',
    function ($state, $stateParams, $rootScope, toasterService, announcementAdapter) {
      var announcementDetailsData = this
      announcementDetailsData.showLoader = true

      /**
       * @method renderAnnouncement
       * @desc - function to render announcement by id
       * @memberOf Controllers.announcementDetailsController
       * @param {string} [announcement id]
       */
      announcementDetailsData.renderAnnouncement = function () {
        announcementAdapter.getAnnouncementById($stateParams.announcementId).then(function (apiResponse) {
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
        }, function (err) {
          announcementDetailsData.showLoader = false
        })
      }
    }
  ])
