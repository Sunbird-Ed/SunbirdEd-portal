'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('AppCtrl', function ($scope, $state, $stateParams, $rootScope, setResourceBundle, $translate, userService, $q, config, $location,$timeout) {
            $rootScope.language = $rootScope.userLanguage || config.SITE.DEFAULT_LANGUAGE;
            $rootScope.translationBundle = {};
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
            $rootScope.loadProgress=function(){
                $timeout(function(){       
                     $('.course-progress').progress();
                },500);               
            }
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
            
        });