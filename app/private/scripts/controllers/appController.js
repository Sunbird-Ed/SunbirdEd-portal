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
            //remove token code later and its references in service headers
            $rootScope.token = 'fcc60ad1-ae6b-3473-9c11-a7e1eef9b489';
            $rootScope.language = $rootScope.userLanguage || config.SITE.DEFAULT_LANGUAGE;
            $rootScope.translationBundle = {};
            $rootScope.searchKey = '';
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

        });