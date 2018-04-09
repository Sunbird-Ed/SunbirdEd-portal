'use strict'

angular.module('playerApp')
  .controller('PublishedContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
    'PaginationService', 'telemetryService', function (contentService, searchService, config,
      $rootScope, $state, toasterService, $scope, workSpaceUtilsService, $timeout,
      PaginationService, telemetryService) {
      var publishedContent = this
      publishedContent.userId = $rootScope.userId
      publishedContent.status = ['Live']
      publishedContent.sortBy = 'desc'
      $scope.isSelected = false
      publishedContent.selectedContentItem = []
      publishedContent.pageLimit = 9
      publishedContent.pager = {}

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

      publishedContent.getPublishedContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        publishedContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0021)
        publishedContent.error = {}
        var request = {
          filters: {
            status: publishedContent.status,
            createdBy: publishedContent.userId,
            objectType: 'Content',
            contentType: config.contributeContentType
          },
          sort_by: {
            lastUpdatedOn: publishedContent.sortBy
          },
          offset: (pageNumber - 1) * publishedContent.pageLimit,
          limit: publishedContent.pageLimit
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            publishedContent.error.showError = false
            publishedContent.loader.showLoader = false
            publishedContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, publishedContent.pageLimit)
            publishedContent.publishedContentData = res.result.content || []
            publishedContent.totalCount = res.result.count
            publishedContent.pageNumber = pageNumber
            publishedContent.version = res.ver
            if (publishedContent.publishedContentData.length === 0) {
              publishedContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0022,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            publishedContent.error.showError = false
            publishedContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0013)
          }
          /* publishedContent.generateImpressionEvent('view', 'scroll', 'workspace-content-published',
            '/content/published') */
        }).catch(function () {
          publishedContent.error.showError = false
          publishedContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0013)
        })
      }

      publishedContent.openContentPlayer = function (item) {
        workSpaceUtilsService.openContentEditor(item, $state.current.name)
      }

      publishedContent.initializeUIElement = function () {
        $('#actionDropDown').dropdown()
      }

      publishedContent.openRemoveContentModel = function (ContentId) {
        publishedContent.removeContentId = ContentId
        publishedContent.showRemoveContentModel = true
        $timeout(function () {
          $('#removeContentModel').modal({}).modal('show')
        }, 10)
      }

      publishedContent.hideRemoveContentModel = function () {
        workSpaceUtilsService.hideRemoveModel('#removeContentModel')
        publishedContent.removeContentId = ''
        publishedContent.showRemoveContentModel = false
      }

      publishedContent.deleteContent = function (contentId) {
        var requestData = [contentId]
        publishedContent.hideRemoveContentModel()
        publishedContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0034)
        var request = {
          contentIds: requestData
        }
        contentService.retire(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            publishedContent.loader.showLoader = false
            publishedContent.selectedContentItem = []
            toasterService.success($rootScope.messages.smsg.m0006)
            publishedContent.publishedContentData = workSpaceUtilsService
              .removeContentLocal(publishedContent.publishedContentData, requestData)
            publishedContent.pager = PaginationService.GetPager(publishedContent.totalCount -
                            requestData.length,
            publishedContent.pageNumber, publishedContent.pageLimit)
            if (publishedContent.publishedContentData.length === 0) {
              publishedContent.getPublishedContent(publishedContent.pager.currentPage)
            }
          } else {
            publishedContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0022)
          }
        }).catch(function () {
          publishedContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0022)
        })
      }

      publishedContent.setPage = function (page) {
        if (page < 1 || page > publishedContent.pager.totalPages) {
          return
        }
        publishedContent.getPublishedContent(page)
      }

      publishedContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }

      /**
             * This function call to generate telemetry
             * on click of published content.
             */
      publishedContent.generateInteractEvent = function (edataId, pageId, contentId, env) {
        telemetryService.interactTelemetryData(env, contentId, edataId, publishedContent.version, edataId, pageId)
      }

      // telemetry visit spec
      var inviewLogs = []
      publishedContent.lineInView = function (index, inview, item, section) {
        var obj = _.filter(inviewLogs, function (o) {
          return o.objid === item.identifier
        })
        if (inview === true && obj.length === 0) {
          inviewLogs.push({
            objid: item.identifier,
            objtype: item.contentType || 'workspace',
            section: section,
            index: index
          })
        }
        console.log('------', inviewLogs)
        telemetryService.setVisitData(inviewLogs)
      }
    }
  ])
