'use strict'

angular.module('playerApp').controller('DataDrivenFiltersController', [
  '$scope',
  'config',
  '$rootScope',
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
  'telemetryService',
  function (
    $scope,
    config,
    $rootScope,
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
    telemetryService
  ) {
    var dynamic = this
    $scope.search = {}
    dynamic.search = {}
    dynamic.search.searchKeyword = ''
    dynamic.search.filters = {}
    dynamic.search.contentTypes = config.FILTER.RESOURCES.contentTypes
    dynamic.search.sortingOptions = config.sortingOptions
    dynamic.search.sortBy = { createdOn: 'asc' }
    dynamic.search.sortIcon = true
    dynamic.search.selectedLanguage = []
    dynamic.search.selectedContentType = []
    dynamic.search.sortByOption = {}
    dynamic.inviewLogs = []
    dynamic.dropdownId = []
    dynamic.dropdownValue = []
    dynamic.search.showFilters = false

    // search select dropdown changes
    var selectedsearchKeyHandler = $rootScope.$on('DynsetSearchKey', function (event, args) {
      dynamic.search.selectedSearchKey = args.key
      if (dynamic.search.selectedSearchKey === 'Courses' || dynamic.search.selectedSearchKey === 'Library') {
        dynamic.formFieldProperties = _.uniq(config.FILTER.RESOURCES[dynamic.search.selectedSearchKey])
        _.forEach(dynamic.formFieldProperties, function (category) {
          dynamic.search['selected' + category.code] = []
        })
        dynamic.getChannel(dynamic.formFieldProperties)
        dynamic.formFieldProperties.sort(function (a, b) {
          return a.renderingHints.order - b.renderingHints.order
        })
      }
    })

    var searchKeyHandler = $rootScope.$on('DynSearchKey', function (event, args) {
      dynamic.searchKey = args.key
      dynamic.search.selectedSearchKey = dynamic.searchKey
      if (dynamic.search.selectedSearchKey === 'Courses' || dynamic.search.selectedSearchKey === 'Library') {
        dynamic.formFieldProperties = _.uniq(config.FILTER.RESOURCES[dynamic.search.selectedSearchKey])

        _.forEach(dynamic.formFieldProperties, function (category) {
          dynamic.search['selected' + category.code] = []
        })
        dynamic.getChannel(dynamic.formFieldProperties)
        dynamic.formFieldProperties.sort(function (a, b) {
          return a.renderingHints.order - b.renderingHints.order
        })
      }
      // $scope.search.searchRequest(false)
    })

    var initSearchHandler = $rootScope.$on('initSearch', function (event, args) {
      $scope.search.initSearch()
    })

    dynamic.search.selectFilter =
      function (filterType, value, $event) {
        $timeout(function () {
          var itemIndex = dynamic.search[filterType]
            .indexOf(value)
          if (itemIndex === -1) {
            dynamic.search[filterType].push(value)
            $($event.target).addClass('active')
          } else {
            dynamic.search[filterType].splice(itemIndex, 1)
            $($event.target).removeClass('active')
          }
        }, 0)
      }

    dynamic.doFilter = function () {
      dynamic.isSearchPage = true
    }

    dynamic.getChannel = function (dynamicFields) {
      var dynamicField = dynamicFields
      searchService.getChannel().then(function (res) {
        if (res.responseCode === 'OK') {
          var frameworkId = res.result.channel.defaultFramework
          searchService.getFramework(frameworkId).then(function (res) {
            if (res.responseCode === 'OK') {
              dynamic.search.showFilters = true
              var categoryMasterList = _.cloneDeep(res.result.framework.categories)
              _.forEach(categoryMasterList, function (category) {
                _.forEach(dynamicField, function (category1) {
                  if (category.code === category1.code) {
                    category1.category = category.terms
                  }
                  return category1
                })
              })
            }
          }).catch(function (error) {
            console.log('error is ......', error)
          })
        }
      }).catch(function (error) {
        console.log('error is ......', error)
      })
    }

    dynamic.search.dynamicSelectedSearch = function (code) {
      return dynamic.search['selected' + code]
    }

    dynamic.search.removeFilterSelection = function (filterType, value) {
      if (filterType === 'selectedConcepts') {
        dynamic.search[filterType] = _.filter(dynamic.search[filterType],
          function (x) {
            return x.identifier !== value
          })
        dynamic.search.broadCastConcepts()
      } else {
        var itemIndex = dynamic.search[filterType].indexOf(value)
        if (itemIndex !== -1) {
          dynamic.search[filterType].splice(itemIndex, 1)
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

    dynamic.getRoleName = function (roleId) {
      var roleObj = _.find(dynamic.search.userRoles, { role: roleId })
      return roleObj.roleName
    }
    dynamic.getOrgName = function (orgId) {
      var orgType = _.find(dynamic.search.orgTypes, { id: orgId })
      return orgType.name
    }
    dynamic.expandFilters = function () {
      if ($('#filterIcon').parents('.active').length <= 0) {
        $('#filterIcon').trigger('click')
      }
    }
    $scope.search.initSearch = function () {
      var searchParams = $stateParams
      dynamic.search.selectedSearchKey = dynamic.searchKey || searchParams.type
      dynamic.search.searchKeyword = dynamic.search.searchKeyword || searchParams.query
      dynamic.search.filters = JSON.parse(atob(searchParams.filters || btoa('{}')))
      dynamic.search.sortBy = JSON.parse(atob(searchParams.sort || btoa('{}')))
      dynamic.search.selectedContentType = dynamic.search.filters.contentType || []
      _.forEach(dynamic.formFieldProperties, function (category) {
        dynamic.search['selected' + category.code] = dynamic.search.filters[category.code] || []
      })
      dynamic.search.broadCastConcepts()
      dynamic.search.sortByOption = Object.keys(dynamic.search.sortBy).length > 0
        ? Object.keys(dynamic.search.sortBy)[0] : ''
      dynamic.search.searchFromSuggestion = $stateParams.autoSuggestSearch
      // dynamic.search.sortBy=dynamic.search.sortBy;
      $scope.search.searchRequest()
    }

    $scope.search.searchRequest = function ($event) {
      clearTimeout(dynamic.search.typingTimer)
      if (!$event || $event.charCode === 13) {
        $scope.search.autoSuggest = false
        if ((!$rootScope.search.searchKeyword || $rootScope.search.searchKeyword === '') &&
          ($rootScope.isLearnPage || $rootScope.isResourcesPage) && !$event) {
          $rootScope.$broadcast('initPageSearchFromDynamicPage', { FilterData: dynamic.search.filters,
            sortByData: dynamic.search.sortBy })
        } else if (dynamic.isSearchPage) {
          if ($rootScope.isSearchResultsPage && $rootScope.search.searchKeyword ===
            $stateParams.query && $rootScope.search.selectedSearchKey ===
            $stateParams.type) {
            $rootScope.search.error = {}
            $rootScope.search.loader = toasterService.loader('', $rootScope.messages.stmsg.m0005)
            $scope.search.handleSearch()
          } else {
            $scope.search.autoSuggest = false
            var searchParams = {
              type: $rootScope.search.selectedSearchKey,
              query: $rootScope.search.searchKeyword,
              filters: btoa(JSON.stringify(dynamic.search.filters)),
              sort: btoa(JSON.stringify(dynamic.search.sortBy)),
              autoSuggestSearch: $rootScope.search.searchFromSuggestion || false
            }
            $rootScope.searchTelemetryId = 'search-' + $rootScope.search.selectedSearchKey.toLowerCase()
            $rootScope.searchTelemetryPageid = $rootScope.search.selectedSearchKey.toLowerCase() + '-search'
            $rootScope.inviewLogs = []
            $state.go('Search', searchParams, { reload: true })
          }
        }
      }
    }

    $scope.search.handleSearch = function (pageNumber) {
      pageNumber = pageNumber || 1
      var req = {
        query: $rootScope.search.searchKeyword,
        filters: dynamic.search.filters,
        sort_by: dynamic.search.sortBy,
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
        var librarySearchReq = JSON.parse(JSON.stringify(req))
        if (!req.filters.contentType || (_.isArray(req.filters.contentType) && req.filters.contentType.length === 0)) {
          librarySearchReq.filters.contentType = [
            'Collection',
            'TextBook',
            'LessonPlan',
            'Resource',
            'Story',
            'Worksheet',
            'Game'
          ]
        }
        $scope.search.searchFn = searchService.contentSearch(librarySearchReq)
        $scope.search.resultType = 'content'
        req.filters.objectType = ['Content']
      } else {

      }
      $scope.search.searchFn.then(function (res) {
        if (res !== null && res.responseCode === 'OK') {
          $rootScope.search.autosuggest_data = []
          var responseResult = {}
          if ($rootScope.search.selectedSearchKey === 'Organisations' ||
            $rootScope.search.selectedSearchKey === 'Users') {
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
      dynamic.search.selectedConcepts = args.selectedConcepts
    })

    dynamic.search.broadCastConcepts = function () {
      $rootScope.$broadcast('selectedConceptsFromSearch', {
        selectedConcepts: dynamic.search.selectedConcepts
      })
    }

    dynamic.search.applyFilter = function () {
      _.forEach(dynamic.formFieldProperties, function (category) {
        if (category.inputType === 'Term' || category.inputType === 'Select') {
          if (dynamic.search['selected' + category.code].length) {
            dynamic.search.filters[category.code] = dynamic.search['selected' + category.code]
          }
        }
      })

      dynamic.search.filters.concepts = dynamic.search.selectedConcepts
      dynamic.search.filters.contentType = dynamic.search.selectedContentType
      $rootScope.generateInteractEvent('filter', 'filter-content', 'content', 'filter')
      $rootScope.isSearchResultsPage = false
      $scope.search.searchRequest()
    }

    dynamic.search.resetFilter = function () {
      _.forEach(dynamic.formFieldProperties, function (category) {
        if (dynamic.search['selected' + category.code].length) {
          dynamic.search['selected' + category.code] = []
        }
      })
      dynamic.search.selectedConcepts = []
      dynamic.search.selectedContentType = []
      dynamic.search.broadCastConcepts()
      dynamic.search.filters = {}
      $rootScope.isSearchResultsPage = false
      dynamic.isSearchPage = true
      $scope.search.searchRequest()
      // $state.go(dynamic.search.selectedSearchKey);
      $rootScope.generateInteractEvent('resetFilter', 'resetfilter-content', 'content', 'resetFilter')
    }
    dynamic.search.applySorting = function () {
      var sortByField = dynamic.search.sortByOption
      dynamic.search.sortBy = {}
      dynamic.search.sortBy[sortByField] = (dynamic.search.sortIcon === true)
        ? 'asc' : 'desc'
      $scope.search.searchRequest()
    }

    $scope.$on('$destroy', function () {
      conceptSelHandler()
      initSearchHandler()
      searchKeyHandler()
      selectedsearchKeyHandler()
    })

    dynamic.search.getSelectedContentTypeValue = function (contentTypes, selectedContentType) {
      var ct = _.filter(contentTypes, function (contentType) {
        return contentType.key === selectedContentType
      })
      return ct ? ct[0].value : ''
    }

    // telemetry visit spec
    dynamic.lineInView = function (index, inview, item, objType) {
      var obj = _.filter(dynamic.inviewLogs, function (o) {
        return o.objid === item.identifier
      })
      if (inview === true && obj.length === 0) {
        dynamic.inviewLogs.push({
          objid: item.identifier,
          objtype: objType,
          index: index
        })
      }
      telemetryService.setVisitData(dynamic.inviewLogs)
    }
  }])
