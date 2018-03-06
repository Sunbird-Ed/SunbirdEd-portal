'use strict'

angular.module('playerApp')
  .controller('announcementOutboxListController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams',
    'toasterService', 'announcementAdapter', 'PaginationService', 'telemetryService',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService, announcementAdapter,
      PaginationService, telemetryService) {
      var announcementOutboxData = this

      /**
       * @method init
       * @desc init variables
       * @memberOf Controllers.announcementOutboxListController
       */
      announcementOutboxData.init = function () {
        announcementOutboxData.pager = {}
        // announcementOutboxData.setPage = setPage
        announcementOutboxData.pageLimit = 25
        announcementOutboxData.showLoader = true
        announcementOutboxData.showDataDiv = false
        var pageNumber = parseInt($stateParams.page) || 1
        announcementOutboxData.renderAnnouncementList(pageNumber)
      }

      /**
     * @method renderAnnouncementList
     * @desc - function to get announcement outbox data
     * @memberOf Controllers.announcementOutboxListController
     */
      announcementOutboxData.renderAnnouncementList = function (pageNumber) {
        announcementAdapter.getOutBoxAnnouncementList(announcementOutboxData.pageLimit, pageNumber)
          .then(function (apiResponse) {
            announcementOutboxData.showLoader = false
            announcementOutboxData.totalCount = apiResponse.result.count
            announcementOutboxData.result = apiResponse.result
            announcementOutboxData.listData = apiResponse.result.announcements
            announcementOutboxData.pageNumber = pageNumber
            announcementOutboxData.pager = PaginationService.GetPager(
              apiResponse.result.count, pageNumber, announcementOutboxData.pageLimit)
            if (announcementOutboxData.listData.length > 0) {
              announcementOutboxData.showDataDiv = true
            }
          }, function (err) {
            if (err) {
              announcementOutboxData.showLoader = false
            }
          })
      }

      /**
     * @method setPage
     * @desc - function to setPager
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [page] [page number]
     */
      announcementOutboxData.setPage = function (page) {
        if (page < 1 || page > announcementOutboxData.pager.totalPages) {
          return
        }
        $state.go('announcementOutbox', {page: page})
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
        announcementAdapter.deleteAnnouncement(announcementOutboxData.announcementId).then(function (apiResponse) {
          if (apiResponse.result.status === 'cancelled') {
            announcementOutboxData.closeModal('announcementDeleteModal')
            toasterService.success($rootScope.messages.smsg.moo41)
            _.forEach(announcementOutboxData.listData, function (key, index) {
              if (announcementOutboxData.announcementId === key.id) {
                announcementOutboxData.listData[index].status = 'cancelled'
                return key
              }
            })
          } else {
            toasterService.error(apiResponse.params.errmsg)
            announcementOutboxData.closeModal('announcementDeleteModal')
          }
        }, function (err) {
          if (err) {
            announcementOutboxData.closeModal('announcementDeleteModal')
          }
        })
      }

      /**
     * @method getResend
     * @desc - function to resend announcement
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [announcementId] [to make getResend api call]
     */
      announcementOutboxData.getResend = function (announcementId, announcementTitle) {
        $state.go('announcementResend', {announcementId: announcementId,
          stepNumber: '1',
          telemetryAnnTitle: announcementTitle})
      }

      /**
     * @method showAnnouncementDetails
     * @desc - function to show announcement details
     * @memberOf Controllers.announcementOutboxListController
     * @param {string} [annId] [show details based on announcement id]
     */
      announcementOutboxData.showAnnouncementDetails = function (annId, item) {
        $state.go('announcementDetails', {
          announcementId: annId,
          announcementName: item.title,
          pageId: 'announcement_outbox_view'
        })
      }

      /**
     * @method gotToAnnouncementCreateState
     * @desc - function to change the current state to announcement create
     * @memberOf Controllers.announcementOutboxListController
     */
      announcementOutboxData.gotToAnnouncementCreateState = function () {
        $state.go('announcementCreate', {stepNumber: '1'})
      }
    }
  ])
