'use strict'

angular.module('playerApp')
  .controller('announcementInboxListController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'toasterService', 'announcementAdapter',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService, announcementAdapter) {
      var announcementInboxData = this
      announcementInboxData.showLoader = true

      /**
       * @method renderAnnouncementList
       * @desc - function to render inbox announcement
       * @memberOf Controllers.announcementInboxListController
       * @param {int} [limit]
       */
      announcementInboxData.renderAnnouncementList = function (limit) {
        announcementInboxData.limit = limit || -1
        announcementAdapter.getInboxAnnouncementList(announcementInboxData.limit).then(function (apiResponse) {
          announcementInboxData.result = apiResponse.result
          announcementInboxData.listData = apiResponse.result.announcements

          angular.forEach(announcementInboxData.listData, function (value, key) {
            // Call received API
            if (value.received === false) {
              announcementAdapter.receivedAnnouncement(value.id).then(function (response) {
                console.log('Received success')
              })
            }
          })
          if (announcementInboxData.listData.length > 0) {
            announcementInboxData.showDataDiv = true
          }
          announcementInboxData.showLoader = false
        }, function (err) {
          announcementInboxData.showLoader = false
        })
      }

      /**
       * @method getFileExtension
       * @desc - function to get extensions from mimetype
       * @memberOf Controllers.announcementInboxListController
       * @param {string} [mimeType]
       */
      announcementInboxData.getFileExtension = function (mimeType) {
        return announcementAdapter.getFileExtension(mimeType)
      }

      /**
       * @method showAnnouncementDetails
       * @desc - function to get announcement by id,  call read api
       * @memberOf Controllers.announcementInboxListController
       * @param {string} [announcementid]
       */
      announcementInboxData.showAnnouncementDetails = function (announcementDetails, id) {
        if (announcementDetails.read === false) {
          announcementAdapter.readAnnouncement(announcementDetails.id)
          angular.element(document.querySelector('#annInboxDiv-' + id)).removeClass('announcementCardLeftBorder')
        }
        $state.go('announcementDetails', { announcementId: announcementDetails.id })
      }

      /**
       * @method parJson
       * @desc - function to parse a string to object
       * @memberOf Controllers.announcementInboxListController
       * @param {string} [announcement]
       */
      announcementInboxData.parJson = function (announcement) {
        return JSON.parse(announcement)
      }
    }

  ])
