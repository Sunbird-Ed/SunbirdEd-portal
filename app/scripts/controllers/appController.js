'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('AppCtrl', function ($scope, $state, $stateParams, $rootScope, setResourceBundle, $translate, userService, $q, config, $location) {
            $rootScope.language = $rootScope.userLanguage || config.SITE.DEFAULT_LANGUAGE;
            $rootScope.translationBundle = {};
            $rootScope.$on('$viewContentLoaded', function () {
                $('#headerSearchdd').dropdown();
            });
            $rootScope.loadCarousel = function () {
                $('.regular').not('.slick-initialized').slick({
                    infinite: true,
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    prevArrow: false,
                });
                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating('disable', true);

                $('.popup-button').popup();
            };
            $rootScope.searchKey = '';
            $scope.$on('$locationChangeSuccess', function () {
                $rootScope.currentPath = $location.path();
            });
            $rootScope.currentPath = $location.path();

            $rootScope.loadBundle = function () {
                var promises = [];
                promises.push(userService.resourceBundle($rootScope.language, 'label'));
                promises.push(userService.resourceBundle($rootScope.language, 'error'));
                $q.all(promises).then(function (results) {
                    results.forEach(function (res) {
                        if (res && res.responseCode == 'OK' && res.result) {
                            $rootScope.translationBundle = $rootScope.mergeObjects($rootScope.translationBundle, res.result[$rootScope.language]);
                            $rootScope.addTranslation($rootScope.language, $rootScope.translationBundle);
                        }
                    });
                });
            };
            $rootScope.addTranslation = function (language, translationBundle) {
                if (setResourceBundle(language, translationBundle)) {
                    $translate.use(language);
                }
            };
            $rootScope.mergeObjects = function (obj1, obj2) {
                var objMerge = '';
                if (Object.keys(obj1).length > 0) {
                    objMerge = JSON.stringify(obj1) + JSON.stringify(obj2);
                    objMerge = objMerge.replace(/\}\{/, ',');
                    objMerge = JSON.parse(objMerge);
                } else {
                    objMerge = obj2;
                }
                return objMerge;
            };
            $rootScope.loadBundle('label');
            $('body').click(function (e) {
                if ($(e.target).closest('div.dropdown-menu-list').prop('id') == 'search-suggestions') {
                    return false;
                } else {
                    $('body').find('.dropdown-menu-list').removeClass('visible').addClass('hidden');
                }
            });
            $scope.$watch(function () {
                return $state.$current.name;
            }, function (newState, oldState) {
                if (newState.toLowerCase() === 'course' || newState.toLowerCase() === 'toc') {
                    $rootScope.displayCourseHeader = true;
                } else
                {
                    $rootScope.displayCourseHeader = false;
                }
            });
            // $scope.initilizwDropDown = function() {
            //     $('#dropdown-menu-list')
            //         .dropdown({
            //             action: 'combo'
            //         });
            // };
            // $('.small.modal')
            //     .modal('show')
            // ;
//        $scope.$watch(function() {
//            return $state.$current.name;
//        }, function(newState, oldState) {
//            if (newState.toLowerCase() === 'course' || newState.toLowerCase() === 'toc') {
//                $rootScope.displayCourseHeader = true;
//                $scope.courseId = $stateParams.courseId;
//                $rootScope.sideMenuData = [{
//                        'icon': '',
//                        'name': 'COURSE SCHEDULE',
//                        'children': [],
//                        'link': '/toc/' + $scope.courseId + '/no'
//                    },
//                    {
//                        'icon': '',
//                        'name': 'LECTURE VIEW',
//                        'children': [],
//                        'link': '/toc/' + $scope.courseId + '/yes'
//                    },
//                    {
//                        'icon': '',
//                        'name': 'NOTES',
//                        'children': [],
//                        'link': '/note'
//                    }
//                ];
//            } else {
//                $rootScope.displayCourseHeader = false;
//                $rootScope.sideMenuData = [{
//                        'icon': 'large add circle icon',
//                        'name': 'Add Course',
//                        'children': [],
//                        'link': '#'
//                    },
//                    {
//                        'icon': 'large bookmark icon',
//                        'name': 'My Bookmarks',
//                        'children': [],
//                        'link': '#'
//                    },
//                    {
//                        'icon': 'large search icon',
//                        'name': 'Explore',
//                        'children': [],
//                        'link': '#'
//                    }
//                ];
//            }
//        });
        });