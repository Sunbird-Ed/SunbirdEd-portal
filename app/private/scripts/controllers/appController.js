'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('AppCtrl', function ($scope, $state, $stateParams, $rootScope, setResourceBundle, $translate, userService, $q, config, $location, $timeout) {
            $rootScope.userId = $("#userId").attr("value");
            $rootScope.language = $rootScope.userLanguage || config.SITE.DEFAULT_LANGUAGE;
            $rootScope.translationBundle = {};
            $rootScope.searchKey = '';
            $rootScope.openLink=function(url){
                $location.path(url);
            }
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
            $scope.logout = function () {
                window.document.location.href = '/logout';
            }

        });