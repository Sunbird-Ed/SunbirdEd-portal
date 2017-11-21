'use strict'

angular.module('playerApp')
  .controller('announcementInboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function ($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService) {
      var announcementInboxData = this
      announcementInboxData.showLoader = true

      announcementInboxData.renderAnnouncementList = function (limit) {
        announcementInboxData.limit = limit || -1
        announcementService.getInboxAnnouncementList($rootScope.userId, announcementInboxData.limit).then(function (apiResponse) {
          apiResponse = apiResponse.data
          if (apiResponse && apiResponse.responseCode === 'OK') {
            announcementInboxData.result = apiResponse.result
            announcementInboxData.listData = apiResponse.result.announcements
            var page = false
            angular.forEach(announcementInboxData.listData, function (value, key) {
              if (!page) {
                if (key + 1 === announcementInboxData.limit) {
                  page = true
                }
                  // Call received API
                if (value.received === false) {
                  announcementService.receivedAnnouncement($rootScope.userId, value.id).then(function (response) {
                    var response = response.data
                    if (response && response.responseCode === 'OK') {
                      console.log('Received success')
                    } else {
                      toasterService.error(response.params.errmsg)
                    }
                  })
                      .catch(function (err) {
                        toasterService.error(err.data.params.errmsg)
                      })
                }
              }
            })
            if (announcementInboxData.listData.length > 0) {
              announcementInboxData.showDataDiv = true
            }
          } else {
            toasterService.error(apiResponse.params.errmsg)
          }
        })
          .catch(function (err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function () {
            announcementInboxData.showLoader = false
          })
      }

      announcementInboxData.getFileExtension = function (mimeType) {
        return announcementService.getFileExtension(mimeType)
      }

      announcementInboxData.showAnnouncementDetails = function (announcementDetails, id) {
        var req = {
          'request': {
            'userId': $rootScope.userId,
            'announcementId': announcementDetails.id,
            'channel': 'web'
          }
        }
        if (announcementDetails.read === false) {
          announcementService.readAnnouncement(req)
          angular.element(document.querySelector('#annInboxDiv-' + id)).removeClass('announcementCardLeftBorder')
        }
        $state.go('announcementDetails', {announcementId: announcementDetails.id})
      }

      announcementInboxData.parJson = function (announcement) {
        return JSON.parse(announcement)
      }
    }

  ])
