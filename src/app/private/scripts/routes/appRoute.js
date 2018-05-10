'use strict'
angular.module('playerApp')
  .config(function ($stateProvider, $urlRouterProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false) // To handle error rejection
    $urlRouterProvider.deferIntercept()
    $urlRouterProvider.otherwise('/home')
    $stateProvider
      .state('LandingPage', {
        url: '/',
        views: {
          mainView: {
            templateUrl: '/views/home/landingPage.html'
          }
        }
      })
      .state('Home', {
        url: '/home',
        views: {
          mainView: {
            templateUrl: '/views/home/home.html',
            controller: 'HomeController as homeCtrl'
          }
        },
        onEnter: function ($rootScope, routeHelperService) {
          $rootScope.homeActive = 'active'
          routeHelperService.loadRouteConfig('Home', null)
        },
        onExit: function ($rootScope, telemetryService) {
          telemetryService.impressionTelemetryData('home', '', 'home',
            '1.0', 'pageexit', 'home', '/home', '', telemetryService.getVisitData())
          $rootScope.homeActive = ''
        }
      })
      .state('UserContent', {
        url: '/content',
        views: {
          mainView: {
            templateUrl: '/views/content/usercontent.html',
            controller: 'userContentCtrl as userContent'
          }
        },
        onEnter: function () {
        }
      })
      .state('Courses', {
        url: '/learn',
        views: {
          mainView: {
            templateUrl: '/views/learn/learn.html',
            controller: 'LearnCtrl as learn'
          }
        },
        onEnter: function ($rootScope, telemetryService, routeHelperService) {
          $rootScope.isLearnPage = true
          $rootScope.courseActive = 'active'
          routeHelperService.loadRouteConfig('Courses')
          telemetryService.setConfigData('env', 'course')
        },
        onExit: function ($rootScope, telemetryService) {
          telemetryService.impressionTelemetryData('course', '', 'course',
            $rootScope.version, 'pageexit', 'course-read', '/learn', '', telemetryService.getVisitData())
          $rootScope.courseActive = ''
          $rootScope.isLearnPage = false
        },
        params: {
          searchKey: 'Courses'
        }
      })
      .state('Resources', {
        url: '/resources',
        views: {
          mainView: {
            templateUrl: '/views/resource/resource.html'
          }
        },
        onEnter: function ($rootScope, telemetryService, routeHelperService) {
          $rootScope.isResourcesPage = true
          $rootScope.resourcesActive = 'active'
          routeHelperService.loadRouteConfig('Resources')
          telemetryService.setConfigData('env', 'library')
        },
        onExit: function ($rootScope, telemetryService) {
          telemetryService.impressionTelemetryData('library', '', 'library',
            $rootScope.version, 'pageexit', 'library-read', '/resources', '', telemetryService.getVisitData())
          $rootScope.isResourcesPage = false
          $rootScope.resourcesActive = ''
        },
        params: {
          searchKey: 'Resources'
        }
      })
      .state('CourseNote', {
        url: '/course/note/:courseId',
        views: {
          mainView: {
            templateUrl: 'views/note/noteList.html',
            controller: 'NoteListCtrl as noteList'
          }
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          $rootScope.isNotePage = true
          $rootScope.courseActive = 'active'
          routeHelperService.loadRouteConfig('CourseNote', $stateParams)
          telemetryService.setConfigData('env', 'course')
          telemetryService.impressionTelemetryData('course', $stateParams.courseId, 'course', '1.0', 'Paginate',
            'note-list', '/course/note/' + $stateParams.courseId, '', telemetryService.getVisitData())
        },
        onExit: function ($rootScope) {
          $rootScope.isNotePage = false
          $rootScope.courseActive = ''
        }
      })
      .state('ContentNote', {
        url: '/resource/note/:contentId/:contentName',
        views: {
          mainView: {
            templateUrl: 'views/note/noteList.html',
            controller: 'NoteListCtrl as noteList'
          }
        },
        onEnter: function ($rootScope, $stateParams, routeHelperService, telemetryService) {
          $rootScope.isNotePage = true
          $rootScope.resourcesActive = 'active'
          routeHelperService.loadRouteConfig('ContentNote', $stateParams)
          telemetryService.setConfigData('env', 'library')
          telemetryService.impressionTelemetryData('library', $stateParams.contentId, 'resource', '1.0', 'Paginate',
            'note-list', '/course/resource/' + $stateParams.contentId, '', telemetryService.getVisitData())
        },
        onExit: function ($rootScope) {
          $rootScope.isNotePage = false
          $rootScope.resourcesActive = ''
        }
      })
      .state('CourseContentNote', {
        url: '/note/:courseId/:contentId',
        views: {
          mainView: {
            templateUrl: 'views/note/noteList.html',
            controller: 'NoteListCtrl as noteList'
          }
        },
        onEnter: function ($rootScope, $stateParams, routeHelperService, telemetryService) {
          routeHelperService.loadRouteConfig('CourseContentNote', $stateParams)
          $rootScope.isNotePage = true
          $rootScope.courseActive = 'active'
          telemetryService.setConfigData('env', 'course')
          telemetryService.impressionTelemetryData('course', $stateParams.courseId, 'course', '',
            'Paginate', 'note-list', '/note/resource/' + $stateParams.courseId + $stateParams.contentId,
            [$stateParams.courseId, $stateParams.contentId], telemetryService.getVisitData())
        },
        onExit: function ($rootScope) {
          $rootScope.isNotePage = false
          $rootScope.courseActive = ''
        }
      })
      .state('Toc', {
        url: '/course/:courseId/:lectureView',
        views: {
          mainView: {
            templateUrl: 'views/course/toc.html',
            controller: 'courseScheduleCtrl as toc'
          }
        },
        onEnter: function ($rootScope, telemetryService, $stateParams, routeHelperService) {
          $rootScope.isTocPage = true
          $rootScope.courseActive = 'active'
          routeHelperService.loadRouteConfig('Toc', $stateParams)
          telemetryService.setConfigData('env', 'course')
          var url = '/course/' + $stateParams.courseId
          var contextData = {
            env: 'course',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var objectData = {
            id: $stateParams.courseId,
            type: 'course',
            ver: '',
            rollup: telemetryService.getRollUpData('')
          }
          var data = {
            edata: telemetryService.impressionEventData('view', '', 'course-read', url),
            context: telemetryService.getContextData(contextData),
            object: telemetryService.getObjectData(objectData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        },
        onExit: function ($rootScope, dataService, telemetryService, $stateParams) {
          $rootScope.isTocPage = false
          $rootScope.courseActive = ''
          dataService.setData('contentStateInit', false)
          dataService.setData('isTrackingEnabled', false)
          if (dataService.getData('isTelemtryStarted') === true) {
            dataService.setData('isTelemtryStarted', false)
            telemetryService.endTelemetryData('course', $stateParams.courseId, 'course', '1.0', 'player',
              'course-read', 'play')
          }
        }
      })
      .state('Community', {
        url: '/community',
        views: {
          mainView: {
            templateUrl: 'views/community/communityList.html',
            controller: 'CommunityController as commCtrl'
          }
        },
        onEnter: function (telemetryService, routeHelperService, $rootScope) {
          routeHelperService.loadRouteConfig('Community')
        }
      })
      .state('Profile', {
        url: '/profile',
        views: {
          mainView: {
            templateUrl: 'views/profile/profile.html',
            controller: 'ProfileController as profileCtrl'
          }
        },
        onEnter: function ($rootScope, telemetryService, routeHelperService) {
          $rootScope.profileActive = 'active'
          routeHelperService.loadRouteConfig('Profile')
          telemetryService.setConfigData('env', 'profile')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('Player', {
        url: '/content/:contentId/:contentName',
        views: {
          mainView: {
            templateUrl: 'views/common/player.html',
            controller: 'playerCtrl as player'
          }
        },
        params: {
          content: null,
          contentId: null,
          contentName: null
        },
        onEnter: function ($rootScope, $stateParams, routeHelperService, telemetryService) {
          $rootScope.isPlayerPage = true
          $rootScope.resourcesActive = 'active'
          routeHelperService.loadRouteConfig('Player', $stateParams)
          telemetryService.impressionTelemetryData('content', $stateParams.courseId, 'content', '',
            'Paginate', 'content-read', '/content/' + $stateParams.contentId, '', telemetryService.getVisitData())
        },
        onExit: function ($rootScope, telemetryService) {
          $rootScope.isPlayerPage = false
          $rootScope.resourcesActive = ''
        }
      })
      .state('Search', {
        url: '/search/:type/:query/:filters/:sort/:autoSuggestSearch',
        views: {
          mainView: {
            templateUrl: 'views/search/search.html',
            controller: 'SearchCtrl as search'
          }
        },
        params: {
          type: null,
          query: null,
          filters: null,
          sort: null,
          autoSuggestSearch: null
        },
        onEnter: function ($rootScope, telemetryService, $stateParams, routeHelperService) {
          $rootScope.isSearchResultsPage = true
          routeHelperService.loadRouteConfig('Search', $stateParams)
          if ($stateParams.type === 'Courses') {
            $rootScope.courseActive = 'active'
            telemetryService.setConfigData('env', 'course')
          } else if ($stateParams.type === 'Library') {
            $rootScope.resourcesActive = 'active'
            telemetryService.setConfigData('env', 'library')
          } else if ($stateParams.type === 'Users') {
            $rootScope.profileActive = 'active'
            telemetryService.setConfigData('env', 'profile')
          } else if ($stateParams.type === 'Organisations') {
            $rootScope.profileActive = 'active'
            telemetryService.setConfigData('env', 'profile')
          } else {
            $rootScope.homeActive = 'active'
            telemetryService.setConfigData('env', 'home')
          }
        },
        onExit: function ($rootScope, telemetryService, $stateParams) {
          var pageId = $stateParams.type.toLowerCase() + '-search'
          var uri = '/search/' + $stateParams.type
          var env = 'home'
          switch ($stateParams.type) {
          case 'Courses':
            env = 'course'
            break
          case 'Library':
            env = 'library'
            break
          case 'Users':
            env = 'profile'
            break
          case 'Organisations':
            env = 'profile'
            break
          }
          telemetryService.impressionTelemetryData(env, '', 'search',
            '1.0', 'pageexit', pageId, uri, '', telemetryService.getVisitData())
          $rootScope.courseActive = $rootScope.resourcesActive = ''
          $rootScope.isSearchResultsPage = false
          $rootScope.homeActive = ''
          $rootScope.profileActive = ''
        }
      })
      .state('TocPlayer', {
        url: '/course/:courseId/:lectureView/:contentId/:contentIndex',
        views: {
          mainView: {
            templateUrl: 'views/course/toc.html',
            controller: 'courseScheduleCtrl as toc'
          }
        },

        onEnter: function ($rootScope, $stateParams, routeHelperService, telemetryService) {
          routeHelperService.loadRouteConfig('TocPlayer', $stateParams)
          telemetryService.setConfigData('env', 'course')
          $rootScope.isTocPage = true
          $rootScope.courseActive = 'active'
          var url = '/course/' + $stateParams.courseId
          var contextData = {
            env: 'course',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', 'scroll', 'course-read', url),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        },
        onExit: function ($rootScope, dataService, telemetryService) {
          $rootScope.isTocPage = false
          $rootScope.courseActive = ''
          var contextData = {
            env: 'course',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }

          var objectData = {
            id: $rootScope.courseId,
            type: 'course',
            ver: '1.0'
          }
          var data = {
            edata: telemetryService.endEventData('course', 'course-read', 'play'),
            context: telemetryService.getContextData(contextData),
            object: telemetryService.getObjectData(objectData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.end(data)
          dataService.setData('isTrackingEnabled', false)
        }
      })
      .state('WorkSpace', {
        url: '/workspace',
        views: {
          mainView: {
            templateUrl: '/views/workSpace/workSpace.html',
            controller: function ($state, $rootScope) {
              $rootScope.profileActive = 'active'
              var navigated = 0
              $rootScope.$on('permissionOnlyViewUpdated', function (e, data) {
                if (data.action && data.action === 'notRemoved' &&
                  $state.current.name === 'WorkSpace' &&
                  navigated === 0) {
                  navigated = 1
                  $state.go(data.attrs.uiSref)
                }
              })
            }
          }
        },
        onEnter: function ($rootScope, telemetryService, routeHelperService) {
          $rootScope.profileActive = 'active'
          routeHelperService.loadRouteConfig('WorkSpace')
          telemetryService.setConfigData('env', 'workspace')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('WorkSpace.ContentCreation', {
        url: '/content/create',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/createContent.html'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
          var uri = '/workspace/content/create'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', '', 'workspace-content-create', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('WorkSpace.DraftContent', {
        url: '/content/draft',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/draftContent.html',
            controller: 'DraftContentController as draftContent'
          }
        },
        onEnter: function ($rootScope, telemetryService) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/content/draft'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll', 'workspace-content-draft',
              uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('WorkSpace.ReviewContent', {
        url: '/content/review',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/reviewContent.html',
            controller: 'ReviewContentController as reviewContent'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/content/review'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll',
              'workspace-content-inreview', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('WorkSpace.PublishedContent', {
        url: '/content/published',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/publishedContent.html',
            controller: 'PublishedContentController as publishedContent'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/content/published'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll',
              'workspace-content-published', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('WorkSpace.AllUploadedContent', {
        url: '/content/uploaded',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/allUploadedContent.html',
            controller: 'AllUploadedContentController as allUploadedContent'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/content/uploaded'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll',
              'workspace-content-uploaded', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('WorkSpace.UpForReviewContent', {
        url: '/content/upForReview',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/upForReviewContent.html',
            controller: 'UpForReviewContentController as upForReviewContent'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/content/upForReview'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll',
              'workspace-content-upforreview', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('WorkSpace.FlaggedContent', {
        url: '/content/flagged',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/flaggedContent.html',
            controller: 'FlaggedContentController as flaggedContent'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/content/flagged'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll',
              'workspace-content-flagged', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      })
      .state('CreateLesson', {
        url: '/create/lesson',
        views: {
          mainView: {
            templateUrl: '/views/workSpace/createLesson.html',
            controller: 'ContentLessonController as contentLesson'
          }
        },
        onEnter: function ($rootScope, telemetryService) {
          var uri = '/create/lesson'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', 'scroll', 'workspace-create-lesson', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('ContentEditor', {
        url: '/content/editor/:contentId/:state/:framework',
        views: {
          mainView: {
            templateUrl: 'views/common/contentEditor.html',
            controller: 'ContentEditorController as contentEditor'
          }
        },
        params: {
          contentId: null,
          state: null,
          framework: null
        },
        onEnter: function ($state, $rootScope, $stateParams, telemetryService) {
          telemetryService.setConfigData('env', 'workspace')
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('CreateTextbook', {
        url: '/create/textbook',
        views: {
          mainView: {
            templateUrl: '/views/workSpace/createTextBook.html',
            controller: 'TextBookController as textbook'
          }
        },
        onEnter: function ($rootScope, telemetryService) {
          var uri = '/create/textbook'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', 'scroll', 'workspace-create-textbook', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('CreateCollection', {
        url: '/create/collection',
        views: {
          mainView: {
            templateUrl: '/views/workSpace/createCollection.html',
            controller: 'CollectionController as collection'
          }
        },
        onEnter: function ($rootScope, telemetryService) {
          var uri = '/create/collection'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', 'scroll', 'workspace-create-collection', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('CreateCourse', {
        url: '/create/course',
        views: {
          mainView: {
            templateUrl: '/views/workSpace/createCourse.html',
            controller: 'CourseController as course'
          }
        },
        onEnter: function ($rootScope, telemetryService) {
          var uri = '/create/course'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', 'scroll', 'worksapce-create-course', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('CollectionEditor', {
        url: '/collection/editor/:contentId/:type/:state/:framework',
        views: {
          mainView: {
            templateUrl: 'views/common/collectionEditor.html',
            controller: 'CollectionEditorController as collectionEditor'
          }
        },
        params: {
          contentId: null,
          type: null,
          state: null,
          framework: null
        },
        onEnter: function ($rootScope, telemetryService) {
          telemetryService.setConfigData('env', 'workspace')
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('PreviewContent', {
        url: '/preview/content/:contentId/:backState',
        views: {
          mainView: {
            templateUrl: 'views/workSpace/previewContent.html',
            controller: 'PreviewContentController as previewContent'
          }
        },
        params: {
          contentId: null,
          backState: null
        },
        onEnter: function ($state, $rootScope, $stateParams, telemetryService) {
          telemetryService.setConfigData('env', 'workspace')
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
          $('body .modals').remove()
        }
      })
      .state('PreviewCollection', {
        url: '/preview/collection/:Id/:name/:backState',
        views: {
          mainView: {
            templateUrl: 'views/collectionplayer/collectionPlayer.html',
            controller: 'CollectionPlayerCtrl as cpvm'
          }
        },
        params: {
          Id: null,
          name: null,
          backState: null
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          if ($stateParams.backState === 'Profile') {
            $rootScope.profileActive = 'active'
            telemetryService.setConfigData('env', 'profile')
          } else {
            telemetryService.setConfigData('env', 'library')
            $rootScope.resourcesActive = 'active'
          }
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('PreviewCollection', $stateParams)
        },
        onExit: function ($rootScope) {
          $rootScope.resourcesActive = ''
          $rootScope.profileActive = ''
        }
      })
      .state('orgDashboard', {
        url: '/org-dashboard',
        views: {
          mainView: {
            templateUrl: '/views/dashboard/orgDashboard.html',
            controller: 'orgDashboardController as dashboardData'
          }
        },
        params: {
          orgId: null
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          $rootScope.profileActive = 'active'
          $rootScope.isPlayerPage = true
          telemetryService.setConfigData('env', 'dashboard')
          routeHelperService.loadRouteConfig('orgDashboard', null)
          telemetryService.impressionTelemetryData('dashboard', '', 'org-dashboard',
            '', 'Paginate', 'org-dashboard', '/org-dashboard', '', '')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('WorkSpace.ContentBatch', {
        url: '/content/batches',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/viewBatch.html'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
          var uri = '/workspace/content/batches'
          var contextData = {
            env: 'workspace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', '', 'workspace-content-batch', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      }).state('WorkSpace.BatchList', {
        url: '/batches',
        views: {
          contentView: {
            templateUrl: 'views/batch/batchList.html',
            controller: 'BatchListController as batch'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
        },
        onExit: function ($rootScope, telemetryService) {
          var uri = '/workspace/batches'
          var contextData = {
            env: 'workspace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', '',
              'workspace-course-batch', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        }
      }).state('CreateBatch', {
        url: '/create/batch/:courseId',
        views: {
          mainView: {
            templateUrl: '/views/batch/createBatch.html',
            controller: 'BatchController as batch'
          }
        },
        params: {
          coursecreatedby: null
        },
        onEnter: function ($rootScope, telemetryService, $stateParams) {
          $rootScope.profileActive = 'active'
          telemetryService.impressionTelemetryData('course', $stateParams.courseId, 'course',
            '1.0', 'scroll', 'batch-create', '/create/batch', '')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      }).state('updateBatch', {
        url: '/update/batch/:batchId',
        views: {
          mainView: {
            templateUrl: '/views/batch/updateBatch.html',
            controller: 'BatchUpdateController as batchUpdate'
          }
        },
        params: {
          coursecreatedby: null
        },
        onEnter: function ($rootScope, telemetryService, $stateParams) {
          $rootScope.profileActive = 'active'
          telemetryService.impressionTelemetryData('course', $stateParams.batchId, 'batch',
            '1.0', 'scroll', 'batch-edit', '/update/batch', '')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('CreateLessonPlan', {
        url: '/create/lessonPlan',
        views: {
          mainView: {
            templateUrl: '/views/workSpace/createLessonPlan.html',
            controller: 'LessonPlanController as lessonPlan'
          }
        },
        onEnter: function ($rootScope, telemetryService) {
          var uri = '/create/lessonPlan'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('view', 'scroll', 'workspace-create-lessonplan', uri),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('GenericEditor', {
        url: '/generic/editor/:contentId/:state/:framework',
        views: {
          mainView: {
            templateUrl: 'views/common/genericEditor.html',
            controller: 'GenericEditorController as genericEditor'
          }
        },
        params: {
          contentId: null,
          state: null,
          framework: null
        },
        onEnter: function ($rootScope, telemetryService) {
          telemetryService.setConfigData('env', 'workspace')
          $rootScope.profileActive = 'active'
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('PublicProfile', {
        url: '/profile/:userName/:userId',
        views: {
          mainView: {
            templateUrl: '/views/search/userProfile.html',
            controller: 'PublicProfileController as publicProfile'
          }
        },
        params: {
          userId: null,
          userName: null
        },
        onEnter: function ($rootScope, routeHelperService, $stateParams, telemetryService) {
          telemetryService.setConfigData('env', 'profile')
          $rootScope.profileActive = 'active'
          routeHelperService.loadRouteConfig('PublicProfile', $stateParams)
          telemetryService.impressionTelemetryData('profile', $stateParams.userId, 'public-profile',
            '1.0', 'Paginate', 'public-profile', '/profile/' + $stateParams.userName +
            '/' + $stateParams.userId, '', '')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('MyActivity', {
        url: '/course-creator-dashboard',
        views: {
          mainView: {
            templateUrl: '/views/dashboard/course/courseConsumptionDashboard.html',
            controller: 'courseConsumptionDashboardCtrl as courseDashboard'
          }
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          telemetryService.setConfigData('env', 'activity')
          $rootScope.profileActive = 'active'
          $rootScope.isPlayerPage = false
          $rootScope.myActivityMenuActive = 'active selected'
          routeHelperService.loadRouteConfig('MyActivity', null)
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
          $rootScope.myActivityMenuActive = ''
        }
      })
      .state('Setup', {
        url: '/setup',
        views: {
          mainView: {
            templateUrl: '/views/setup/setup.html',
            controller: 'setupController as setup'
          }
        },
        onEnter: function (routeHelperService, telemetryService) {
          telemetryService.setConfigData('env', 'org-management')
          routeHelperService.loadRouteConfig('Setup', null)
          telemetryService.impressionTelemetryData('org-management', '', 'org-management',
            '', 'Paginate', 'setup', '/setup', '', '')
        }

      })
      .state('WorkSpace.LimitedPublishedContent', {
        url: '/content/limited/publish',
        views: {
          contentView: {
            templateUrl: 'views/workSpace/limitedPublishedContent.html',
            controller: 'LimitedPublishedContentController as limitedPublishedContent'
          }
        },
        onEnter: function (telemetryService, $rootScope) {
          var uri = '/workspace/content/limited/publish'
          var contextData = {
            env: 'workSpace',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata: telemetryService.impressionEventData('list', 'scroll',
              'workspace-content-limitedpublish', uri, telemetryService.getVisitData()),
            context: telemetryService.getContextData(contextData),
            tags: _.concat([], org.sunbird.portal.channel)
          }
          telemetryService.impression(data)
        },
        onExit: function ($rootScope, telemetryService) {

        }
      })
  })
  .run(function ($urlRouter, $http, $state, permissionsService, $rootScope, $location, config,
    toasterService, routeHelperService, userService) {
    permissionsService.getPermissionsData('/permissions').then(function (res) {
      var permissions = res.data; //eslint-disable-line
      if (res && res.responseCode === 'OK') {
        permissionsService.setRolesAndPermissions(res.result)
      } else {
        // TODO: allow only public permissions
      }
    }).then(function () {
      var userProfile = userService.getCurrentUserProfile()
      if (_.isEmpty(userProfile)) {
        userService.getUserProfile($rootScope.userId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            var profileData = res.result.response
            var userRoles = profileData.roles
            _.forEach(profileData.organisations, function (org) {
              if (org.roles && _.isArray(org.roles)) {
                userRoles = _.union(userRoles, org.roles)
              }
            })
            org.sunbird.portal.channel = _.get(profileData, 'rootOrg.hashTagId')
            userService.setCurrentUserProfile(profileData)
            permissionsService.setCurrentUserRoles(userRoles)
            $rootScope.initializePermissionDirective = true
          } else {
            // TODO: allow only public permissions
          }
        }).then(function () {
          $urlRouter.sync()
          $urlRouter.listen()
        })
      } else {
        $urlRouter.sync()
        $urlRouter.listen()
      }
    })

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState,
      fromParams) {
      if (!_.isEmpty(fromState.name)) {
        window.localStorage.setItem('previousURl', JSON.stringify({ name: fromState.name, params: fromParams }))
      }
      switch (toState.name) {
      case 'WorkSpace':
        routeHelperService.checkStateAccess(config.WORKSPACE_ACCESS_ROLES, false, event)
        break
      case 'WorkSpace.ContentCreation':
        routeHelperService.checkStateAccess(config.WORKSPACE_ACCESS_ROLES, false, event)
        break
      case 'CreateLesson':
        routeHelperService.checkStateAccess(config.COMMON_ROLES_CHECK, false, event)
        break
      case 'ContentEditor':
        routeHelperService.checkStateAccess(config.COMMON_ROLES_CHECK, false, event)
        break
      case 'CreateTextbook':
        routeHelperService.checkStateAccess(config.WORKSPACE.CREATE.BOOK.ROLES, false, event)
        break
      case 'CreateCollection':
        routeHelperService.checkStateAccess(config.COMMON_ROLES_CHECK, false, event)
        break
      case 'CreateCourse':
        routeHelperService.checkStateAccess(config.COMMON_ROLES_CHECK, false, event)
        break
      case 'CollectionEditor':
        routeHelperService.checkStateAccess(config.WORKSPACE_ACCESS_ROLES, false, event)
        break
      case 'PreviewContent':
        routeHelperService.checkStateAccess(config.WORKSPACE_ACCESS_ROLES, false, event)
        break
      case 'WorkSpace.UpForReviewContent':
        routeHelperService.checkStateAccess(config.WORKSPACE.UP_FOR_REVIEW.ROLES, false, event)
        break
      case 'WorkSpace.FlaggedContent':
        routeHelperService.checkStateAccess(['FLAG_REVIEWER'], false, event)
        break
      case 'orgDashboard':
        routeHelperService.checkStateAccess(['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'], false, event)
        break
      case 'announcementOutbox':
        routeHelperService.checkStateAccess(['ANNOUNCEMENT_SENDER'], false, event)
        break
      case 'WorkSpace.DraftContent':
        routeHelperService.checkStateAccess(config.WORKSPACE.DRAFT.ROLES, false, event)
        break
      case 'WorkSpace.ReviewContent':
        routeHelperService.checkStateAccess(config.WORKSPACE.REVIEW.ROLES, false, event)
        break
      case 'WorkSpace.PublishedContent':
        routeHelperService.checkStateAccess(config.WORKSPACE.PUBLISHED.ROLES, false, event)
        break
      case 'WorkSpace.AllUploadedContent':
        routeHelperService.checkStateAccess(config.WORKSPACE.ALL_UPLOADS.ROLES, false, event)
        break
      case 'WorkSpace.BatchList':
        routeHelperService.checkStateAccess(['COURSE_MENTOR'], false, event)
        break
      case 'MyActivity':
        routeHelperService.checkStateAccess(['CONTENT_CREATOR'], false, event)
        break
      default:
        break
      }
    })
  })
