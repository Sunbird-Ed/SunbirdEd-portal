'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:PreviewContentController
 * @description
 * @author Anuj Gupta
 * # PreviewContentController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('PreviewContentController', ['$stateParams', 'playerTelemetryUtilsService',
        '$rootScope', '$state', 'contentService', '$timeout', 'config',
        'toasterService', function ($stateParams, playerTelemetryUtilsService, $rootScope,
             $state, contentService, $timeout, config, toasterService) {
            var previewContent = this;
            previewContent.contentProgress = 0;
            previewContent.contentId = $stateParams.contentId;
            previewContent.userId = $rootScope.userId;
            previewContent.isShowPublishRejectButton =
                                    $stateParams.backState === 'WorkSpace.UpForReviewContent';
            previewContent.isShowDeleteButton =
                                    $stateParams.backState === 'WorkSpace.PublishedContent';
            previewContent.isShowFlagActionButton =
                                    $stateParams.backState === 'WorkSpace.FlaggedContent';
            previewContent.message = $rootScope.errorMessages.WORKSPACE;

            var validateModal = {
                state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
                    'WorkSpace.PublishedContent', 'WorkSpace.FlaggedContent'],
                status: ['Review', 'Live', 'Flagged'],
                mimeType: config.MimeTypeExceptCollection
            };
            previewContent.contentPlayer = { isContentPlayerEnabled: false };
            previewContent.redirectUrl = $stateParams.backState;

            function checkContentAccess(reqData, validateData) {
                var status = reqData.status;
                var createdBy = reqData.createdBy;
                var state = reqData.state;
                var userId = reqData.userId;
                var validateDataStatus = validateData.status;
                var isMime = _.indexOf(validateData.mimeType, reqData.mimeType) > -1;
                if (isMime) {
                    var isStatus = _.indexOf(validateDataStatus, status) > -1;
                    var isState = _.indexOf(validateData.state, state) > -1;
                    if (isStatus && isState && createdBy !== userId) {
                        return true;
                    } else if (isStatus && isState && createdBy === userId) {
                        return true;
                    } else if (isStatus && createdBy === userId) {
                        return true;
                    }
                    return false;
                }
                return false;
            }

            function showPlayer(data) {
                var rspData = data;
                rspData.state = $stateParams.backState;
                rspData.userId = $rootScope.userId;

                if (!checkContentAccess(rspData, validateModal)) {
                    toasterService
                    .warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                    $state.go('Home');
                }
                previewContent.contentData = data;
                previewContent.contentPlayer.contentData = data;
                previewContent.contentPlayer.isContentPlayerEnabled = true;
            }

            function getContent(contentId) {
                previewContent.loader = toasterService.loader('', previewContent.message
                                                                        .GET.START);
                var req = { contentId: contentId };
                var qs = {
                    fields: 'name,description,appIcon,contentType,mimeType,artifactUrl,' +
                            'versionKey,audience,language,gradeLevel,ageGroup,subject,' +
                            'medium,author,domain,createdBy,flagReasons,flaggedBy,flags,status,' +
                            'createdOn,lastUpdatedOn,body'
                };

                if ($stateParams.backState === 'WorkSpace.UpForReviewContent') {
                    qs.mode = 'edit';
                }
                contentService.getById(req, qs).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        previewContent.errorObject = {};
                        previewContent.loader.showLoader = false;
                        showPlayer(response.result.content);
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.GET.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.GET.FAILED);
                });
            }

            getContent(previewContent.contentId);

            previewContent.publishContent = function () {
                var request = {
                    content: {
                        lastPublishedBy: previewContent.userId
                    }
                };
                previewContent.loader = toasterService.loader('', previewContent.message
                                                      .PUBLISH_CONTENT.START);

                contentService.publish(request, previewContent.contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        previewContent.loader.showLoader = false;
                        previewContent.isShowPublishRejectButton = false;
                        previewContent.contentData.status = 'Live';
                        toasterService.success(previewContent.message.PUBLISH_CONTENT.SUCCESS);
//                $state.go("WorkSpace.UpForReviewContent")
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.PUBLISH_CONTENT.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.PUBLISH_CONTENT.FAILED);
                });
            };

            previewContent.rejectContent = function () {
                previewContent.loader = toasterService.loader('', previewContent.message
                                                            .REJECT_CONTENT.START);

                var request = {};
                contentService.reject(request, previewContent.contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        previewContent.loader.showLoader = false;
                        previewContent.isShowPublishRejectButton = false;
                        toasterService.success(previewContent.message.REJECT_CONTENT.SUCCESS);
//                $state.go("WorkSpace.UpForReviewContent");
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.REJECT_CONTENT.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.REJECT_CONTENT.FAILED);
                });
            };

            previewContent.deleteContent = function () {
                previewContent.loader = toasterService.loader('', previewContent.message
                                                        .RETIRE_CONTENT.START);
                var request = {
                    contentIds: [previewContent.contentId]
                };
                contentService.retire(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        $timeout(function () {
                            previewContent.loader.showLoader = false;
                            previewContent.isShowDeleteButton = false;
                            previewContent.isShowFlagActionButton = false;
                            toasterService.success(previewContent.message.RETIRE_CONTENT.SUCCESS);
                            $state.go($stateParams.backState);
                        }, 2000);
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.RETIRE_CONTENT.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.RETIRE_CONTENT.FAILED);
                });
            };

            previewContent.acceptContentFlag = function (contentData) {
                var request = {
                    versionKey: contentData.versionKey
                };
                previewContent.loader = toasterService.loader('', previewContent.message
                                                  .ACCEPT_CONTENT_FLAG.START);

                contentService.acceptContentFlag(request, contentData.identifier).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        previewContent.loader.showLoader = false;
                        previewContent.isShowFlagActionButton = false;
                        previewContent.contentData.status = 'FlagDraft';
                        toasterService.success(previewContent.message.ACCEPT_CONTENT_FLAG.SUCCESS);
                        //     $state.go($stateParams.backState);
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.ACCEPT_CONTENT_FLAG.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.ACCEPT_CONTENT_FLAG.FAILED);
                });
            };

            previewContent.discardContentFlag = function (contentData) {
                var request = { };
                previewContent.loader = toasterService.loader('', previewContent.message
                                                     .DISCARD_CONTENT_FLAG.START);

                contentService.discardContentFlag(request, contentData.identifier).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        previewContent.loader.showLoader = false;
                        previewContent.isShowFlagActionButton = false;
                        previewContent.contentData.status = 'Live';
                        toasterService.success(previewContent.message.DISCARD_CONTENT_FLAG.SUCCESS);
                        //     $state.go($stateParams.backState);
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.DISCARD_CONTENT_FLAG.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.DISCARD_CONTENT_FLAG.FAILED);
                });
            };

            previewContent.getConceptsNames = function (concepts) {
                var conceptNames = _.map(concepts, 'name').toString();
                if (conceptNames.length < concepts.length) {
                    var filteredConcepts = _.filter($rootScope.concepts, function (p) {
                        return _.includes(concepts, p.identifier);
                    });
                    conceptNames = _.map(filteredConcepts, 'name').toString();
                }
                return conceptNames;
            };
        }]);
