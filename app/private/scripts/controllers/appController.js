'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the playerApp
 */
angular.module('playerApp').controller('AppCtrl', ['$scope', 'permissionsService', '$rootScope',
    '$translate', 'userService', '$q', 'config', '$location', '$timeout',
    'portalTelemetryService', 'setResourceBundle', 'errorMessages', 'labels', 'sessionService',
    'learnService', '$http', 'searchService', 'toasterService',
    function ($scope, permissionsService, $rootScope, $translate, userService, $q, config,
    $location, $timeout, portalTelemetryService, setResourceBundle, errorMessages, labels,
    sessionService, learnService, $http, searchService, toasterService) {
        $rootScope.userId = $('#userId').attr('value');
        $rootScope.sessionId = $('#sessionId').attr('value');
        $rootScope.language = $rootScope.userLanguage || config.SITE.DEFAULT_LANGUAGE;
        $rootScope.errorMessages = errorMessages;
        $rootScope.labels = labels;
        $rootScope.translationBundle = {};
        $rootScope.searchKey = '';
        $rootScope.enrolledCourseIds = {};

        $rootScope.openLink = function (url) {
            $location.path(url);
        };

        $rootScope.loadBundle = function () {
            var promises = [];
            promises.push(userService.resourceBundle($rootScope.language, 'label'));
            promises.push(userService.resourceBundle($rootScope.language, 'error'));
            $q.all(promises).then(function (results) {
                results.forEach(function (res) {
                    if (res && res.responseCode === 'OK' && res.result) {
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
            if ($(e.target).closest('div.dropdown-menu-list').prop('id') === 'search-suggestions') {
                return false;
            }
            $('body').find('.dropdown-menu-list').removeClass('visible').addClass('hidden');
        });

        $scope.logout = function () {
            window.document.location.replace('/logout');
        };
    // get user profile
        $scope.userProfile = function (userProfile) {
            if (userProfile && userProfile.responseCode === 'OK') {
                var profileData = userProfile.result.response;
                $rootScope.avatar = profileData.avatar;
                $rootScope.firstName = profileData.firstName;
                $rootScope.lastName = profileData.lastName;
                var userRoles = profileData.roles;
                var orgIds = [];
                var organisationNames = [];

                var rootOrg = (profileData.rootOrg && !_.isUndefined(profileData.rootOrg.id)) ? profileData.rootOrg.id : 'sunbird';
                org.sunbird.portal.channel = md5(rootOrg);
                var organisationIds = [];

                _.forEach(profileData.organisations, function (org) {
                    if (org.roles && _.isArray(org.roles)) {
                        userRoles = _.union(userRoles, org.roles);
                    }
                    if (org.organisationId) {
                        organisationIds.push(org.organisationId);
                        orgIds.push(org.organisationId);
                    }
                    if (org.orgName) {
                        organisationNames.push(org.orgName);
                    }
                });
                $rootScope.organisationNames = organisationNames;
                
                // Get Organisation details
                userService.getOrgDetails(orgIds).then(function (successResponse) {
					if (successResponse.responseCode === 'OK') {
						var orgArray = [];
						_.forEach(successResponse.result.response.content, function (org) {
							orgArray.push({ organisationId: org.id, orgName: org.orgName });
						});
						$rootScope.organisations = orgArray;
					}
				})
				.catch(function () {
					// error handler
				});
                
                $rootScope.organisationIds = angular.copy(organisationIds);
                org.sunbird.portal.dims = organisationIds;
                org.sunbird.portal.dims.forEach(function (value, index, arr) {
                    arr[index] = md5(value);
                });
                permissionsService.setCurrentUserRoles(userRoles);
                $rootScope.initializePermissionDirective = true;
                $scope.getTelemetryConfigData(profileData);
            } else {
            // error handler
            }
        };
        $scope.getTelemetryConfigData = function () {
            org.sunbird.portal.sid = $rootScope.sessionId;
            org.sunbird.portal.uid = $rootScope.userId;

            $http.get('/get/envData').then(function (res) {
                org.sunbird.portal.appid = res.data.appId;
                org.sunbird.portal.ekstep_env = res.data.ekstep_env;
            })
        .catch(function () {
            org.sunbird.portal.appid = 'sunbird.portal';
            org.sunbird.portal.ekstep_env = 'qa';
        })
        .finally(function () {
            org.sunbird.portal.init();
            portalTelemetryService.init();
        });
        };

        $scope.getProfile = function () {
            userService.getUserProfile($rootScope.userId).then(function (successResponse) {
                $scope.userProfile(successResponse);
            })
        .catch(function () {
            // error handler
        });
        };
        $scope.getProfile();

        $rootScope.closeRoleAccessError = function () {
            $rootScope.accessDenied = '';
        };
        $scope.getMyCourses = function () {
            sessionService.setSessionData('ENROLLED_COURSES', undefined);
            learnService.enrolledCourses($rootScope.userId).then(function (successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    $rootScope.enrolledCourses = successResponse.result.courses;
                    $rootScope.enrolledCourseIds = $rootScope.arrObjsToObject($rootScope.enrolledCourses, 'courseId');
                    sessionService.setSessionData('ENROLLED_COURSES', {
                        uid: $rootScope.userId,
                        courseArr: $rootScope.enrolledCourses,
                        courseObj: $rootScope.enrolledCourseIds
                    });
                } else {
                    $rootScope.enrolledCourses = undefined;
                    sessionService.setSessionData('ENROLLED_COURSES', undefined);
                }
            });
        };
        $rootScope.arrObjsToObject = function (array, key) {
            var objData = {};
            array.forEach(function (item) {
                objData[item[key]] = item;
            });
            return objData;
        };
        if (!$rootScope.enrolledCourses) {
            $scope.getMyCourses();
        }
    // dont remove this .to load progress bars in cards
        $rootScope.loadProgress = function () {
            $('.course-progress').progress('reset');
            $timeout(function () {
                $('.course-progress').progress();
            }, 100);
        };
        $scope.getTenantLogo = function () {
            userService.getTenantLogo().then(function (res) {
                if (res && res.logo !== '') {
                    $rootScope.orgLogo = res.logo;
                }
            });
        };
        $scope.getTenantLogo();

        $rootScope.getConcept = function (offset, limit, callback) {
            var req = {
                filters: {
                    objectType: ['Concept']
                },
                offset: offset,
                limit: limit
            };
            searchService.search(req).then(function (res) {
                if (res.result && res.result && _.isArray(res.result.concepts)) {
                    _.forEach(res.result.concepts, function (value) {
                        $scope.concepts.push(value);
                    });
                    if ((res.result.count > offset) && res.result.count > (offset + limit)) {
                        offset += limit;
                        limit = res.result.count-limit;
                        $rootScope.getConcept(offset, limit, callback);
                    } else {
                        callback(false, $scope.concepts);
                    }
                }
            })
        .catch(function (err) {
            callback(true);
        });
        };
        if (!$rootScope.concepts) {
            $scope.concepts = [];
            $rootScope.getConcept(0, 200, function (err, conceptArr) {
                if (err) {
                    toasterService.error($rootScope.errorMessages.WORKSPACE.GET.FAILED);
                } else {
                    $rootScope.concepts = conceptArr;
                }
            });
        }
    }]);
