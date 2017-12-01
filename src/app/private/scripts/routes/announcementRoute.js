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
        onEnter: function ($stateParams, $rootScope, routeHelperService) {
          $rootScope.profileActive = 'active'
          $rootScope.courseActive = ' '
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('announcementOutbox', null)
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
        onEnter: function ($stateParams, $rootScope, routeHelperService) {
          $rootScope.profileActive = 'active'
          $rootScope.courseActive = ' '
          $rootScope.isPlayerPage = true
          routeHelperService.loadRouteConfig('announcementDetails', null)
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
        onEnter: function ($stateParams, $rootScope, routeHelperService) {
          $rootScope.homeActive = 'active'
          $rootScope.isPlayerPage = true
          $rootScope.courseActive = ' '
          routeHelperService.loadRouteConfig('announcementInbox', null)
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
          announcement: undefined,
          isMetaModifiedSteps : false
        },
        onEnter: function ($stateParams, $rootScope, $state, routeHelperService, portalTelemetryService, announcementAdapter) {
            var stepNumber = parseInt($stateParams.stepNumber)
            var announcement = $stateParams.announcement
            if(stepNumber !== 1) {
                var status = announcementAdapter.verifyAnnouncementData(stepNumber, announcement)
                if(status){
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
                        url: '/private/index#!/announcement/create/' + stepNumber
                    })
                } else {
                    $state.go('announcementCreate', {stepNumber: 1, isMetaModifiedSteps: true}, {reload: true})
                }
            } else {
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
                    url: '/private/index#!/announcement/create/' + stepNumber
                })
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
            templateUrl: '/views/announcement/createAnnouncement.html',
            controller: 'resendAnnouncementCtrl as createAnn'
          }
        },
        params: {
          announcement: undefined,
          isMetaModifiedSteps : true
        },
        onEnter: function ($stateParams, $rootScope, $state, routeHelperService, portalTelemetryService, announcementAdapter) {
            var stepNumber = parseInt($stateParams.stepNumber)
            var announcement = $stateParams.announcement
            var announcementId = $stateParams.announcementId
            if(stepNumber !== 1) {
                var status = announcementAdapter.verifyAnnouncementData(stepNumber, announcement)
                if(status){
                    $rootScope.profileActive = 'active'
                    $rootScope.courseActive = ' '
                    $rootScope.isPlayerPage = true
                    routeHelperService.loadRouteConfig('announcementResend', null)
                    portalTelemetryService.fireImpressions({
                        env: 'community.announcements',
                        type: 'form',
                        pageid: 'annoucement_form_details',
                        id: announcementId,
                        name: '',
                        url: '/private/index#!/announcement/resend/' + announcementId + '/' + stepNumber
                    })
                } else {
                    $state.go('announcementResend', {stepNumber: 1, isMetaModifiedSteps: true}, {reload: true})
                }
            } else {
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
                    url: '/private/index#!/announcement/resend/' + announcementId + '/' + stepNumber
                })
            }
        },
        onExit: function ($rootScope) {
          $rootScope.profileActive = ''
        }
      })
  })
