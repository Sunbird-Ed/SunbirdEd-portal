'use strict'
angular.module('playerApp')
  .config(function ($stateProvider, $urlRouterProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false) // To handle error rejection
    $urlRouterProvider.deferIntercept()
    $urlRouterProvider.otherwise('/home')
    $stateProvider
      .state('announcementOutbox', {
        url: '/announcement/outbox/list/:page',
        views: {
          mainView: {
            templateUrl: '/views/announcement/announcementOutboxList.html',
            controller: 'announcementOutboxListController as announcementOutboxData'
          }
        },
        params: {
          page: '1'
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          $rootScope.profileActive = 'active'
          routeHelperService.loadRouteConfig('announcementOutbox', null)
          telemetryService.impressionTelemetryData('announcement', '', '',
            '', 'Paginate', 'announcement-outbox', '/announcement/outbox/list', '', '')
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
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          $rootScope.profileActive = 'active'
          routeHelperService.loadRouteConfig('announcementDetails', null)
          telemetryService.impressionTelemetryData('announcement', $stateParams.announcementId, 'announcement-details',
            '1.0', 'Paginate', 'announcement-details', '/announcement/' + $stateParams.announcementId, '', '')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
      .state('announcementInbox', {
        url: '/announcement/inbox/list/:page',
        views: {
          mainView: {
            templateUrl: '/views/announcement/announcementInboxList.html',
            controller: 'announcementInboxListController as announcementInboxData'
          }
        },
        params: {
          page: '1'
        },
        onEnter: function ($stateParams, $rootScope, routeHelperService, telemetryService) {
          $rootScope.homeActive = 'active'
          routeHelperService.loadRouteConfig('announcementInbox', null)
          telemetryService.impressionTelemetryData('announcement', '', '',
            '', 'Paginate', 'announcement-inbox', '/announcement/inbox/list', '', '')
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
            controller: 'composeAnnouncementCtrl as composeAnn'
          }
        },
        params: {
          announcement: null,
          isMetaModifiedSteps: false,
          isResend: false,
          telemetryPageId: 'annoucement_form_details',
          telemetryPageType: 'form'
        },
        onEnter: function ($stateParams, $rootScope, $state, routeHelperService, userService, telemetryService) {
          var stepNumber = parseInt($stateParams.stepNumber)
          var announcement = $stateParams.announcement
          $rootScope.userIdHashTag = $rootScope.userIdHashTag || userService.getUserHash($rootScope.userId)
          $rootScope.profileActive = 'active'
          if (stepNumber !== 1) {
            var status = routeHelperService.verifyAnnouncementData(stepNumber, announcement)
            if (status) {
              routeHelperService.loadRouteConfig('announcementCreate', null)
            } else {
              $('#createAnnouncementModal').modal('hide')
              $state.go('announcementOutbox')
            }
          } else {
            routeHelperService.loadRouteConfig('announcementCreate', null)
          }
          telemetryService.impressionTelemetryData('announcement', '', '',
            '', 'Paginate', 'announcement-create', '/announcement/create/' + $stateParams.stepNumber, '', '')
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
            controller: 'composeAnnouncementCtrl as composeAnn'
          }
        },
        params: {
          announcement: null,
          isMetaModifiedSteps: false,
          isResend: true,
          telemetryPageId: 'annoucement_form_details',
          telemetryPageType: 'form',
          telemetryAnnTitle: null
        },
        onEnter: function ($stateParams, $rootScope, $state, routeHelperService, userService, telemetryService) {
          var stepNumber = parseInt($stateParams.stepNumber)
          var announcement = $stateParams.announcement
          $rootScope.userIdHashTag = $rootScope.userIdHashTag || userService.getUserHash($rootScope.userId)
          $rootScope.profileActive = 'active'
          if (stepNumber !== 1) {
            var status = routeHelperService.verifyAnnouncementData(stepNumber, announcement)
            if (status) {
              routeHelperService.loadRouteConfig('announcementResend', null)
            } else {
              $state.go('announcementOutbox')
            }
          } else {
            routeHelperService.loadRouteConfig('announcementResend', null)
          }
          telemetryService.impressionTelemetryData('announcement', $stateParams.announcementId, 'announcement',
            '', 'Paginate', 'announcement-resend', '/announcement/resend/' + $stateParams.announcementId + '/' +
            $stateParams.stepNumber, '', '')
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
  })
