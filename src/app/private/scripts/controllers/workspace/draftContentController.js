'use strict'

angular.module('playerApp')
  .controller('DraftContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
    'PaginationService',
    function (contentService, searchService, config, $rootScope, $state,
      toasterService, $scope, workSpaceUtilsService, $timeout, PaginationService) {
      var draftContent = this
      draftContent.userId = $rootScope.userId
      draftContent.status = ['Draft']
      draftContent.mimeType = [
        'application/vnd.ekstep.ecml-archive',
        'application/vnd.ekstep.content-collection'
      ]
      draftContent.sortBy = 'desc'
      $scope.isSelected = false
      draftContent.selectedContentItem = []
      draftContent.pageLimit = 9
      draftContent.pager = {}
      draftContent.error = {}

      /**
             * This function called when api failed,
             * and its show failed response for 2 sec.
             * @param {String} message
             */
      function showErrorMessage (isClose, message, messageType, messageText) {
        var error = {}
        error.showError = true
        error.isClose = isClose
        error.message = message
        error.messageType = messageType
        if (messageText) {
          error.messageText = messageText
        }
        return error
      }

      draftContent.getDraftContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        draftContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0011)

        var request = {
          filters: {
            status: draftContent.status,
            createdBy: draftContent.userId,
            mimeType: draftContent.mimeType,
            contentType: config.contributeContentType
          },
          sort_by: {
            lastUpdatedOn: draftContent.sortBy
          },
          offset: (pageNumber - 1) * draftContent.pageLimit,
          limit: draftContent.pageLimit
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            draftContent.loader.showLoader = false
            draftContent.error.showError = false
            draftContent.totalCount = res.result.count
            draftContent.pageNumber = pageNumber
            draftContent.draftContentData = res.result.content || []
            draftContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, draftContent.pageLimit)
            if (draftContent.draftContentData.length === 0) {
              draftContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0012,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            draftContent.loader.showLoader = false
            draftContent.error.showError = false
            toasterService.error($rootScope.messages.fmsg.m0006)
          }
        }).catch(function () {
          draftContent.loader.showLoader = false
          draftContent.error.showError = false
          toasterService.error($rootScope.messages.fmsg.m0006)
        })
      }

      draftContent.openContentEditor = function (item) {
        workSpaceUtilsService.openContentEditor(item, $state.current.name)
      }

      draftContent.openRemoveContentModel = function (ContentId) {
        draftContent.removeContentId = ContentId
        draftContent.showRemoveContentModel = true
        $timeout(function () {
          $('#removeContentModel').modal({}).modal('show')
        }, 10)
      }

      draftContent.hideRemoveContentModel = function () {
        workSpaceUtilsService.hideRemoveModel('#removeContentModel')
        draftContent.removeContentId = ''
        draftContent.showRemoveContentModel = false
      }

      draftContent.deleteContent = function (contentId) {
        var requestData = [contentId]
        draftContent.hideRemoveContentModel()
        draftContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0034)
        var request = {
          contentIds: requestData
        }
        contentService.retire(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            draftContent.loader.showLoader = false
            draftContent.selectedContentItem = []
            toasterService.success($rootScope.messages.smsg.m0006)
            draftContent.draftContentData = workSpaceUtilsService
              .removeContentLocal(draftContent.draftContentData, requestData)
            draftContent.pager = PaginationService
              .GetPager(draftContent.totalCount - requestData.length,
                draftContent.pageNumber, draftContent.pageLimit)
            if (draftContent.draftContentData.length === 0) {
              draftContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0012,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            draftContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0022)
          }
        }).catch(function () {
          draftContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0022)
        })
      }

      draftContent.setPage = function (page) {
        if (page < 1 || page > draftContent.pager.totalPages) {
          return
        }
        draftContent.getDraftContent(page)
      }

      draftContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }
    }
  ])
