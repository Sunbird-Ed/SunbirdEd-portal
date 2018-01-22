'use strict'

angular.module('playerApp')
  .controller('UpForReviewContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$scope', '$state', 'toasterService', 'PaginationService',
    'workSpaceUtilsService', 'permissionsService', function (contentService, searchService, config, $rootScope,
      $scope, $state, toasterService, PaginationService, workSpaceUtilsService, permissionsService) {
      var upForReviewContent = this
      upForReviewContent.userId = $rootScope.userId
      upForReviewContent.contentStatus = ['Review']
      upForReviewContent.channelId = 'sunbird'
      upForReviewContent.sortBy = 'desc'
      $scope.contentPlayer = { isContentPlayerEnabled: false }
      upForReviewContent.pageLimit = 9
      upForReviewContent.pager = {}

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

      upForReviewContent.getUpForReviewContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        upForReviewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0032)
        upForReviewContent.error = {}
        var request = {
          filters: {
            status: upForReviewContent.contentStatus,
            createdFor: permissionsService.getRoleOrgMap()['CONTENT_REVIEWER'],
            objectType: 'Content',
            contentType: config.contributeContentType,
            createdBy: {'!=': upForReviewContent.userId}
          },
          sort_by: {
            lastUpdatedOn: upForReviewContent.sortBy
          },
          offset: (pageNumber - 1) * upForReviewContent.pageLimit,
          limit: upForReviewContent.pageLimit
        }
        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            upForReviewContent.loader.showLoader = false
            upForReviewContent.error.showError = false
            upForReviewContent.upForReviewContentData = []
            if (res.result.content) {
              upForReviewContent.upForReviewContentData = res.result.content
            }
            upForReviewContent.totalCount = res.result.count
            upForReviewContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, upForReviewContent.pageLimit)
            if (upForReviewContent.upForReviewContentData.length === 0) {
              upForReviewContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0033,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            upForReviewContent.loader.showLoader = false
            upForReviewContent.error.showError = false
            toasterService.error($rootScope.messages.fmsg.m0021)
          }
        }).catch(function () {
          upForReviewContent.loader.showLoader = false
          upForReviewContent.error.showError = false
          toasterService.error($rootScope.messages.fmsg.m0021)
        })
      }

      upForReviewContent.openContentPlayer = function (item) {
        workSpaceUtilsService.openContentPlayer(item, $state.current.name)
      }

      upForReviewContent.setPage = function (page) {
        if (page < 1 || page > upForReviewContent.pager.totalPages) {
          return
        }
        upForReviewContent.getUpForReviewContent(page)
      }

      upForReviewContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }
    }
  ])
