'use strict'

angular.module('playerApp')
<<<<<<< HEAD
  .controller('announcementOutboxListController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', 'toasterService', 'announcementAdapter', 'PaginationService',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService, announcementAdapter, PaginationService) {
=======
  .controller('announcementOutboxListController', ['$rootScope', '$scope',
    'announcementService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'PaginationService',
    function ($rootScope, $scope, announcementService, $timeout, $state, $stateParams, toasterService, adminService, PaginationService) {
>>>>>>> master
      var announcementOutboxData = this
      announcementOutboxData.pager = {}
      announcementOutboxData.setPage = setPage
      announcementOutboxData.showLoader = true
      announcementOutboxData.showDataDiv = false

<<<<<<< HEAD
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
=======
      announcementOutboxData.renderAnnouncementList = function () {
        announcementService.getOutBoxAnnouncementList($rootScope.userId).then(function (apiResponse) {
          apiResponse = apiResponse.data
          if (apiResponse && apiResponse.responseCode === 'OK') {
            announcementOutboxData.result = apiResponse.result
            announcementOutboxData.listData = apiResponse.result.announcements.content
            initController()
            if (announcementOutboxData.listData.length > 0) {
              announcementOutboxData.showDataDiv = true
            }
          } else {
            toasterService.error(apiResponse.params.errmsg)
          }
        })
          .catch(function (err) {
            toasterService.error(err.data.params.errmsg)
          })
          .finally(function () {
            announcementOutboxData.showLoader = false
          })
      }

      function initController () {
        // initialize to page 1
        announcementOutboxData.setPage(1)
      }

      function setPage (page) {
>>>>>>> master
        if (page < 1 || page > announcementOutboxData.pager.totalPages) {
          return
        }
        // get pager object from service
        announcementOutboxData.pager = PaginationService.GetPager(announcementOutboxData.listData.length, page)
        // get current page of items
        announcementOutboxData.items = announcementOutboxData.listData.slice(announcementOutboxData.pager.startIndex, announcementOutboxData.pager.endIndex + 1)
      }

<<<<<<< HEAD
    /**
     * @method showModal
     * @desc - function to show modal popup
     * @memberOf Controllers.announcementOutboxListController
     * @param {int} [modalId] [unique modal id]
     * @param {string} [annId] [announcement id]
     */
=======
>>>>>>> master
      announcementOutboxData.showModal = function (modalId, annId) {
        announcementOutboxData.announcementId = annId
        $('#' + modalId).modal('show')
      }
<<<<<<< HEAD

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
              return ann.id == announcementOutboxData.announcementId
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
=======
      announcementOutboxData.closeModal = function (modalId) {
        $('#' + modalId).modal('hide')
      }
      announcementOutboxData.deleteAnnouncement = function () {
        var requestBody = { "request": {"userid": $rootScope.userId,"announcenmentid": announcementOutboxData.announcementId}}
        announcementService.deleteAnnouncement(requestBody).then(function (apiResponse) {
          apiResponse = apiResponse.data
          if (apiResponse && apiResponse.responseCode === 'OK' && apiResponse.result.status === 'cancelled') {
            toasterService.success('Announcement cancelled successfully.')
            announcementOutboxData.renderAnnouncementList()
          } else {
            toasterService.error(apiResponse.params.errmsg)
          }
        }).catch(function (err) {
          toasterService.error(err.data.params.errmsg)
        }).finally(function () {
          announcementOutboxData.closeModal('announcementDeleteModal')
        })
      }
      announcementOutboxData.getResend = function (announcementId) {
        announcementService.getResend(announcementId).then(function (apiResponse) {
          apiResponse = apiResponse.data
          console.log(JSON.stringify(apiResponse))
          if (apiResponse && apiResponse.responseCode === 'OK') {
            if (apiResponse.hasOwnProperty('result')) {
              $rootScope.$broadcast('editAnnouncementBeforeResend', apiResponse.result)
            } else {
              toasterService.error('An unexpected error occured.')
            }
          } else {
            toasterService.error(apiResponse.params.errmsg)
          }
        }).catch(function (err) {
          toasterService.error(err.data.params.errmsg)
        }).finally(function () {})
>>>>>>> master
      }
    }
  ])
