'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular
  .module('playerApp')
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $provide) {
      $provide.provider('setResourceBundle', function () {
          this.$get = function () {
              return function (language, resourceBundle) {
                  $translateProvider.translations(language, resourceBundle);
                  $translateProvider.preferredLanguage(language);
                  $translateProvider.useSanitizeValueStrategy('sanitize');
                  return true;
              };
          };
      });
      $urlRouterProvider.deferIntercept();
      $urlRouterProvider.otherwise('/home');
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
          onEnter: function ($rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.homeActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'home',
                  type: 'default',
                  pageid: org.sunbird.portal.appid + '_Home',
                  id: '',
                  name: '',
                  url: '/private/index#!/home'
              });
              routeHelperService.loadRouteConfig('Home', null);
          },
          onExit: function ($rootScope) {
              $rootScope.homeActive = '';
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
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_UserContent',
                  id: '',
                  name: '',
                  url: '/private/index#!/content'
              });
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
          onEnter: function ($rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.isLearnPage = true;
              $rootScope.courseActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'course',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_Courses',
                  id: '',
                  name: '',
                  url: '/private/index#!/learn'
              });
              routeHelperService.loadRouteConfig('Courses');
          },
          onExit: function ($rootScope) {
              $rootScope.courseActive = '';
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
          onEnter: function ($rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.isResourcesPage = true;
              $rootScope.resourcesActive = 'active';
              routeHelperService.loadRouteConfig('Resources');
          // filters section -- ends
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_Resources',
                  id: '',
                  name: '',
                  url: '/private/index#!/resources'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.isResourcesPage = false;
              $rootScope.resourcesActive = '';
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
          onEnter: function ($stateParams, $rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.isNotePage = true;
              $rootScope.courseActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'notes',
                  type: 'detail',
                  pageid: org.sunbird.portal.appid + '_CourseNote',
                  id: '',
                  name: '',
                  url: '/private/index#!/course/note/' + $stateParams.courseId
              });
              routeHelperService.loadRouteConfig('CourseNote', $stateParams);
          },
          onExit: function ($rootScope) {
              $rootScope.isNotePage = false;
              $rootScope.courseActive = '';
          }
      })
      .state('ContentNote', {
          url: '/resourse/note/:contentId/:contentName',
          views: {
              mainView: {
                  templateUrl: 'views/note/noteList.html',
                  controller: 'NoteListCtrl as noteList'
              }
          },
          onEnter: function ($rootScope, $stateParams, portalTelemetryService, routeHelperService) {
              $rootScope.isNotePage = true;
              $rootScope.resourcesActive = 'active';
              routeHelperService.loadRouteConfig('ContentNote', $stateParams);
              portalTelemetryService.fireImpressions({
                  env: 'notes',
                  type: 'detail',
                  pageid: org.sunbird.portal.appid + '_ContentNote',
                  id: $stateParams.contentId,
                  name: $stateParams.contentName,
                  url: '/private/index#!/resourse/note/' + $stateParams.contentId + '/' + $stateParams.contentName
              });
          },
          onExit: function ($rootScope) {
              $rootScope.isNotePage = false;
              $rootScope.resourcesActive = '';
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
          onEnter: function ($rootScope, portalTelemetryService, $stateParams, routeHelperService) {
              routeHelperService.loadRouteConfig('CourseContentNote', $stateParams);
              $rootScope.isNotePage = true;
              $rootScope.courseActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'notes',
                  type: 'default',
                  pageid: org.sunbird.portal.appid + '_CourseContentNote',
                  id: $stateParams.contentId,
                  name: '',
                  url: '/private/index#!/note/' + $stateParams.courseId + '/' + $stateParams.contentId
              });
          },
          onExit: function ($rootScope) {
              $rootScope.isNotePage = false;
              $rootScope.courseActive = '';
          }
      })
      .state('Toc', {
          url: '/toc/:courseId/:lectureView',
          views: {
              mainView: {
                  templateUrl: 'views/course/toc.html',
                  controller: 'courseScheduleCtrl as toc'
              }
          },
          onEnter: function ($rootScope, portalTelemetryService, $stateParams, routeHelperService) {
              $rootScope.isTocPage = true;
              $rootScope.courseActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'course',
                  type: 'detail',
                  pageid: org.sunbird.portal.appid + '_Toc',
                  id: '',
                  name: '',
                  url: '/private/index#!/toc/' + $stateParams.courseId + '/' + $stateParams.lectureView
              });
              routeHelperService.loadRouteConfig('Toc', $stateParams);
          },
          onExit: function ($rootScope) {
              $rootScope.isTocPage = false;
              $rootScope.courseActive = '';
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
          onEnter: function (portalTelemetryService, routeHelperService) {
              portalTelemetryService.fireImpressions({
                  env: 'community',
                  type: 'default',
                  pageid: org.sunbird.portal.appid + '_Community',
                  id: '',
                  name: '',
                  url: '/private/index#!/community'
              });
              routeHelperService.loadRouteConfig('Community');
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
          onEnter: function ($rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.profileActive = 'active';
              routeHelperService.loadRouteConfig('Profile');
              portalTelemetryService.fireImpressions({
                  env: 'profile',
                  type: 'default',
                  pageid: org.sunbird.portal.appid + '_Profile',
                  id: '',
                  name: '',
                  url: '/private/index#!/profile'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      })
      .state('Player', {
          url: '/player/:contentId/:contentName',
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
          onEnter: function ($rootScope, $stateParams, portalTelemetryService, routeHelperService) {
              $rootScope.isPlayerPage = true;
              $rootScope.resourcesActive = 'active';
              routeHelperService.loadRouteConfig('Player', $stateParams);
              portalTelemetryService.fireImpressions({
                  env: 'player',
                  type: 'default',
                  pageid: org.sunbird.portal.appid + '_Player',
                  id: $stateParams.contentId,
                  name: $stateParams.contentName,
                  url: '/private/index#!/player/' + $stateParams.contentId + '/' + $stateParams.contentName
              });
          },
          onExit: function ($rootScope) {
              $rootScope.isPlayerPage = false;
              $rootScope.resourcesActive = '';
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
          onEnter: function ($rootScope, portalTelemetryService, $stateParams, routeHelperService) {
              $rootScope.isSearchResultsPage = true;
              routeHelperService.loadRouteConfig('Search', $stateParams);
              if ($stateParams.type == 'Courses') {
                  $rootScope.courseActive = 'active';
              } else if ($stateParams.type == 'Resources') {
                  $rootScope.resourcesActive = 'active';
              } else {
                  $rootScope.homeActive = 'active';
              }
              portalTelemetryService.fireImpressions({
                  env: 'course',
                  type: 'search',
                  pageid: org.sunbird.portal.appid + '_SearchCourse',
                  id: '',
                  name: '',
                  url: '/private/index#!/' + $stateParams.type + '/search/' + $stateParams.query + '/' + $stateParams.filters + '/' + $stateParams.sort + '/' + $stateParams.autoSuggestSearch
              });
          },
          onExit: function ($rootScope) {
              $rootScope.courseActive = $rootScope.resourcesActive = '';
              $rootScope.isSearchResultsPage = false;
              $rootScope.homeActive = '';
          }
      })
      .state('TocPlayer', {
          url: '/toc/:courseId/:lectureView/:contentId/:contentIndex',
          views: {
              mainView: {
                  templateUrl: 'views/course/toc.html',
                  controller: 'courseScheduleCtrl as toc'
              }
          },
          onEnter: function ($rootScope, portalTelemetryService, $stateParams, routeHelperService) {
              routeHelperService.loadRouteConfig('TocPlayer', $stateParams);
              $rootScope.isTocPage = true;
              $rootScope.courseActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'player',
                  type: 'detail',
                  pageid: org.sunbird.portal.appid + '_TocPlayer',
                  id: '',
                  name: '',
                  url: '/private/index#!/toc/' + $stateParams.courseId + '/' + $stateParams.lectureView + '/' + $stateParams.contentId + '/' + $stateParams.contentIndex
              });
          },
          onExit: function ($rootScope) {
              $rootScope.isTocPage = false;
              $rootScope.courseActive = '';
          }
      }).state('WorkSpace', {
          url: '/workspace',
          views: {
              mainView: {
                  templateUrl: '/views/workSpace/workSpace.html',
                  controller: function ($state, $rootScope) {
                      $rootScope.profileActive = 'active';
                      if ($state.current.name === 'WorkSpace') {
                          $state.go('WorkSpace.ContentCreation');
                      }
                  }
              }
          },
          onEnter: function ($rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.profileActive = 'active';
              routeHelperService.loadRouteConfig('WorkSpace');
              portalTelemetryService.fireImpressions({
                  env: 'workspace',
                  type: 'default',
                  pageid: org.sunbird.portal.appid + '_WorkSpace',
                  id: '',
                  name: '',
                  url: '/private/index#!/workspace'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      }).state('WorkSpace.ContentCreation', {
          url: '/content/create',
          views: {
              contentView: {
                  templateUrl: 'views/workSpace/createContent.html',
                  controller: 'ContentCreationController as contentCreation'
              }
          },
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'creation',
                  pageid: org.sunbird.portal.appid + '_WorkSpace.ContentCreation',
                  id: '',
                  name: '',
                  url: '/private/index#!/content/create'
              });
          }
      }).state('WorkSpace.DraftContent', {
          url: '/content/draft',
          views: {
              contentView: {
                  templateUrl: 'views/workSpace/draftContent.html',
                  controller: 'DraftContentController as draftContent'
              }
          },
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_WorkSpace.DraftContent',
                  id: '',
                  name: '',
                  url: '/private/index#!/content/draft'
              });
          }
      }).state('WorkSpace.ReviewContent', {
          url: '/content/review',
          views: {
              contentView: {
                  templateUrl: 'views/workSpace/reviewContent.html',
                  controller: 'ReviewContentController as reviewContent'
              }
          },
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_WorkSpace.ReviewContent',
                  id: '',
                  name: '',
                  url: '/private/index#!/content/review'
              });
          }
      }).state('WorkSpace.PublishedContent', {
          url: '/content/published',
          views: {
              contentView: {
                  templateUrl: 'views/workSpace/publishedContent.html',
                  controller: 'PublishedContentController as publishedContent'
              }
          },
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_WorkSpace.PublishedContent',
                  id: '',
                  name: '',
                  url: '/private/index#!/content/published'
              });
          }
      }).state('WorkSpace.AllUploadedContent', {
          url: '/content/uploaded',
          views: {
              contentView: {
                  templateUrl: 'views/workSpace/allUploadedContent.html',
                  controller: 'AllUploadedContentController as allUploadedContent'
              }
          },
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'list',
                  pageid: org.sunbird.portal.appid + '_WorkSpace.AllUploadedContent',
                  id: '',
                  name: '',
                  url: '/private/index#!/content/uploaded'
              });
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
            onEnter: function (portalTelemetryService) {
                portalTelemetryService.fireImpressions({
                    env: 'content',
                    type: 'list',
                    pageid: org.sunbird.portal.appid + '_WorkSpace.UpForReviewContent',
                    id: '',
                    name: '',
                    url: '/private/index#!/content/upForReview'
                });
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
            onEnter: function (portalTelemetryService) {
                portalTelemetryService.fireImpressions({
                    env: 'content',
                    type: 'list',
                    pageid: org.sunbird.portal.appid + '_WorkSpace.FlaggedContent',
                    id: '',
                    name: '',
                    url: '/private/index#!/content/flagged'
                });
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
            onEnter: function ($rootScope, portalTelemetryService) {
                $rootScope.profileActive = 'active';
                portalTelemetryService.fireImpressions({
                    env: 'content',
                    type: 'creation',
                    pageid: org.sunbird.portal.appid + '_CreateLesson',
                    id: '',
                    name: '',
                    url: '/private/index#!/create/lesson'
                });
            },
            onExit: function ($rootScope) {
                $rootScope.profileActive = '';
            }
        })
        .state('ContentEditor', {
            url: '/content/editor/:contentId',
            views: {
                mainView: {
                    templateUrl: 'views/common/contentEditor.html',
                    controller: 'ContentEditorController as contentEditor'
                }
            },
            params: {
                contentId: null
            },
            onEnter: function ($state, $rootScope, portalTelemetryService, $stateParams) {
                $rootScope.profileActive = 'active';
                portalTelemetryService.fireImpressions({
                    env: 'content',
                    type: 'creation',
                    pageid: org.sunbird.portal.appid + '_ContentEditor',
                    id: $stateParams.contentId,
                    name: '',
                    url: '/private/index#!/content/editor/' + $stateParams.contentId
                });
            },
            onExit: function ($rootScope) {
                $rootScope.profileActive = '';
            }
        })
        .state('EditContent', {
            url: '/content/edit/:contentId',
            views: {
                mainView: {
                    templateUrl: '/views/workSpace/editContent.html',
                    controller: 'EditContentController as editContent'
                }
            },
            params: {
                contentId: null,
                backState: null
            },
            onEnter: function ($rootScope, portalTelemetryService, $state, $stateParams) {
                $rootScope.profileActive = 'active';
                portalTelemetryService.fireImpressions({
                    env: 'content',
                    type: 'edit',
                    pageid: org.sunbird.portal.appid + '_EditContent',
                    id: $stateParams.contentId,
                    name: '',
                    url: '/private/index#!/content/edit/' + $stateParams.contentId
                });
            },
            onExit: function ($rootScope) {
                $rootScope.profileActive = '';
            }

      }).state('profileStartCreate', {
          url: '/create/workspace',
          views: {
              mainView: {
                  templateUrl: '/views/workSpace/createContent.html'
              }
          },
          onEnter: function (portalTelemetryService) {
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'creation',
                  pageid: org.sunbird.portal.appid + '_profileStartCreate',
                  id: '',
                  name: '',
                  url: '/private/index#!/create/workspace'
              });
          }
      }).state('CreateTextbook', {
          url: '/create/textbook',
          views: {
              mainView: {
                  templateUrl: '/views/workSpace/createTextBook.html',
                  controller: 'TextBookController as textbook'
              }
          },
          onEnter: function ($rootScope, portalTelemetryService) {
              $rootScope.profileActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'textbook',
                  type: 'creation',
                  pageid: org.sunbird.portal.appid + '_CreateTextbook',
                  id: '',
                  name: '',
                  url: '/private/index#!/create/textbook'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      }).state('CreateCollection', {
          url: '/create/collection',
          views: {
              mainView: {
                  templateUrl: '/views/workSpace/createCollection.html',
                  controller: 'CollectionController as collection'
              }
          },
          onEnter: function ($rootScope, portalTelemetryService) {
              $rootScope.profileActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'collection',
                  type: 'creation',
                  pageid: org.sunbird.portal.appid + '_CreateCollection',
                  id: '',
                  name: '',
                  url: '/private/index#!/create/collection'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      }).state('CreateCourse', {
          url: '/create/course',
          views: {
              mainView: {
                  templateUrl: '/views/workSpace/createCourse.html',
                  controller: 'CourseController as course'
              }
          },
          onEnter: function ($rootScope, portalTelemetryService) {
              $rootScope.profileActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'course',
                  type: 'creation',
                  pageid: org.sunbird.portal.appid + '_CreateCourse',
                  id: '',
                  name: '',
                  url: '/private/index#!/create/course'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      }).state('CollectionEditor', {
          url: '/collection/editor/:contentId/:type/:state',
          views: {
              mainView: {
                  templateUrl: 'views/common/collectionEditor.html',
                  controller: 'CollectionEditorController as collectionEditor'
              }
          },
          params: {
              contentId: null,
              type: null,
              state: null
          },
          onEnter: function ($rootScope, portalTelemetryService) {
              $rootScope.profileActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'collectioneditor',
                  type: 'edit',
                  pageid: org.sunbird.portal.appid + '_CollectionEditor',
                  id: '',
                  name: '',
                  url: '/private/index#!/collection/editor/'
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      }).state('PreviewContent', {
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
          onEnter: function ($state, $rootScope, portalTelemetryService, $stateParams) {
              $rootScope.profileActive = 'active';
              portalTelemetryService.fireImpressions({
                  env: 'content',
                  type: 'preview',
                  pageid: org.sunbird.portal.appid + '_PreviewContent',
                  id: $stateParams.contentId,
                  name: '',
                  url: '/private/index#!/preview/content/' + $stateParams.contentId + '/' + $stateParams.backState
              });
          },
          onExit: function ($rootScope) {
              $rootScope.profileActive = '';
          }
      }).state('PreviewCollection', {
          url: '/preview/collection/:Id/:name',
          views: {
              mainView: {
                  templateUrl: 'views/collectionplayer/collectionPlayer.html',
                  controller: 'CollectionPlayerCtrl as cpvm'
              }
          },
          params: {
              Id: null,
              name: null
          },
          onEnter: function ($stateParams, $rootScope, portalTelemetryService, routeHelperService) {
              $rootScope.resourcesActive = 'active';
              $rootScope.isPlayerPage = true;
              routeHelperService.loadRouteConfig('PreviewCollection', $stateParams);
              portalTelemetryService.fireImpressions({
                  env: 'collection',
                  type: 'preview',
                  pageid: org.sunbird.portal.appid + '_PreviewCollection',
                  id: $stateParams.Id,
                  name: '',
                  url: '/private/index#!/preview/collection/' + $stateParams.Id + '/' + $stateParams.name
              });
          },
          onExit: function ($rootScope) {
              $rootScope.resourcesActive = '';
          }
      })
      .state('Admin', {
            url: '/admin',
            views: {
                mainView: {
                    templateUrl: 'views/admin/admin.html',
                    controller: 'adminController as admin'
                }
            }
        });
        })
  .run(function ($urlRouter, $http, $state, permissionsService, $rootScope, $location, config) {
      permissionsService.getPermissionsData('/permissions')
      .then(function (res) {
          var permissions = res.data;//eslint-disable-line
          if (res && res.responseCode === 'OK') {
              permissionsService.setRolesAndPermissions(res.result);
          } else {
          // TODO: allow only public permissions
          }
      })
      .then(function () {
          $urlRouter.sync();
          $urlRouter.listen();
      });

      $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams, toasterService) {
          switch (toState.name) {
          case 'WorkSpace':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
              //                            toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'WorkSpace.ContentCreation':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'CreateLesson':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'ContentEditor':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'EditContent':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'CreateTextbook':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'CreateCollection':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'CreateCourse':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'CollectionEditor':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'PreviewContent':
              if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'WorkSpace.UpForReviewContent':
              if (permissionsService.checkRolesPermissions(['CONTENT_REVIEWER', 'CONTENT_REVIEW'], false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          case 'WorkSpace.FlaggedContent':
              if (permissionsService.checkRolesPermissions(['FLAG_REVIEWER'], false)) {
                  toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                  event.preventDefault();
                  $state.go('Home');
              }
              break;
          default:
            // statements_def
              break;
          }
      });
  });
