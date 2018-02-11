'use strict'

angular.module('playerApp')
  .controller('LimitedPublishedContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$state', 'toasterService', 'workSpaceUtilsService', '$timeout',
    'PaginationService', 'telemetryService', function (contentService, searchService, config, $rootScope, $state,
      toasterService, workSpaceUtilsService, $timeout, PaginationService, telemetryService) {
      var lpContent = this
      lpContent.userId = $rootScope.userId
      lpContent.status = ['Unlisted']
      lpContent.sortBy = 'desc'
      lpContent.selectedContentItem = []
      lpContent.pageLimit = 9
      lpContent.pager = {}

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

      lpContent.getlimitedpublishedContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        lpContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0082)
        lpContent.error = {}
        var request = {
          filters: {
            status: lpContent.status,
            createdBy: lpContent.userId,
            objectType: 'Content',
            contentType: config.contributeContentType
          },
          sort_by: {
            lastUpdatedOn: lpContent.sortBy
          },
          offset: (pageNumber - 1) * lpContent.pageLimit,
          limit: lpContent.pageLimit
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            lpContent.error.showError = false
            lpContent.loader.showLoader = false
            lpContent.pager = PaginationService.GetPager(res.result.count, pageNumber, lpContent.pageLimit)
            lpContent.limitedpublishedContentData = res.result.content || []
            lpContent.totalCount = res.result.count
            lpContent.pageNumber = pageNumber
            lpContent.version = res.ver
            if (lpContent.limitedpublishedContentData.length === 0) {
              lpContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0083,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            lpContent.error.showError = false
            lpContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0064)
          }
          lpContent.generateImpressionEvent('view', 'scroll', 'workspace-content-unlisted',
            '/content/limited/publish')
        }).catch(function () {
          lpContent.error.showError = false
          lpContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0064)
        })
      }

      lpContent.openContentPlayer = function (item) {
        workSpaceUtilsService.openContentEditor(item, $state.current.name)
      }

      lpContent.initializeUIElement = function () {
        $('#actionDropDown').dropdown()
      }

      lpContent.openRemoveContentModel = function (ContentId) {
        lpContent.removeContentId = ContentId
        lpContent.showRemoveContentModel = true
        $timeout(function () {
          $('#removeContentModel').modal({}).modal('show')
        }, 10)
      }

      lpContent.hideRemoveContentModel = function () {
        workSpaceUtilsService.hideRemoveModel('#removeContentModel')
        lpContent.removeContentId = ''
        lpContent.showRemoveContentModel = false
      }

      lpContent.deleteContent = function (contentId) {
        var requestData = [contentId]
        lpContent.hideRemoveContentModel()
        lpContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0034)
        var request = {
          contentIds: requestData
        }
        contentService.retire(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            lpContent.loader.showLoader = false
            lpContent.selectedContentItem = []
            lpContent.version = res.ver
            toasterService.success($rootScope.messages.smsg.m0006)
            lpContent.limitedpublishedContentData = workSpaceUtilsService
              .removeContentLocal(lpContent.limitedpublishedContentData, requestData)
            lpContent.pager = PaginationService.GetPager(lpContent.totalCount -
                            requestData.length,
            lpContent.pageNumber, lpContent.pageLimit)
            if (lpContent.limitedpublishedContentData.length === 0) {
              lpContent.getlimitedpublishedContent(lpContent.pager.currentPage)
            }
          } else {
            lpContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0022)
          }
        }).catch(function () {
          lpContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0022)
        })
      }

      lpContent.setPage = function (page) {
        if (page < 1 || page > lpContent.pager.totalPages) {
          return
        }
        lpContent.getlimitedpublishedContent(page)
      }

      lpContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }

      /**
             * This function call to generate telemetry
             * on click of review content.
             */
      lpContent.generateInteractEvent = function (edataId, pageId, contentId, env) {
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
          ver: lpContent.version,
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
      lpContent.generateImpressionEvent = function (type, subtype, pageId, url) {
        var contextData = {
          env: 'workspace',
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }
        var objRollup = [$rootScope.userId]
        var objectData = {
          id: $rootScope.userId,
          type: 'unlistedContent',
          ver: lpContent.version,
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
