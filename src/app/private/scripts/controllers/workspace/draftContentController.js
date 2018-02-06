'use strict'

angular.module('playerApp')
  .controller('DraftContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
    'PaginationService', 'telemetryService',
    function (contentService, searchService, config, $rootScope, $state,
      toasterService, $scope, workSpaceUtilsService, $timeout, PaginationService, telemetryService) {
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
            draftContent.version = res.ver
            draftContent.draftContentData = res.result.content || []
            draftContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, draftContent.pageLimit)
            if (draftContent.draftContentData.length === 0) {
              draftContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0012,
                $rootScope.messages.stmsg.m0008)
            }
            draftContent.generateImpressionEvent('view', 'scroll', 'workspace-content-draft', '/content/draft')
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
              draftContent.getDraftContent(draftContent.pager.currentPage)
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

      /**
             * This function call to generate telemetry
             * on click of Draft Content.
             */
      draftContent.generateInteractEvent = function (edataId, pageId, contentId, env) {
        var contextData = {
          env: env,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }

        var objRollup = ''
        if (contentId !== '') {
          objRollup = ['draftContent', contentId]
        }

        var objectData = {
          id: contentId,
          type: edataId,
          ver: draftContent.version,
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
      draftContent.generateImpressionEvent = function (type, subtype, pageId, url) {
        var contextData = {
          env: 'workspace',
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }
        var objRollup = ['draftContent', $rootScope.userId]
        var objectData = {
          id: $rootScope.userId,
          type: 'draftContent',
          ver: draftContent.version,
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
