'use strict'

angular.module('playerApp')
  .controller('UpForReviewContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$scope', '$state', 'toasterService', 'PaginationService',
    'workSpaceUtilsService', 'permissionsService', 'telemetryService',
    function (contentService, searchService, config, $rootScope, $scope, $state,
      toasterService, PaginationService, workSpaceUtilsService, permissionsService, telemetryService) {
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
            upForReviewContent.version = res.ver
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
          upForReviewContent.generateImpressionEvent('view', 'scroll', 'workspace-content-upforreview',
            '/content/upForReview')
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

      /**
             * This function call to generate telemetry
             * on click of review content.
             */
      upForReviewContent.generateInteractEvent = function (edataId, pageId, contentId, env) {
        var contextData = {
          env: env,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }

        var objRollup = ''
        if (contentId !== '') {
          objRollup = [contentId]
        }

        var objectData = {
          id: contentId,
          type: edataId,
          ver: upForReviewContent.version,
          rollup: telemetryService.getRollUpData(objRollup)
        }

        var data = {
          edata: telemetryService.interactEventData('CLICK', '', edataId, pageId),
          context: telemetryService.getContextData(contextData),
          object: telemetryService.getObjectData(objectData),
          tags: $rootScope.organisationIds
        }
        telemetryService.interact(data)
      }

      // telemetry impression event//
      upForReviewContent.generateImpressionEvent = function (type, subtype, pageId, url) {
        var contextData = {
          env: 'workspace',
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }
        var objRollup = [$rootScope.userId]
        var objectData = {
          id: $rootScope.userId,
          type: 'uploadedContent',
          ver: upForReviewContent.version,
          rollup: telemetryService.getRollUpData(objRollup)
        }
        var data = {
          edata: telemetryService.impressionEventData(type, subtype, pageId, url),
          context: telemetryService.getContextData(contextData),
          object: telemetryService.getObjectData(objectData),
          tags: $rootScope.organisationIds
        }
        telemetryService.impression(data)
      }
    }
  ])
