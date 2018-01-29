'use strict'

angular.module('playerApp')
  .controller('ReviewContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$scope', '$state', 'toasterService', 'PaginationService', 'telemetryService',
    'workSpaceUtilsService', function (contentService, searchService, config, $rootScope, $scope,
      $state, toasterService, PaginationService, workSpaceUtilsService, telemetryService) {
      var reviewContent = this
      reviewContent.userId = $rootScope.userId
      $scope.contentPlayer = { isContentPlayerEnabled: false }
      reviewContent.status = ['Review']
      reviewContent.sortBy = 'desc'
      reviewContent.pageLimit = 9
      reviewContent.pager = {}

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

      reviewContent.getReviewContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        reviewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0018)
        reviewContent.error = {}
        var request = {
          filters: {
            status: reviewContent.status,
            createdBy: reviewContent.userId,
            objectType: 'Content',
            contentType: config.contributeContentType
          },
          sort_by: {
            lastUpdatedOn: reviewContent.sortBy
          },
          offset: (pageNumber - 1) * reviewContent.pageLimit,
          limit: reviewContent.pageLimit
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            reviewContent.loader.showLoader = false
            reviewContent.error.showError = false
            reviewContent.reviewContentData = res.result.content || []
            reviewContent.totalCount = res.result.count
            reviewContent.version = res.ver
            reviewContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, reviewContent.pageLimit)
            if (reviewContent.reviewContentData.length === 0) {
              reviewContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0019,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            reviewContent.loader.showLoader = false
            reviewContent.error.showError = false
            toasterService.error($rootScope.messages.fmsg.m0012)
          }
          reviewContent.generateImpressionEvent('view', 'scroll', 'workspace-content-inreview', '/content/review')
        }).catch(function () {
          reviewContent.loader.showLoader = false
          reviewContent.error.showError = false
          toasterService.error($rootScope.messages.fmsg.m0012)
        })
      }

      reviewContent.openContentPlayer = function (item) {
        workSpaceUtilsService.openContentPlayer(item, $state.current.name)
      }

      reviewContent.setPage = function (page) {
        if (page < 1 || page > reviewContent.pager.totalPages) {
          return
        }
        reviewContent.getReviewContent(page)
      }

      reviewContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }

      /**
             * This function call to generate telemetry
             * on click of review submissions.
             */
      reviewContent.generateInteractEvent = function (edataId, pageId, contentId, env) {
        var contextData = {
          env: env,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }

        var objRollup = ''
        if (contentId !== '') {
          objRollup = ['reviewSubmissions', contentId]
        }

        var objectData = {
          id: contentId,
          type: edataId,
          ver: reviewContent.version,
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
      reviewContent.generateImpressionEvent = function (type, subtype, pageId, url) {
        var contextData = {
          env: 'workspace',
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }
        var objRollup = [$rootScope.userId]
        var objectData = {
          id: $rootScope.userId,
          type: 'reviewContent',
          ver: reviewContent.version,
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
