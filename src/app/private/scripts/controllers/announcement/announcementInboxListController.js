'use strict'
angular.module('playerApp').controller('announcementInboxListController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', '$q', 'toasterService', 'announcementAdapter', 'PaginationService',
  function ($rootScope, $scope, $timeout, $state, $stateParams, $q, toasterService, announcementAdapter, PaginationService) {
    var announcementInboxData = this

    /**
     * @method init
     * @desc init variables
     * @memberOf Controllers.announcementOutboxListController
     */
    announcementInboxData.init = function (limit) {
      announcementInboxData.pageLimit = 10
      announcementInboxData.showLoader = true
      announcementInboxData.showDataDiv = false
      var pageNumber = parseInt($stateParams.page) || 1
      announcementInboxData.renderAnnouncementList(limit, pageNumber)
    }

    /**
     * @method renderAnnouncementList
     * @desc - function to render inbox announcement
     * @memberOf Controllers.announcementInboxListController
     * @param {int} [limit]
     */
    announcementInboxData.renderAnnouncementList = function (limit, pageNumber) {
      announcementInboxData.limit = limit || announcementInboxData.pageLimit
      announcementAdapter.getInboxAnnouncementList(announcementInboxData.limit, pageNumber)
      .then(function (apiResponse) {
        if (apiResponse.result.announcements.length > 0) {
          announcementInboxData.totalCount = apiResponse.result.count
          announcementInboxData.showDataDiv = true
          announcementInboxData.showLoader = false
          announcementInboxData.result = apiResponse.result
          announcementInboxData.listData = apiResponse.result.announcements
          announcementInboxData.pageNumber = pageNumber
          announcementInboxData.pager = PaginationService.GetPager(apiResponse.result.count,
            pageNumber, announcementInboxData.pageLimit)

            // Calling received API
          _.forEach(announcementInboxData.listData, function (announcement) {
            if (announcement.received === false) {
              announcementAdapter.receivedAnnouncement(announcement.id).then(function (response) {})
            }
          })
        }
        announcementInboxData.showLoader = false
      }, function (err) {
        if (err) {
          announcementInboxData.showLoader = false
        }
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
      $state.go('announcementDetails', {
        announcementId: announcementDetails.id,
        announcementName: announcementDetails.title,
        pageId: 'announcement_inbox_list'
      })
    }

    announcementInboxData.setPage = function (page) {
      if (page < 1 || page > announcementInboxData.pager.totalPages) {
        return
      }
      $state.go('announcementInbox', {page: page})
    }
  }
])
