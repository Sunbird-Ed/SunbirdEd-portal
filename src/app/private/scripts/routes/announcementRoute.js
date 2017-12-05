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
          announcementName: null,
          pageId: null
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, portalTelemetryService) {
          $rootScope.profileActive = 'active'
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
            templateUrl: '/views/announcement/composeAnnouncement.html',
            controller: 'createAnnouncementCtrl as composeAnn'
          }
        },
        params: {
          announcement: null,
          isMetaModifiedSteps: false,
          userIdHashTag: null,
          telemetryPageId: 'annoucement_form_details',
          telemetryPageType: 'form'
        },
        onEnter: function ($stateParams, $rootScope, $state, routeHelperService, portalTelemetryService, userService) {
          var stepNumber = parseInt($stateParams.stepNumber)
          var announcement = $stateParams.announcement
          var userIdHashTag = ''
          $rootScope.profileActive = 'active'
          if ($stateParams.userIdHashTag === null) {
            userIdHashTag = userService.getUserHash($rootScope.userId)
          } else {
            userIdHashTag = $stateParams.userIdHashTag
          }
          if (stepNumber !== 1) {
            var status = routeHelperService.verifyAnnouncementData(stepNumber, announcement)
            if (status) {
              routeHelperService.loadRouteConfig('announcementCreate', null)
              portalTelemetryService.fireAnnouncementImpressions({
                env: 'community.announcements',
                type: $stateParams.telemetryPageType,
                pageid: $stateParams.telemetryPageId,
                id: '',
                name: '',
                url: '/private/index#!/announcement/create/' + stepNumber
              }, userIdHashTag)
            } else {
              $('#createAnnouncementModal').modal('hide')
              $state.go('announcementOutbox')
            }
          } else {
            routeHelperService.loadRouteConfig('announcementCreate', null)
            portalTelemetryService.fireAnnouncementImpressions({
              env: 'community.announcements',
              type: 'form',
              pageid: 'annoucement_form_details',
              id: '',
              name: '',
              url: '/private/index#!/announcement/create/' + stepNumber
            }, userIdHashTag)
          }
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('announcementResend', {
        url: '/announcement/resend/:announcementId/:stepNumber',
        views: {
          mainView: {
            templateUrl: '/views/announcement/composeAnnouncement.html',
            controller: 'resendAnnouncementCtrl as composeAnn'
          }
        },
        params: {
          announcement: null,
          isMetaModifiedSteps: false,
          userIdHashTag: null,
          telemetryPageId: 'annoucement_form_details',
          telemetryPageType: 'form',
          telemetryAnnTitle: null
        },
        onEnter: function ($stateParams, $rootScope, $state, routeHelperService, portalTelemetryService, userService) {
          var stepNumber = parseInt($stateParams.stepNumber)
          var announcement = $stateParams.announcement
          var announcementId = $stateParams.announcementId
          var userIdHashTag = ''
          $rootScope.profileActive = 'active'
          if ($stateParams.userIdHashTag === null) {
            userIdHashTag = userService.getUserHash($rootScope.userId)
          } else {
            userIdHashTag = $stateParams.userIdHashTag
          }
          if (stepNumber !== 1) {
            var status = routeHelperService.verifyAnnouncementData(stepNumber, announcement)
            if (status) {
              routeHelperService.loadRouteConfig('announcementResend', null)
              portalTelemetryService.fireAnnouncementImpressions({
                env: 'community.announcements',
                type: $stateParams.telemetryPageType,
                pageid: $stateParams.telemetryPageId,
                id: announcementId,
                name: $stateParams.telemetryAnnTitle,
                url: '/private/index#!/announcement/resend/' + announcementId + '/' + stepNumber
              }, userIdHashTag)
            } else {
              $state.go('announcementOutbox')
            }
          } else {
            routeHelperService.loadRouteConfig('announcementResend', null)
            portalTelemetryService.fireAnnouncementImpressions({
              env: 'community.announcements',
              type: 'form',
              pageid: 'annoucement_form_details',
              id: $stateParams.announcementId,
              name: $stateParams.telemetryAnnTitle || '',
              url: '/private/index#!/announcement/resend/' + announcementId + '/' + stepNumber
            }, userIdHashTag)
          }
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
  })
