'use strict'

angular.module('playerApp')
  .controller('announcementInboxListController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', '$q', 'toasterService', 'announcementAdapter',
    function ($rootScope, $scope, $timeout, $state, $stateParams, $q, toasterService, announcementAdapter) {
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

          // Converting attachment to object from string
          _.forEach(announcementInboxData.listData, function (announcement) {
            // Call received API
            if (announcement.received === false) {
              announcementAdapter.receivedAnnouncement(announcement.id).then(function (response) {
                console.log('Received success')
              })
            }

            _.forEach(announcement.attachments, function (attachment, index) {
              attachment = JSON.parse(attachment)
              announcement.attachments[index] = attachment
              return attachment
            })
            return announcement
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
       * @param {string} [user id]
       * @param {string} [announcementid]
       */
      announcementInboxData.showAnnouncementDetails = function (announcementDetails, id) {
        if (announcementDetails.read === false) {
          announcementAdapter.readAnnouncement(announcementDetails.id)
          angular.element(document.querySelector('#annInboxDiv-' + id)).removeClass('announcementCardLeftBorder')
        }
        $state.go('announcementDetails', { announcementId: announcementDetails.id })
      }
    }

  ])
