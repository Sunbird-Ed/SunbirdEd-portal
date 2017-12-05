'use strict'

angular.module('playerApp').controller('SearchResultController', [
  '$scope',
  '$rootScope',
  'config',
  '$timeout',
  '$state',
  '$stateParams',
  'searchService',
  'toasterService',
  '$location',
  'sessionService',
  'adminService',
  'permissionsService',
  'PaginationService',
  'configService',
  function (
      $scope,
      $rootScope,
      config,
      $timeout,
      $state,
      $stateParams,
      searchService,
      toasterService,
      $location,
      sessionService,
      adminService,
      permissionsService,
      PaginationService,
      configService
    ) {
    $scope.search = {}
    $rootScope.search = {}
    $rootScope.search.searchKeyword = ''
    $rootScope.search.filters = {}
    $rootScope.search.typingTimer = -1 // timer identifier
    $rootScope.search.doneTypingInterval = 1000
    $rootScope.search.filterSearchdrpdwn = configService.getFilterSearchdrpdwn()
    $rootScope.search.languages = $rootScope.search.filterSearchdrpdwn.languages
    $rootScope.search.contentTypes = $rootScope.search.filterSearchdrpdwn.contentTypes
    $rootScope.search.subjects = $rootScope.search.filterSearchdrpdwn.subjects
    $rootScope.search.grades = $rootScope.search.filterSearchdrpdwn.grades
    $rootScope.search.boards = $rootScope.search.filterSearchdrpdwn.boards
    $scope.search.searchTypeKeys = $rootScope.search.filterSearchdrpdwn.searchTypeKeys
    $rootScope.search.sortingOptions = $rootScope.search.filterSearchdrpdwn.sortingOptions
    $rootScope.search.sortBy = { createdOn: 'asc' }
    $scope.search.searchSelectionKeys = $rootScope.search.filterSearchdrpdwn.searchSelectionKeys
    $rootScope.search.sortIcon = true
    $rootScope.search.selectedLanguage = []
    $rootScope.search.selectedContentType = []
    $rootScope.search.selectedSubject = []
    $rootScope.search.selectedBoard = []
    $rootScope.search.selectedConcepts = []
    $rootScope.search.selectedLocation = ''
    $rootScope.search.selectedRoles = []
    $rootScope.search.sortByOption = {}
    $scope.search.autoSuggest = true
    $rootScope.search.selectedOrgType = []
    $rootScope.search.pageLimit = 20
    $rootScope.search.pager = {}
      // search select dropdown changes
    $rootScope.$watch('searchKey', function () {
      $timeout(function () {
        $rootScope.search.selectedSearchKey = $rootScope.searchKey
        $scope.search.isSearchTypeKey = $scope.search.searchTypeKeys
                    .includes($rootScope.search.selectedSearchKey)
        $('#headerSearch').dropdown('set selected',
                    $scope.search.isSearchTypeKey === true
                    ? $rootScope.search.selectedSearchKey : 'All')
        $rootScope.search.searchKeyword = ''
      }, 0)
    })
    var initSearchHandler = $rootScope.$on('initSearch', function (event, args) {
      $scope.search.initSearch()
    })
    var searchKeyHandler = $rootScope.$on('setSearchKey', function (event, args) {
      $rootScope.search.selectedSearchKey = args.key
      $scope.search.searchRequest(false)
    })

    $rootScope.search.selectFilter =
            function (filterType, value, $event) {
              $timeout(function () {
                var itemIndex = $rootScope.search[filterType]
                    .indexOf(value)
                if (itemIndex === -1) {
                  $rootScope.search[filterType].push(value)
                  $($event.target).addClass('active')
                } else {
                  $rootScope.search[filterType].splice(itemIndex, 1)
                  $($event.target).removeClass('active')
                }
              }, 0)
            }
    $rootScope.search.removeFilterSelection = function (filterType, value) {
      if (filterType === 'selectedConcepts') {
        $rootScope.search[filterType] = _.filter($rootScope.search[filterType],
                function (x) {
                  return x.identifier !== value
                })
        $rootScope.search.broadCastConcepts()
      } else {
        var itemIndex = $rootScope.search[filterType].indexOf(value)
        if (itemIndex !== -1) {
          $rootScope.search[filterType].splice(itemIndex, 1)
        }
      }
    }

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

    $rootScope.getRoleName = function (roleId) {
      var roleObj = _.find($rootScope.search.userRoles, { role: roleId })
      return roleObj.roleName
    }
    $rootScope.getOrgName = function (orgId) {
      var orgType = _.find($rootScope.search.orgTypes, { id: orgId })
      return orgType.name
    }
    $rootScope.expandFilters = function () {
      if ($('#filterIcon').parents('.active').length <= 0) {
        $('#filterIcon').trigger('click')
      }
    }
    $scope.search.initSearch = function () {
      var searchParams = $stateParams
      $rootScope.search.selectedSearchKey = $rootScope.searchKey || searchParams.type
      $rootScope.search.searchKeyword = $rootScope.search.searchKeyword ||
                searchParams.query
      $rootScope.search.filters = JSON.parse(window.atob(searchParams.filters || window.btoa('{}')))
      $rootScope.search.sortBy = JSON.parse(window.atob(searchParams.sort || window.btoa('{}')))
      $rootScope.search.selectedLanguage = $rootScope.search.filters.language || []
      $rootScope.search.selectedContentType = $rootScope.search.filters.contentType || []
      $rootScope.search.selectedBoard = $rootScope.search.filters.board || []
      $rootScope.search.selectedSubject = $rootScope.search.filters.subject || []
      $rootScope.search.selectedGrades = $rootScope.search.filters.grade || []
      $rootScope.search.selectedConcepts = $rootScope.search.filters.concepts || []
      $rootScope.search.selectedLocation = $rootScope.search.filters.location || ''
      $rootScope.search.selectedRoles = $rootScope.search.filters['organisations.roles'] || []
      $rootScope.search.broadCastConcepts()
      $rootScope.search.sortByOption = Object.keys($rootScope.search.sortBy).length > 0
          ? Object.keys($rootScope.search.sortBy)[0] : ''
      $rootScope.search.searchFromSuggestion = $stateParams.autoSuggestSearch
      $rootScope.search.selectedOrgType = $rootScope.search.filters.orgType || []
        // $rootScope.search.sortBy=$rootScope.search.sortBy;
      $scope.search.searchRequest()
    }

    $rootScope.search.openCourseView = function (course, courseType) {
      var showLectureView = 'no'
      if ($rootScope.enrolledCourseIds[course.courseId || course.identifier]) {
        showLectureView = 'no'
      } else {
        showLectureView = 'yes'
      }
      var params = {
        courseType: courseType,
        courseId: course.courseId || course.identifier,
        lectureView: showLectureView,
        progress: course.progress,
        total: course.total,
        courseName: course.courseName || course.name,
        lastReadContentId: course.lastReadContentId
      }
      sessionService.setSessionData('COURSE_PARAMS', params)
      $state.go('Toc', params)
    }

    $rootScope.search.playContent = function (item) {
      if (item.mimeType === 'application/vnd.ekstep.content-collection') {
        $state.go('PreviewCollection', { Id: item.identifier, name: item.name })
      } else {
        $state.go('Player', {
          content: item,
          contentName: item.name,
          contentId: item.identifier
        })
      }
    }

    $rootScope.search.setSearchText = function (searchText) {
      $rootScope.search.searchKeyword = searchText
      $rootScope.search.searchFromSuggestion = true
      $scope.search.searchRequest(false)
    }
    $scope.search.autoSuggestSearch = function () {
      if ($scope.search.autoSuggest && $rootScope.isSearchPage &&
                     $rootScope.search.searchKeyword.length > 2) {
        $scope.search.handleSearch()
      }
    }
    $scope.search.keyUp = function () {
      clearTimeout($rootScope.search.typingTimer)
      $rootScope.search.typingTimer = setTimeout($scope.search.autoSuggestSearch,
          $rootScope.search.doneTypingInterval)
        // $scope.search.autoSuggest=true;
    }

    $scope.search.keyDown = function () {
      clearTimeout($rootScope.search.typingTimer)
    }

    $scope.search.searchRequest = function ($event) {
      clearTimeout($rootScope.search.typingTimer)
      if (!$event || $event.charCode === 13) {
        $scope.search.autoSuggest = false
        if ((!$rootScope.search.searchKeyword || $rootScope.search.searchKeyword === '') && ($rootScope.isLearnPage || $rootScope.isResourcesPage) && !$event) {
          $rootScope.$broadcast('initPageSearch', {})
        } else if ($rootScope.isSearchPage) {
          if ($rootScope.isSearchResultsPage && $rootScope.search.searchKeyword ===
                            $stateParams.query && $rootScope.search.selectedSearchKey ===
                            $stateParams.type) {
            $rootScope.search.error = {}
            $rootScope.search.loader = toasterService.loader('', $rootScope.messages.stmsg.m0005)
            $scope.search.handleSearch()
          } else {
            $scope.search.autoSuggest = false
            $rootScope.search.filters.concepts = $rootScope.search.selectedConcepts
            var searchParams = {
              type: $rootScope.search.selectedSearchKey,
              query: $rootScope.search.searchKeyword,
              filters: window.btoa(JSON.stringify($rootScope.search.filters)),
              sort: window.btoa(JSON.stringify($rootScope.search.sortBy)),
              autoSuggestSearch: $rootScope.search.searchFromSuggestion || false
            }
            $state.go('Search', searchParams, { reload: true })
          }
        }
      }
    }
    $scope.search.handleSearch = function (pageNumber) {
      pageNumber = pageNumber || 1
      var req = {
        query: $rootScope.search.searchKeyword,
        filters: $rootScope.search.filters,
        sort_by: $rootScope.search.sortBy,
        offset: (pageNumber - 1) * $rootScope.search.pageLimit,
        limit: $rootScope.search.pageLimit

      }
      if (!$scope.search.autoSuggest || $scope.search.autoSuggest === false) {
        if (!$rootScope.search.loader) {
          $rootScope.search.loader = toasterService.loader('', $rootScope.messages.stmsg.m0005)
        }
        $rootScope.search.loader.showLoader = true
      }
        // if any concept is selected then pass array of ids
      if (req.filters.concepts && req.filters.concepts.length > 0) {
        req.filters.concepts = _.map($rootScope.search.selectedConcepts, 'identifier')
      }

        // if autosuggest option is clicked
      if ($rootScope.search.searchFromSuggestion === 'true') {
        req.filters.name = req.query
        req.query = ''
        $rootScope.search.searchFromSuggestion = 'false'
      } else {
        delete req.filters.name
      }
      if ($rootScope.search.selectedSearchKey === 'Courses') {
        $scope.search.searchFn = searchService.courseSearch(req)
        $scope.search.resultType = 'course'
      } else if ($rootScope.search.selectedSearchKey === 'Library') {
        if (!req.filters.contentType || (_.isArray(req.filters.contentType) && req.filters.contentType.length === 0)) {
          req.filters.contentType = [
            'Collection',
            'TextBook',
            'LessonPlan',
            'Resource'
          ]
        }
        $scope.search.searchFn = searchService.contentSearch(req)
        $scope.search.resultType = 'content'
        req.filters.objectType = ['Content']
      } else if ($rootScope.search.selectedSearchKey === 'All') {
        req.filters.contentType = [
          'Collection',
          'TextBook',
          'LessonPlan',
          'Resource'
        ]
        $scope.search.searchFn = searchService.search(req)
        $scope.search.resultType = 'content'
        req.filters.objectType = ['Content']
      } else if ($rootScope.search.selectedSearchKey === 'Users') {
        var emailValidator = /\S+@\S+\.\S+/
        var isEmail = emailValidator.test(req.query)
        var OrgId = $rootScope.userOrganizationId
        if (isEmail === true) {
          req.filters.email = req.query
        }
        if (isEmail === false && req.filters.email) {
          delete req.filters.email
        }
        if (req.sort_by) {
          delete req.sort_by
        }
        if ($rootScope.search.filters.orgType) {
          $rootScope.search.filters.orgType = undefined
          $rootScope.search.selectedOrgType = undefined
        }
        req.filters.objectType = ['user']

        $scope.search.currentUserRoles = permissionsService.getCurrentUserRoles()
        var isSystemAdmin = $scope.search.currentUserRoles
                    .includes('SYSTEM_ADMINISTRATION')

        if (isSystemAdmin === false) {
          req.filters.rootOrgId = $rootScope.rootOrgId
        }

          /* filter by organisation */
        if (OrgId !== '') {
          req.filters['organisations.organisationId'] = OrgId
        }

        $scope.search.searchFn = adminService.userSearch({ request: req })
        $scope.search.resultType = 'users'
      } else if ($rootScope.search.selectedSearchKey === 'Organisations') {
          // req.filters = {};
        if (req.sort_by) {
          delete req.sort_by
        }
          // req.filters.objectType = ['org'];
        $scope.search.searchFn = adminService.orgSearch({ request: req })
        $scope.search.resultType = 'organisations'
      }

      $scope.search.searchFn.then(function (res) {
        if (res !== null && res.responseCode === 'OK') {
          $rootScope.search.autosuggest_data = []
          var responseResult = {}
          if ($rootScope.search.selectedSearchKey === 'Organisations' || $rootScope.search.selectedSearchKey === 'Users') {
            responseResult = res.result.response
          } else {
            responseResult = res.result
          }
              // check if search is happening through autosuggest then autosuggest popup
              // should appear else load search results
          if ($scope.search.autoSuggest &&
                $rootScope.search.searchKeyword !== $stateParams.query) {
            $rootScope.search.autosuggest_data = responseResult[$scope.search.resultType] || []
            if ($rootScope.search.autosuggest_data.length > 0) {
              $('#search-suggestions').addClass('visible').removeClass('hidden')
            }
          } else {
            $rootScope.search.searchResultKeyword = $rootScope.search.searchKeyword
            $('#search-suggestions').addClass('hidden').removeClass('visible')
            $rootScope.search.loader.showLoader = false
            if (responseResult.count === 0) {
              $rootScope.search.error = showErrorMessage(true,
                    $rootScope.messages.stmsg.m0006,
                    $rootScope.messages.stmsg.m0008, $rootScope.messages.stmsg.m0007)
            } else {
              $rootScope.search.error = {}
              $rootScope.search.searchResult = responseResult
              $rootScope.search.pager = PaginationService.GetPager(responseResult.count,
                                     pageNumber, $rootScope.search.pageLimit)
            }
          }
          $scope.search.autoSuggest = true
          clearTimeout($rootScope.search.typingTimer)
        } else {
          $rootScope.search.loader.showLoader = false
          $rootScope.search.error = showErrorMessage(true,
                        $rootScope.messages.fmsg.m0004,
                        $rootScope.messages.emsg.m0002)
          $scope.search.autoSuggest = true
          clearTimeout($rootScope.search.typingTimer)
          throw new Error('')
        }
      }).catch(function (e) {
        $rootScope.search.loader.showLoader = false
        $rootScope.search.error = showErrorMessage(true,
              $rootScope.messages.fmsg.m0004,
              $rootScope.messages.emsg.m0002)
      })
    }
    var conceptSelHandler = $scope.$on('selectedConcepts', function (event, args) {
      $rootScope.search.selectedConcepts = args.selectedConcepts
      _.defer(function () {
        $scope.$apply()
      })
    })
    $rootScope.search.broadCastConcepts = function () {
      $rootScope.$broadcast('selectedConceptsFromSearch', {
        selectedConcepts: $rootScope.search.selectedConcepts
      })
    }
    $rootScope.search.getUserRoles = function () {
      if (!$rootScope.search.userRoles) {
        $rootScope.search.userRoles = permissionsService.getMainRoles()
        $rootScope.search.userRoles = _.sortBy($rootScope.search.userRoles, 'roleName')
      }
    }

    $rootScope.search.applyFilter = function () {
      $rootScope.search.filters.language = $rootScope.search.selectedLanguage
      $rootScope.search.filters.subject = $rootScope.search.selectedSubject
      if ($rootScope.search.selectedSearchKey === 'Users') {
        $rootScope.search.filters.board = undefined
        $rootScope.search.filters.concepts = undefined
        $rootScope.search.filters.contentType = undefined
        $rootScope.search.filters.orgType = undefined
        $rootScope.search.filters.grade = $rootScope.search.selectedGrades
        $rootScope.search.filters.location = ($rootScope.search.selectedLocation.trim() !== '') ? $rootScope.search.selectedLocation.trim() : undefined
        $rootScope.search.filters['organisations.roles'] = $rootScope.search.selectedRoles
      } else if ($rootScope.search.selectedSearchKey === 'Organisations') {
        $rootScope.search.filters = {}
        $rootScope.search.filters.orgTypeId = $rootScope.search.selectedOrgType
      } else {
        $rootScope.search.filters.board = $rootScope.search.selectedBoard
        $rootScope.search.filters.concepts = $rootScope.search.selectedConcepts
        $rootScope.search.filters.contentType = $rootScope.search.selectedContentType
      }

      $rootScope.isSearchResultsPage = false
      $scope.search.searchRequest()
    }
    $rootScope.search.resetFilter = function () {
      $rootScope.isSearchPage = false
      $rootScope.search.selectedLanguage = []
      $rootScope.search.selectedContentType = []
      $rootScope.search.selectedSubject = []
      $rootScope.search.selectedBoard = []
      $rootScope.search.selectedConcepts = []
      $rootScope.search.selectedLocation = ''
      $rootScope.search.selectedRoles = []
      $rootScope.search.broadCastConcepts()
      $rootScope.search.filters = {}
      $rootScope.isSearchResultsPage = false
      $rootScope.isSearchPage = true
      $rootScope.search.selectedGrades = []
      $rootScope.search.selectedOrgType = []
      $scope.search.searchRequest()
        // $state.go($rootScope.search.selectedSearchKey);
    }
    $rootScope.search.applySorting = function () {
      var sortByField = $rootScope.search.sortByOption
      $rootScope.search.sortBy = {}
      $rootScope.search.sortBy[sortByField] = ($rootScope.search.sortIcon === true)
                ? 'asc' : 'desc'
      $scope.search.searchRequest()
    }
    $rootScope.search.close = function () {
      if ($rootScope.search.selectedSearchKey === 'Users' ||
                     $rootScope.search.selectedSearchKey === 'Organisations') {
        $state.go('Profile')
      }

      if ($rootScope.search.selectedSearchKey === 'All') {
        $state.go('Home')
      } else if ($rootScope.search.selectedSearchKey === 'Library') {
        $state.go('Resources')
      } else {
        $state.go($rootScope.search.selectedSearchKey)
      }
    }
    $rootScope.search.setSearchKey = function (key) {
      $rootScope.$emit('setSearchKey', { key: key })
    }
    $scope.$on('$destroy', function () {
      conceptSelHandler()
      initSearchHandler()
      searchKeyHandler()
    })
    $rootScope.search.setPage = function (page) {
      $scope.search.autoSuggest = false
      if (page < 1 || page > $rootScope.search.pager.totalPages) {
        return
      }
      $scope.search.handleSearch(page)
    }
    $rootScope.search.getOrgTypes = function () {
      searchService.getOrgTypeS()
                .then(function (res) {
                  $rootScope.search.orgTypes = res
                })
    }
    $rootScope.search.getOrgTypes()

    $rootScope.search.getSelectedContentTypeValue = function (contentTypes, selectedContentType) {
      var ct = _.filter(contentTypes, function (contentType) {
        return contentType.key === selectedContentType
      })
      return ct ? ct[0].value : ''
    }
  }])
