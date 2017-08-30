'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular.module('loginApp')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
      .state('Landing', {
          url: '/',
          views: {
              mainView: {
                  templateUrl: '/views/home/landingPage.html'
              }
          },
          onEnter: function ($window) {
              delete $window.localStorage.redirectUrl;
          }
      })
      .state('PublicContent', {
          url: '/content/:id',
          views: {
              mainView: {
                  templateUrl: '/views/content/content.html',
                  controller: function ($scope, $stateParams) {
                      $scope.contentId = $stateParams.id;
                  }
              },
              params: {
                  type: 'content'
              }
          }
      })
      .state('PublicCourse', {
          url: '/course/:courseId',
          views: {
              mainView: {
                  templateUrl: '/views/course/toc.html'
              }
          },
          params: {
              courseId: null,
              lectureView: 'yes'
          }
      })
      .state('PublicCollection', {
          url: '/preview/collection/:contentId/:name',
          views: {
              mainView: {
                  templateUrl: 'views/collectionplayer/collectionPlayer.html',
                  controller: 'CollectionPlayerCtrl as cpvm'
              }
          },
          params: {
              contentId: null,
              name: null
          }
      });
  }])
  .run(['$http', '$rootScope', function ($http, $rootScope) {
      $http.get('/v1/tenant/info').then(function (res) {
          if (res && res.statusText === 'OK') {
              $rootScope.orgLogo = res.data.result.logo;
              $rootScope.faviconIcon = res.data.result.favicon;
          } else {
            //   toasterService.error($rootScope.errorMessages.TENANT.GET_INFO.FAILED);
          }
      }).catch(function () {
        //   toasterService.error($rootScope.errorMessages.TENANT.GET_INFO.FAILED);
      });
  }]);
