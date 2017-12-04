'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'toasterService', 'announcementAdapter', 'PaginationService',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService, announcementAdapter, PaginationService) {
      var announcementOutboxData = this
      announcementOutboxData.pager = {}
      announcementOutboxData.setPage = setPage
      announcementOutboxData.showLoader = true
      announcementOutboxData.showDataDiv = false

    /**
     * @method renderAnnouncementList
     * @desc - function to get announcement outbox data
     * @memberOf Controllers.announcementOutboxListController
     */
      announcementOutboxData.renderAnnouncementList = function () {
        announcementAdapter.getOutBoxAnnouncementList($rootScope.userId).then(function (apiResponse) {
          announcementOutboxData.showLoader = false
          announcementOutboxData.result = apiResponse.result
          announcementOutboxData.listData = apiResponse.result.announcements.content
          initController()
          if (announcementOutboxData.listData.length > 0) {
            announcementOutboxData.showDataDiv = true
          }
        }, function (err) {
          announcementOutboxData.showLoader = false
        })
      }

    /**
     * @method initController
     * @desc - function to set page
     * @memberOf Controllers.announcementOutboxListController
     */
      function initController () {
        announcementOutboxData.setPage(1)
      }

    /**
     * @method setPage
     * @desc - function to setPager
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [page] [page number]
     */
      function setPage (page) {
        announcementOutboxData.pager = {}
        if (page < 1 || page > announcementOutboxData.pager.totalPages) {
          return
        }
        // get pager object from service
        announcementOutboxData.pager = PaginationService.GetPager(announcementOutboxData.listData.length, page)
        // get current page of items
        announcementOutboxData.items = announcementOutboxData.listData.slice(announcementOutboxData.pager.startIndex, announcementOutboxData.pager.endIndex + 1)
      }

    /**
     * @method showModal
     * @desc - function to show modal popup
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [modalId] [unique modal id]
     * @param {string} [annId] [announcement id]
     */
      announcementOutboxData.showModal = function (modalId, annId) {
        announcementOutboxData.announcementId = annId
        $('#' + modalId).modal('show')
      }

    /**
     * @method closeModal
     * @desc - function to close modal popup
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [modalId] [unique modal id]
     */
      announcementOutboxData.closeModal = function (modalId) {
        $('#' + modalId).modal('hide')
      }

    /**
     * @method deleteAnnouncement
     * @desc - function to delete announcement
     * @memberOf Controllers.announcementOutboxListController
     */
      announcementOutboxData.deleteAnnouncement = function () {
        announcementAdapter.deleteAnnouncement($rootScope.userId, announcementOutboxData.announcementId).then(function (apiResponse) {
          if (apiResponse.result.status === 'cancelled') {
            toasterService.success($rootScope.messages.smsg.moo41)
            var evens = _.remove(announcementOutboxData.listData, function (ann) {
              return ann.id === announcementOutboxData.announcementId
            })
            announcementOutboxData.setPage(announcementOutboxData.pager.currentPage)
          } else {
            toasterService.error(apiResponse.params.errmsg)
            announcementOutboxData.closeModal('announcementDeleteModal')
          }
        }, function (err) {
          announcementOutboxData.closeModal('announcementDeleteModal')
        })
      }

    /**
     * @method getResend
     * @desc - function to resend announcement
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [announcementId] [to make getResend api call]
     */
      announcementOutboxData.getResend = function (announcementId) {
        announcementAdapter.getResend(announcementId).then(function (apiResponse) {
          if (apiResponse.hasOwnProperty('result')) {
            $rootScope.$broadcast('editAnnouncementBeforeResend', apiResponse.result)
          }
        })
      }

    /**
     * @method showAnnouncementDetails
     * @desc - function to show announcement details
     * @memberOf Controllers.announcementOutboxListController
     * @param {string} [annId] [show details based on announcement id]
     */
      announcementOutboxData.showAnnouncementDetails = function (annId, item) {
        $state.go('announcementDetails', {announcementId: annId, announcementName: item.details.title, pageId: 'announcement_outbox_view'})
      }
    }
  ])
