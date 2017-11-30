'use strict'

angular.module('playerApp')
  .config(function ($stateProvider, $urlRouterProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false) // To handle error rejection
    $urlRouterProvider.deferIntercept()
    $urlRouterProvider.otherwise('/home')
    $stateProvider
      .state('announcementOutbox', {
        url: '/announcement/outbox',
        views: {
          mainView: {
            templateUrl: '/views/announcement/announcementOutboxList.html',
            controller: 'announcementOutboxListController as announcementOutboxData'
          }
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, portalTelemetryService) {
          $rootScope.profileActive = 'active'
          $rootScope.courseActive = ' '
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('announcementOutbox', null)
          portalTelemetryService.fireImpressions({
            env: 'community.announcements',
            type: 'list',
            pageid: 'announcement_outbox_list',
            id: '',
            name: '',
            url: '/private/index#!/announcement/outbox/list'
          })
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('announcementDetails', {
        url: '/announcement/:announcementId',
        views: {
          mainView: {
            templateUrl: '/views/announcement/announcementDetails.html',
            controller: 'announcementDetailsController as announcementDetailsData'
          }
        },
        params: {
          announcementName: undefined,
          pageId: undefined
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, portalTelemetryService) {
          $rootScope.profileActive = 'active'
          $rootScope.courseActive = ' '
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('announcementDetails', null)
          portalTelemetryService.fireImpressions({
            env: 'community.announcements',
            type: 'view',
            pageid: $stateParams.pageId,
            id: $stateParams.announcementId,
            name: $stateParams.announcementName,
            url: '/private/index#!/announcement/view/' + $stateParams.announcementId
          })
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
          $('#annDetailsModal').modal('hide')
        }
      })
      .state('announcementInbox', {
        url: '/announcement/inbox',
        views: {
          mainView: {
            templateUrl: '/views/announcement/announcementInboxList.html',
            controller: 'announcementInboxListController as announcementInboxData'
          }
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, portalTelemetryService) {
          $rootScope.homeActive = 'active'
          $rootScope.isPlayerPage = true
          $rootScope.courseActive = ' '
          routeHelperService.loadRouteConfig('announcementInbox', null)
          portalTelemetryService.fireImpressions({
            env: 'community.announcements',
            type: 'list',
            pageid: 'announcement_inbox_list',
            id: '',
            name: '',
            url: '/private/index#!/announcement/inbox/list'
          })
        },
        onExit: function ($rootScope) {
          $rootScope.homeActive = ''
        }
      })
      .state('announcementCreate', {
        url: '/announcement/create/:stepNumber',
        views: {
          mainView: {
            templateUrl: '/views/announcement/createAnnouncement.html',
            controller: 'createAnnouncementCtrl as createAnn'
          }
        },
        params: {
          announcement: undefined
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, portalTelemetryService) {
          $rootScope.profileActive = 'active'
          $rootScope.courseActive = ' '
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('announcementCreate', null)
          portalTelemetryService.fireImpressions({
            env: 'community.announcements',
            type: 'form',
            pageid: 'annoucement_form_details',
            id: '',
            name: '',
            url: '/private/index#!/announcement/create/' + $stateParams.stepNumber
          })
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('announcementResend', {
        url: '/announcement/resend/:announcementId/:stepNumber',
        views: {
          mainView: {
            templateUrl: '/views/announcement/createAnnouncement.html',
            controller: 'resendAnnouncementCtrl as createAnn'
          }
        },
        params: {
          announcement: undefined
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, portalTelemetryService) {
          $rootScope.profileActive = 'active'
          $rootScope.courseActive = ' '
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('announcementResend', null)
          portalTelemetryService.fireImpressions({
            env: 'community.announcements',
            type: 'form',
            pageid: 'annoucement_form_details',
            id: $stateParams.announcementId,
            name: '',
            url: '/private/index#!/announcement/resend/' + $stateParams.announcementId + '/' + $stateParams.stepNumber
          })
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
  })
