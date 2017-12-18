'use strict'

angular.module('playerApp')
  .service('routeHelperService', ['$rootScope', '$stateParams', '$timeout', 'sessionService',
    'permissionsService', 'toasterService', '$state',
    function ($rootScope, $stateParams, $timeout, sessionService, permissionsService,
      toasterService, $state) {
      /**
     * @class routeHelperService
     * @desc Service to manages breadCrumb and route states.
     * @memberOf Services
     */

      /**
             * @method loadRouteConfig
             * @desc Manage route states,search settings and breadCrumbs
             * @memberOf Services.routeHelperService
             * @param {string}  stateName - State name of route
             * @param {object}  stateParamsData - StateParams passed from the route state
             * @instance
             */
      this.loadRouteConfig = function (stateName, $stateParamsData) {
        $stateParams = $stateParamsData
        var searchEnabledStates = ['Home', 'Courses', 'Resources', 'CourseNote',
          'ContentNote', 'CourseContentNote', 'Toc', 'Player',
          'Search', 'TocPlayer', 'PreviewCollection', 'Profile', 'PublicProfile']
        var filterEnabledStates = ['Courses', 'Resources', 'Search']
        var searchKey = {
          Home: 'All',
          Courses: 'Courses',
          Resources: 'Library',
          CourseNote: 'Courses',
          ContentNote: 'Library',
          CourseContentNote: 'Courses',
          Toc: 'Courses',
          Player: 'Library',
          Search: $stateParams ? $stateParams.type : 'All',
          TocPlayer: 'Courses',
          PreviewCollection: 'Library',
          Profile: 'Users',
          PublicProfile: 'Users' }
        if (searchEnabledStates.indexOf(stateName) >= 0) {
          $rootScope.isSearchPage = true
          $rootScope.searchKey = searchKey[stateName]
        } else {
          $rootScope.isSearchPage = false
        }
        if (filterEnabledStates.indexOf(stateName) >= 0) {
          $rootScope.showFilter = true
        } else {
          $rootScope.showFilter = false
        }
        this.clearSearchSettings()
        this.setBreaCrumbs(stateName)
      }
      /**
             * @method setBreadCrumbs
             * @desc Set breadCrumbs
             * @memberOf Services.routeHelperService
             * @param {string}  stateName - State name of route
             * @instance
             */
      this.setBreaCrumbs = function (stateName) {
        switch (stateName) {
        case 'Home':
          $rootScope.breadCrumbsData = null
          break
        case 'Courses':
          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Courses',
            link: 'learn'
          }]

          break
        case 'Resources':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Library',
            link: 'resources'
          }]

          break
        case 'CourseNote':

          var courseParams = sessionService.getSessionData('COURSE_PARAMS')
          $rootScope.breadCrumbsData = [{
            name: 'Courses',
            link: 'learn'
          }, {
            name: courseParams.courseName,
            link: '/course/' + courseParams.courseId + '/' + courseParams.lectureView
          }, {
            name: 'Notes',
            link: ''
          }]

          break
        case 'ContentNote':

          $rootScope.breadCrumbsData = [{
            name: 'Library',
            link: 'resources'
          }, {
            name: $stateParams.contentName,
            link: 'content/' + $stateParams.contentId + '/' + $stateParams.contentName
          }, {
            name: 'Notes',
            link: ''
          }]

          break
        case 'CourseContentNote':

          courseParams = sessionService.getSessionData('COURSE_PARAMS')
          var courseLink = '/course/' + courseParams.courseId + '/' + courseParams.lectureView
          var contentLink = courseLink + '/' + courseParams.contentId + '/' + courseParams.contentIndex
          $rootScope.breadCrumbsData = [{
            name: courseParams.courseName,
            link: courseLink
          }, {
            name: courseParams.contentName,
            link: contentLink
          }, {
            name: 'Notes',
            link: ''
          }]

          break
        case 'Toc':

          courseParams = sessionService.getSessionData('COURSE_PARAMS')
          if (courseParams) {
            $rootScope.breadCrumbsData = [{
              name: 'Home',
              link: 'home'
            }, {
              name: 'Courses',
              link: 'learn'
            }, {
              name: courseParams ? courseParams.courseName : '',
              link: ''
            }]
          }
          break
        case 'announcementOutbox':
          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: ''
          }, {
            name: 'My Announcements',
            link: ''
          }]

          break
        case 'announcementInbox':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Announcements',
            link: ''
          }]

          break
        case 'Profile':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: ''
          }]

          break
        case 'Player':
          if ($stateParams.contentName) {
            $rootScope.breadCrumbsData = [{
              name: 'Home',
              link: 'home'
            }, {
              name: 'Library',
              link: 'resources'
            }, {
              name: $stateParams.contentName,
              link: ''
            }]
          }
          break
        case 'Search':
          if ($rootScope.searchKey === 'Users' ||
                            $rootScope.searchKey === 'Organisations') {
            $rootScope.breadCrumbsData = [{
              name: 'Home',
              link: 'home'
            }, { name: 'Profile',
              link: 'profile'
            }, {
              name: 'Search',
              link: ''
            }]
          } else {
            $rootScope.breadCrumbsData = [{
              name: 'Home',
              link: 'home'
            }, {
              name: 'Search',
              link: ''
            }]
          }

          break
        case 'TocPlayer':
          courseParams = sessionService.getSessionData('COURSE_PARAMS')
          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Courses',
            link: 'learn'
          }, {
            name: courseParams.courseName,
            link: ''
          }]

          break
        case 'WorkSpace':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: 'profile'
          }, {
            name: $rootScope.frmelmnts.scttl.myworkspace,
            link: 'workspace/content/create'
          }]

          break
        case 'EditContent':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: 'profile'
          }, {
            name: $rootScope.frmelmnts.scttl.myworkspace,
            link: 'workspace/content/create'
          }, {
            name: 'Edit Content',
            link: ''
          }]

          break
        case 'PreviewCollection':
          if ($stateParams.name) {
            $rootScope.breadCrumbsData = [{
              name: 'Home',
              link: 'home'
            }, {
              name: 'Library',
              link: 'resources'
            }, {
              name: $stateParams.name,
              link: ''
            }]
          }
          break
        case 'orgDashboard':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: 'profile'
          }, {
            name: 'Organization Admin Dashboard',
            link: ''
          }]

          break
        case 'PublicProfile':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: 'profile'
          }, {
            name: $stateParams.userName,
            link: ''
          }]

          break
        case 'MyActivity':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Profile',
            link: 'profile'
          }, {
            name: 'Course Creator Dashboard',
            link: ''
          }]

          break
        case 'Setup':

          $rootScope.breadCrumbsData = [{
            name: 'Home',
            link: 'home'
          }, {
            name: 'Setup',
            link: 'setup'
          }]

          break
        default:
        {
          $rootScope.breadCrumbsData = null
        }
        }
      }
      /**
             * @method checkStateAccess
             * @desc Check if route state if user can access a particular state or not
             * @memberOf Services.routeHelperService
             * @param {Object}  data - Data
             *  @param {string}  flag - Flag
             *  @param {string}  event - Event
             * @instance
             */
      this.checkStateAccess = function (data, flag, event) {
        if (permissionsService.checkRolesPermissions(data, flag)) {
          toasterService.warning($rootScope.messages.imsg.m0004)
          event.preventDefault()
          $state.go('Home')
        }
      }
      /**
             * @method clearSearchSettings
             * @desc Clear search settings from rootScope
             * @memberOf Services.routeHelperService
             * @instance
             */
      this.clearSearchSettings = function () {
        if ($rootScope.search) {
          $rootScope.search.selectedLanguage = []
          $rootScope.search.selectedContentType = []
          $rootScope.search.selectedSubject = []
          $rootScope.search.selectedLocation = ''
          $rootScope.search.selectedRoles = []
          $rootScope.search.selectedBoard = []
          $rootScope.search.selectedConcepts = []
          $rootScope.search.broadCastConcepts()
          $rootScope.search.filters = {}
          $rootScope.search.sortBy = {}
          $rootScope.search.sortByOption = {}
          $rootScope.search.selectedGrades = []
          $rootScope.search.selectedOrgType = []
          $timeout(function () {
            $('#multi-select-sort').dropdown('clear')
            $('#content-search-filter-accordion').accordion('close', 0)
          }, 0)
        }
      }
      /**
             * @method verifyAnnouncementData
             * @desc Verify announcement data is filled before heading to next step
             * @memberOf Services.routeHelperService
             * @param {string}  stepNumber - step number
             * @param {object}  announcement - announcement
             * @returns {boolean} returns boolean
             * @instance
             */
      this.verifyAnnouncementData = function (stepNumber, announcement) {
        var status = true
        if (announcement === undefined) {
          if (stepNumber === 1) {
            status = true
          } else {
            status = false
          }
        } else {
          if (stepNumber === 2) {
            if (!announcement || !(announcement.title &&
              announcement.type && announcement.from &&
              (announcement.description || announcement.links || announcement.attachments))
            ) {
              status = false
            }
          } else if (stepNumber === 3 || stepNumber === 4) {
            $rootScope.$emit('get:selected:items')
            if (announcement.selTar && announcement.selTar.length === 0) {
              status = false
            }
          }
        }
        return status
      }
    }])
