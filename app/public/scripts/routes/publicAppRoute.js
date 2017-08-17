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
  .config(function ($stateProvider, $urlRouterProvider) {
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
      .state('Public', {
          url: '/public/:hashId',
          views: {
              mainView: {
                  controller: function ($location, $stateParams) {
                      $location.path('public/' + $stateParams.hashId);
                  }
              }
          },
          params: {
              hashId: null
          }
      })
      .state('PublicContent', {
          url: '/public/content/:id',
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
          url: '/public/course/:courseId',
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
  });
