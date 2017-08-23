'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.common:contentFlagController
 * @author Anuj Gupta
 * @description
 * # contentFlagController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('contentFlagController', ['contentService', '$timeout', '$state', 'config',
        '$rootScope', 'toasterService', '$scope', function (contentService, $timeout, $state,
             config, $rootScope, toasterService, $scope) {
            var contentFlag = this;
            contentFlag.showContentFlagModal = false;
            contentFlag.userId = $rootScope.userId;
            contentFlag.userFullName = $rootScope.firstName + ' ' + $rootScope.lastName;
            contentFlag.contentId = $scope.contentid;
            contentFlag.contentName = $scope.contentname;
            contentFlag.contentVersionKey = $scope.versionkey;
            contentFlag.reasons = ['Inappropriate content', 'Copyright violation',
                'Privacy violation', 'Other'];
            var message = $rootScope.labels.CONTENT_FLAG;
            contentFlag.flagMessage = $scope.type === 'course' ? message.courseFlagText
                                                                    : message.contentFlagText;

            contentFlag.hideContentFlagModal = function () {
                $('#contentFlagModal').modal('hide');
                $('#contentFlagModal').modal('hide others');
                $('#contentFlagModal').modal('hide dimmer');
            };

            contentFlag.initializeModal = function () {
                contentFlag.showContentFlagModal = true;
                $timeout(function () {
                    $('#contentFlagModal').modal({
                        onHide: function () {
                            contentFlag.showContentFlagModal = false;
                            contentFlag.data = {};
                        }
                    }).modal('show');
                }, 10);
            };

            contentFlag.createFlag = function (requestData) {
                contentFlag.loader = toasterService.loader('', $rootScope.errorMessages.CONTENT_FLAG
                                                            .START);
                contentService.flag(requestData, contentFlag.contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        $timeout(function () {
                            contentFlag.loader.showLoader = false;
                            contentFlag.showContentFlagModal = false;
                            contentFlag.hideContentFlagModal();
                            contentFlag.close();
                        }, 2000);
                    } else {
                        contentFlag.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.CONTENT_FLAG.FAILED);
                    }
                }).catch(function () {
                    contentFlag.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.CONTENT_FLAG.FAILED);
                });
            };

            contentFlag.saveMetaData = function (data) {
                var requestData = {
                    flaggedBy: contentFlag.userFullName,
                    versionKey: contentFlag.contentVersionKey
                };
                if (data.flagReasons) {
                    requestData.flagReasons = [data.flagReasons];
                }
                if (data.comment) {
                    requestData.flags = [data.comment];
                }
                contentFlag.createFlag(requestData);
            };

            contentFlag.close = function () {
                contentFlag.hideContentFlagModal();
                if ($rootScope.search.searchKeyword !== '') {
                    $timeout(function () {
                        $rootScope.$emit('initSearch', {});
                    }, 0);
                } else {
                    $state.go($scope.redirect);
                }
            };
        }]);
