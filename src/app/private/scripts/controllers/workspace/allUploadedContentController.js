'use strict'

angular.module('playerApp')
  .controller('AllUploadedContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
    'PaginationService',
    function (contentService, searchService, config, $rootScope, $state,
      toasterService, $scope, workSpaceUtilsService, $timeout, PaginationService) {
      var allUploadedContent = this
      allUploadedContent.userId = $rootScope.userId
      allUploadedContent.contentStatus = ['Draft']
      var mimeType = config.MIME_TYPE
      allUploadedContent.contentMimeType = [mimeType.pdf, mimeType.youtube, mimeType.html,
        mimeType.ePub, mimeType.h5p, mimeType.mp4, mimeType.webm
      ]
      allUploadedContent.sortBy = 'desc'
      $scope.isSelected = false
      allUploadedContent.selectedContentItem = []
      allUploadedContent.pageLimit = 9
      allUploadedContent.pager = {}

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

      allUploadedContent.getAllUploadedContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        allUploadedContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0023)
        allUploadedContent.error = {}
        var request = {
          filters: {
            status: allUploadedContent.contentStatus,
            createdBy: allUploadedContent.userId,
            mimeType: allUploadedContent.contentMimeType,
            contentType: config.contributeContentType
          },
          sort_by: {
            lastUpdatedOn: allUploadedContent.sortBy
          },
          offset: (pageNumber - 1) * allUploadedContent.pageLimit,
          limit: allUploadedContent.pageLimit
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            allUploadedContent.loader.showLoader = false
            allUploadedContent.error.showError = false
            allUploadedContent.totalCount = res.result.count
            allUploadedContent.pageNumber = pageNumber
            allUploadedContent.allUploadedContentData = res.result.content || []
            allUploadedContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, allUploadedContent.pageLimit)
            if (allUploadedContent.allUploadedContentData.length === 0) {
              allUploadedContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0024,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            allUploadedContent.error.showError = false
            allUploadedContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0014)
          }
        }).catch(function () {
          allUploadedContent.error.showError = false
          allUploadedContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0014)
        })
      }

      allUploadedContent.openContentEditor = function (item) {
        workSpaceUtilsService.openContentEditor(item, $state.current.name)
      }

      allUploadedContent.initializeUIElement = function () {
        $('#actionDropDown').dropdown()
      }

      allUploadedContent.openRemoveContentModel = function (ContentId) {
        allUploadedContent.removeContentId = ContentId
        allUploadedContent.showRemoveContentModel = true
        $timeout(function () {
          $('#removeContentModel').modal({}).modal('show')
        }, 10)
      }

      allUploadedContent.hideRemoveContentModel = function () {
        workSpaceUtilsService.hideRemoveModel('#removeContentModel')
        allUploadedContent.removeContentId = ''
        allUploadedContent.showRemoveContentModel = false
      }

      allUploadedContent.deleteContent = function (contentId) {
        var requestData = [contentId]
        allUploadedContent.hideRemoveContentModel()
        allUploadedContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0034)
        var request = {
          contentIds: requestData
        }
        contentService.retire(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            allUploadedContent.loader.showLoader = false
            allUploadedContent.selectedContentItem = []
            toasterService.success($rootScope.messages.smsg.m0006)
            allUploadedContent.allUploadedContentData = workSpaceUtilsService
              .removeContentLocal(allUploadedContent.allUploadedContentData, requestData)
            allUploadedContent.pager = PaginationService
              .GetPager(allUploadedContent.totalCount - requestData.length,
                allUploadedContent.pageNumber, allUploadedContent.pageLimit)
            if (allUploadedContent.allUploadedContentData.length === 0) {
              allUploadedContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0024,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            allUploadedContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0022)
          }
        }).catch(function () {
          allUploadedContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0022)
        })
      }

      allUploadedContent.setPage = function (page) {
        if (page < 1 || page > allUploadedContent.pager.totalPages) {
          return
        }
        allUploadedContent.getAllUploadedContent(page)
      }

      allUploadedContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }
    }
  ])
