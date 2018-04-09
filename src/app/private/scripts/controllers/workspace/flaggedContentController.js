'use strict'

angular.module('playerApp')
  .controller('FlaggedContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$state', 'toasterService', 'PaginationService', 'workSpaceUtilsService',
    'permissionsService', 'telemetryService', function (contentService, searchService, config,
      $rootScope, $state, toasterService, PaginationService, workSpaceUtilsService,
      permissionsService, telemetryService) {
      var flaggedContent = this
      flaggedContent.userId = $rootScope.userId
      flaggedContent.contentStatus = ['Flagged']
      flaggedContent.sortBy = 'desc'
      flaggedContent.pageLimit = 9
      flaggedContent.pager = {}

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

      flaggedContent.getAllFlaggedContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        flaggedContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0038)
        flaggedContent.error = {}

        var request = {
          filters: {
            status: flaggedContent.contentStatus,
            createdFor: permissionsService.getRoleOrgMap() && permissionsService.getRoleOrgMap()['FLAG_REVIEWER'],
            objectType: 'Content',
            contentType: config.contributeContentType,
            createdBy: {'!=': flaggedContent.userId}
          },
          sort_by: {
            lastUpdatedOn: flaggedContent.sortBy
          },
          offset: (pageNumber - 1) * flaggedContent.pageLimit,
          limit: flaggedContent.pageLimit
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            flaggedContent.loader.showLoader = false
            flaggedContent.error.showError = false
            flaggedContent.flaggedContentData = []
            if (res.result.content) {
              flaggedContent.flaggedContentData = res.result.content
            }
            flaggedContent.totalCount = res.result.count
            if (flaggedContent.flaggedContentData.length === 0) {
              flaggedContent.error = showErrorMessage(true,
                $rootScope.messages.stmsg.m0039,
                $rootScope.messages.stmsg.m0008)
            }
            flaggedContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, flaggedContent.pageLimit)
          } else {
            flaggedContent.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0023)
            flaggedContent.error.showError = false
          }
        }).catch(function () {
          flaggedContent.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0023)
          flaggedContent.error.showError = false
        })
      }

      flaggedContent.openContentPlayer = function (item) {
        workSpaceUtilsService.openContentPlayer(item, $state.current.name)
      }

      flaggedContent.setPage = function (page) {
        if (page < 1 || page > flaggedContent.pager.totalPages) {
          return
        }
        flaggedContent.getAllFlaggedContent(page)
      }

      flaggedContent.initTocPopup = function () {
        $('.cardTitleEllipse').popup({inline: true})
      }

      // telemetry interact event
      flaggedContent.generateInteractEvent = function (objtype, contentId) {
        telemetryService.interactTelemetryData('workspace', contentId, objtype, '1.0',
          'flaggedContent', 'workspace-flagged-content')
      }

      // telemetry visit spec
      var inviewLogs = []
      flaggedContent.lineInView = function (index, inview, item, section) {
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
