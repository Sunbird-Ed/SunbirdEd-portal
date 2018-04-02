'use strict'

angular.module('playerApp')
  .controller('UpForReviewContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$scope', '$state', '$timeout', 'toasterService', 'PaginationService',
    'workSpaceUtilsService', 'configService', 'permissionsService', 'telemetryService',
    function (contentService, searchService, config, $rootScope, $scope, $state, $timeout,
      toasterService, PaginationService, workSpaceUtilsService, configService, permissionsService,
      telemetryService) {
      var upForReviewContent = this
      upForReviewContent.filterDropDown = configService.getWorkspaceUpforReviewdrpdwn()
      upForReviewContent.userId = $rootScope.userId
      upForReviewContent.contentStatus = ['Review']
      upForReviewContent.channelId = 'sunbird'
      upForReviewContent.sortBy = 'desc'
      $scope.contentPlayer = { isContentPlayerEnabled: false }
      upForReviewContent.pageLimit = 9
      upForReviewContent.pager = {}
      upForReviewContent.typingTimer = -1 // timer identifier
      upForReviewContent.doneTypingInterval = 1000
      upForReviewContent.search = {}
      upForReviewContent.search.mediums = upForReviewContent.filterDropDown.languages
      upForReviewContent.search.contentTypes = upForReviewContent.filterDropDown.contentTypes
      upForReviewContent.search.subjects = upForReviewContent.filterDropDown.subjects
      upForReviewContent.search.grades = upForReviewContent.filterDropDown.grades
      upForReviewContent.search.boards = upForReviewContent.filterDropDown.boards
      upForReviewContent.search.medium = upForReviewContent.filterDropDown.medium
      upForReviewContent.search.sortingOptions = config.upForReviewSortingOptions
      upForReviewContent.search.sortIcon = true

      upForReviewContent.search.selectedMedium = []
      upForReviewContent.search.selectedContentType = []
      upForReviewContent.search.selectedBoard = []
      upForReviewContent.search.selectedSubject = []
      upForReviewContent.search.selectedGrades = []

      upForReviewContent.search.appliedMedium = []
      upForReviewContent.search.appliedContentType = []
      upForReviewContent.search.appliedBoard = []
      upForReviewContent.search.appliedSubject = []
      upForReviewContent.search.appliedGrades = []

      $('#sortByDropDown').dropdown()

      upForReviewContent.showErrorMessage = function (isClose, message, messageType, messageText) {
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

      upForReviewContent.keyUp = function () {
        clearTimeout(upForReviewContent.typingTimer)
        upForReviewContent.typingTimer = setTimeout(upForReviewContent.getUpForReviewContent,
          upForReviewContent.doneTypingInterval)
        // $scope.search.autoSuggest=true;
      }

      upForReviewContent.keyDown = function () {
        clearTimeout(upForReviewContent.typingTimer)
      }

      upForReviewContent.search.selectFilter = function (filterType, value, $event) {
        $timeout(function () {
          var itemIndex = upForReviewContent.search[filterType].indexOf(value)
          if (itemIndex === -1) {
            upForReviewContent.search[filterType].push(value)
            $($event.target).addClass('active')
          } else {
            upForReviewContent.search[filterType].splice(itemIndex, 1)
            $($event.target).removeClass('active')
          }
        }, 0)
      }

      upForReviewContent.search.removeFilterSelection = function (filterType, value, selectedFilterType) {
        upForReviewContent.hideFilter()
        var appliedFilterItemIndex = upForReviewContent.search[filterType].indexOf(value)
        var selectedFilterItemIndex = upForReviewContent.search[selectedFilterType].indexOf(value)
        if (appliedFilterItemIndex !== -1 && selectedFilterItemIndex !== -1) {
          upForReviewContent.search[filterType].splice(appliedFilterItemIndex, 1)
          upForReviewContent.search[selectedFilterType].splice(selectedFilterItemIndex, 1)
          upForReviewContent.getUpForReviewContent(1)
          upForReviewContent.showSelectedChips()
        }
      }

      upForReviewContent.search.applySorting = function () {
        var sortByField = upForReviewContent.search.sortByOption
        upForReviewContent.search.sortBy = {}
        upForReviewContent.search.sortBy[sortByField] = (upForReviewContent.search.sortIcon === true)
          ? 'asc' : 'desc'
        upForReviewContent.getUpForReviewContent(1)
      }

      upForReviewContent.search.resetFilter = function () {
        upForReviewContent.search.selectedMedium = []
        upForReviewContent.search.selectedContentType = []
        upForReviewContent.search.selectedBoard = []
        upForReviewContent.search.selectedSubject = []
        upForReviewContent.search.selectedGrades = []
        upForReviewContent.search.appliedMedium = []
        upForReviewContent.search.appliedContentType = []
        upForReviewContent.search.appliedBoard = []
        upForReviewContent.search.appliedSubject = []
        upForReviewContent.search.appliedGrades = []
        upForReviewContent.getUpForReviewContent(1)
      }

      upForReviewContent.getRequestObject = function (pageNumber) {
        var req = {
          filters: {
            status: upForReviewContent.contentStatus,
            createdFor: permissionsService.getRoleOrgMap() && permissionsService.getRoleOrgMap()['CONTENT_REVIEWER'],
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

        if (upForReviewContent.searchText) {
          req.query = upForReviewContent.searchText
        }

        if (upForReviewContent.appliedFilter) {
          upForReviewContent.isShowAppliedFilter = true
          if ((upForReviewContent.search.selectedMedium && upForReviewContent.search.selectedMedium.length > 0) ||
           (upForReviewContent.search.appliedMedium && upForReviewContent.search.appliedMedium.length > 0)) {
            upForReviewContent.search.appliedMedium = angular.copy(upForReviewContent.search.selectedMedium)
            req.filters.medium = upForReviewContent.search.appliedMedium
          }

          if ((upForReviewContent.search.selectedContentType &&
              upForReviewContent.search.selectedContentType.length > 0) ||
              (upForReviewContent.search.appliedContentType &&
              upForReviewContent.search.appliedContentType.length > 0)) {
            upForReviewContent.search.appliedContentType = angular.copy(upForReviewContent.search.selectedContentType)
            req.filters.contentType = upForReviewContent.search.appliedContentType
          }

          if ((upForReviewContent.search.selectedBoard && upForReviewContent.search.selectedBoard.length > 0) ||
          (upForReviewContent.search.appliedBoard && upForReviewContent.search.appliedBoard.length > 0)) {
            upForReviewContent.search.appliedBoard = angular.copy(upForReviewContent.search.selectedBoard)
            req.filters.board = upForReviewContent.search.appliedBoard
          }

          if ((upForReviewContent.search.selectedSubject && upForReviewContent.search.selectedSubject.length > 0) ||
          (upForReviewContent.search.appliedSubject && upForReviewContent.search.appliedSubject.length > 0)) {
            upForReviewContent.search.appliedSubject = angular.copy(upForReviewContent.search.selectedSubject)
            req.filters.subject = upForReviewContent.search.appliedSubject
          }

          if ((upForReviewContent.search.selectedGrades && upForReviewContent.search.selectedGrades.length > 0) ||
          (upForReviewContent.search.appliedGrades && upForReviewContent.search.appliedGrades.length > 0)) {
            upForReviewContent.search.appliedGrades = angular.copy(upForReviewContent.search.selectedGrades)
            req.filters.gradeLevel = upForReviewContent.search.appliedGrades
          }
        } else {
          upForReviewContent.isShowAppliedFilter = true
        }

        if (upForReviewContent.search.sortBy) {
          req.sort_by = upForReviewContent.search.sortBy
        }

        return req
      }

      upForReviewContent.showSelectedChips = function () {
        if ((upForReviewContent.search.appliedMedium.length > 0 ||
        upForReviewContent.search.appliedContentType.length > 0 ||
        upForReviewContent.search.appliedBoard.length > 0 ||
        upForReviewContent.search.appliedSubject.length > 0 ||
        upForReviewContent.search.appliedGrades.length > 0) && upForReviewContent.appliedFilter) {
          console.log(upForReviewContent.search)
          return true
        } else {
          return false
        }
      }

      upForReviewContent.getUpForReviewContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        upForReviewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0032)
        upForReviewContent.error = {}
        var request = upForReviewContent.getRequestObject(pageNumber)
        upForReviewContent.hideFilter()
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
              upForReviewContent.error = upForReviewContent.showErrorMessage(true,
                $rootScope.messages.stmsg.m0033,
                $rootScope.messages.stmsg.m0008)
            }
          } else {
            upForReviewContent.loader.showLoader = false
            upForReviewContent.error.showError = false
            toasterService.error($rootScope.messages.fmsg.m0021)
          }
          /* upForReviewContent.generateImpressionEvent('view', 'scroll', 'workspace-content-upforreview',
            '/content/upForReview') */
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

      upForReviewContent.generateInteractEvent = function (objType, objId) {
        telemetryService.interactTelemetryData('workspace', objId, objType,
          upForReviewContent.version, objType, 'workspace-content-upforreview')
      }

      upForReviewContent.search.getSelectedContentTypeValue = function (contentTypes, selectedContentType) {
        var ct = _.filter(contentTypes, function (contentType) {
          return contentType.key === selectedContentType
        })
        return ct ? ct[0].value : ''
      }

      upForReviewContent.showFilterPopup = function () {
        upForReviewContent.search.selectedMedium = angular.copy(upForReviewContent.search.appliedMedium)
        upForReviewContent.search.selectedContentType = angular.copy(upForReviewContent.search.appliedContentType)
        upForReviewContent.search.selectedBoard = angular.copy(upForReviewContent.search.appliedBoard)
        upForReviewContent.search.selectedSubject = angular.copy(upForReviewContent.search.appliedSubject)
        upForReviewContent.search.selectedGrades = angular.copy(upForReviewContent.search.appliedGrades)

        upForReviewContent.hideFilterPopup = true
        $('#showFilterButton')
          .popup({
            popup: $('#showFilterPopup'),
            on: 'click',
            position: 'bottom right',
            color: '#4183c4'
          })
      }

      upForReviewContent.hideFilter = function () {
        upForReviewContent.hideFilterPopup = false
      }

      // telemetry visit spec
      var inviewLogs = []
      upForReviewContent.lineInView = function (index, inview, item, section) {
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
