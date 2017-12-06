'use strict'

angular.module('playerApp')
  .controller('UpForReviewContentController', ['contentService', 'searchService', 'config',
    '$rootScope', '$scope', '$state', 'toasterService', 'PaginationService',
    'workSpaceUtilsService', '$timeout', 'configService', function (contentService, searchService, config, $rootScope,
      $scope, $state, toasterService, PaginationService, workSpaceUtilsService, $timeout, configService) {
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
      upForReviewContent.search.languages = upForReviewContent.filterDropDown.languages
      upForReviewContent.search.contentTypes = upForReviewContent.filterDropDown.contentTypes
      upForReviewContent.search.subjects = upForReviewContent.filterDropDown.subjects
      upForReviewContent.search.grades = upForReviewContent.filterDropDown.grades
      upForReviewContent.search.boards = upForReviewContent.filterDropDown.boards
      upForReviewContent.search.medium = upForReviewContent.filterDropDown.medium
      upForReviewContent.search.sortingOptions = config.upForReviewSortingOptions
      upForReviewContent.search.sortIcon = true

      upForReviewContent.search.selectedLanguage = []
      upForReviewContent.search.selectedContentType = []
      upForReviewContent.search.selectedBoard = []
      upForReviewContent.search.selectedSubject = []
      upForReviewContent.search.selectedGrades = []

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

      upForReviewContent.search.removeFilterSelection = function (filterType, value) {
        var itemIndex = upForReviewContent.search[filterType].indexOf(value)
        if (itemIndex !== -1) {
          upForReviewContent.search[filterType].splice(itemIndex, 1)
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
        upForReviewContent.search.selectedLanguage = []
        upForReviewContent.search.selectedContentType = []
        upForReviewContent.search.selectedBoard = []
        upForReviewContent.search.selectedSubject = []
        upForReviewContent.search.selectedGrades = []
        upForReviewContent.getUpForReviewContent(1)
      }

      upForReviewContent.getRequestObject = function (pageNumber) {
        var req = {
          filters: {
            status: upForReviewContent.contentStatus,
            createdFor: $rootScope.organisationIds,
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

        if (upForReviewContent.search.selectedLanguage && upForReviewContent.search.selectedLanguage.length > 0) {
          req.filters.language = upForReviewContent.search.selectedLanguage
        }

        if (upForReviewContent.search.selectedContentType && upForReviewContent.search.selectedContentType.length > 0) {
          req.filters.contentType = upForReviewContent.search.selectedContentType
        }

        if (upForReviewContent.search.selectedBoard && upForReviewContent.search.selectedBoard.length > 0) {
          req.filters.board = upForReviewContent.search.selectedBoard
        }

        if (upForReviewContent.search.selectedSubject && upForReviewContent.search.selectedSubject.length > 0) {
          req.filters.subject = upForReviewContent.search.selectedSubject
        }

        if (upForReviewContent.search.selectedGrades && upForReviewContent.search.selectedGrades.length > 0) {
          req.filters.gradeLevel = upForReviewContent.search.selectedGrades
        }

        if (upForReviewContent.search.sortBy) {
          req.sort_by = upForReviewContent.search.sortBy
        }

        return req
      }

      upForReviewContent.getUpForReviewContent = function (pageNumber) {
        pageNumber = pageNumber || 1
        upForReviewContent.loader = toasterService.loader('', $rootScope.messages.stmsg.m0032)
        upForReviewContent.error = {}
        var request = upForReviewContent.getRequestObject(pageNumber)
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
              upForReviewContent.error = upForReviewContent.showErrorMessage(true,
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

      upForReviewContent.search.getSelectedContentTypeValue = function (contentTypes, selectedContentType) {
        var ct = _.filter(contentTypes, function (contentType) {
          return contentType.key === selectedContentType
        })
        return ct ? ct[0].value : ''
      }
    }
  ])
