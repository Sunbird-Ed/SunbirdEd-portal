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
        '$rootScope', '$state', '$sce', 'contentService', 'pdfDelegate', '$timeout', 'config',
        'toasterService', '$scope', function ($stateParams, playerTelemetryUtilsService, $rootScope,
             $state, $sce, contentService, pdfDelegate, $timeout, config, toasterService, $scope) {
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
                previewContent._instance = {
                    id: previewContent.contentData.identifier,
                    ver: previewContent.contentData.pkgVersion
                };

                /**
                 * @event 'sunbird:portal:telemetryend'
                 * Listen for this event to get the telemetry OE_END event from renderer
                 * Player controller dispatching the event subird
                 */
                window.addEventListener('renderer:telemetry:event', function (event) {
                    org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
                                                                    event.detail.telemetryData);
                });

                window.onbeforeunload = function () {
                    playerTelemetryUtilsService.endTelemetry({
                        progress: previewContent.contentProgress
                    });
                };

                if (previewContent.contentData.mimeType === 'application/vnd.ekstep.ecml-archive'
                || previewContent.contentData.mimeType === 'application/vnd.ekstep.html-archive') {
                    previewContent.showIFrameContent = true;
                    var iFrameSrc = config.ekstep_CP_config.baseURL;
                    $timeout(function () {
                        var previewContentIframe = $('#contentViewerIframe')[0];
                        previewContentIframe.src = iFrameSrc;
                        previewContentIframe.onload = function () {
                            var configuration = {};
                            configuration.context = config.ekstep_CP_config.context;
                            configuration.context.contentId = previewContent.contentData.identifier;
                            // TODO: sid,uid,channel
                            configuration.context.sid = 'Sunbird_sid';
                            configuration.context.uid = 'Sunbird_uid';
                            configuration.context.channel = 'Sunbird_channel';
                            configuration.context.dimension = 'Sunbird_dimension';
                            configuration.context.appid = 'Sunbird_appId';
                            configuration.config = config.ekstep_CP_config.config;
                            configuration.context.cdata = {
                                id: $stateParams.courseId, type: 'course'
                            };
                            configuration.plugins = config.ekstep_CP_config.config.plugins;
                            configuration.repos = config.ekstep_CP_config.config.repos;
                            previewContentIframe.contentWindow.initializePreview(configuration);
                        };
                    }, 1000);
                } else {
                    previewContent.showIFrameContent = false;
                    var telemetryInitData = {
                        contentId: previewContent.contentData.identifier
                    };
                    playerTelemetryUtilsService.init(telemetryInitData);
                }
            }

            $scope.initVideoEvents = function (video) {
                var telemetryData = {};
                video.on('play', function () {
                    if (parseInt(this.currentTime(), 10) === 0) {
                        telemetryData = {
                            id: previewContent._instance.id,
                            ver: previewContent._instance.ver,
                            data: { mode: 'play' }
                        };
                        playerTelemetryUtilsService.startTelemetry(telemetryData);
                    } else {
                        telemetryData = {
                            id: previewContent._instance.id,
                            ver: previewContent._instance.ver,
                            type: 'TOUCH',
                            data: { subtype: 'RESUME' } };
                        playerTelemetryUtilsService.updateTelemetry(telemetryData);
                    }
                });
                video.on('pause', function () {
                    telemetryData = {
                        id: previewContent._instance.id,
                        ver: previewContent._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'PAUSE' } };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                });
                video.on('timeupdate', function () {
                    previewContent.contentProgress = parseInt(this.currentTime()
                    * 100 / this.duration(), 10);
                });
                video.on('ended', function () {
                    previewContent.contentProgress = 100;
                    playerTelemetryUtilsService.endTelemetry({
                        progress: previewContent.contentProgress });
                });
                video.on('volumechange', function () {
                    telemetryData = { id: previewContent._instance.id,
                        ver: previewContent._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'VOLUME' } };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                });
                video.on('fullscreenchange', function () {
                    telemetryData = {
                        id: previewContent._instance.id,
                        ver: previewContent._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'FULLSCREEN' } };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                });
            };

        function showLoaderWithMessage(showMetaLoader, messageClass, message, closeButton, tryAgainButton) { //eslint-disable-line
            var error = {};
            error.showError = true;
            error.showMetaLoader = showMetaLoader;
            error.messageClass = messageClass;
            error.message = message;
            error.showCloseButton = closeButton;
            error.showTryAgainButton = tryAgainButton;
            previewContent.errorObject = error;
        }

            function getContent(contentId) {
                var req = { contentId: contentId };
                contentService.getById(req).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        previewContent.errorObject = {};
                        showPlayer(response.result.content);
                    } else {
                        var message = $rootScope.errorMessages.COMMON.UNABLE_TO_PLAY;
                        showLoaderWithMessage(false, 'red', message, true, true);
                    }
                }).catch(function () {
                    var message = $rootScope.errorMessages.COMMON.UNABLE_TO_PLAY;
                    showLoaderWithMessage(false, 'red', message, true, true);
                });
            }

            previewContent.closePreview = function () {
                previewContent.errorObject = {};
                playerTelemetryUtilsService.endTelemetry({
                    progress: previewContent.contentProgress
                });
                window.removeEventListener('renderer:telemetry:event', function () {});
                $state.go($stateParams.backState);
            };

            previewContent.tryAgain = function () {
                previewContent.errorObject = {};
                getContent(previewContent.contentId);
            };

            previewContent.zoomIn = function () {
                pdfDelegate.$getByHandle('content-player').zoomIn();
                var telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    type: 'ZOOM',
                    subtype: '',
                    data: { stageId: previewContent.getCurrentPage }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            };

            previewContent.zoomOut = function () {
                pdfDelegate.$getByHandle('content-player').zoomOut();
                var telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    type: 'ZOOM',
                    subtype: '',
                    data: { stageId: previewContent.getCurrentPage }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            };

            previewContent.previous = function () {
                var telemetryData = {};
                pdfDelegate.$getByHandle('content-player').prev();
                previewContent.getCurrentPage = previewContent.getCurrentPage > 1 ?
                                previewContent.getCurrentPage - 1 : previewContent.getCurrentPage;
                telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    type: 'TOUCH',
                    subtype: '',
                    data: { stageId: previewContent.getCurrentPage }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
                telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    stageid: previewContent.getCurrentPage + 1,
                    stageto: previewContent.getCurrentPage,
                    data: {}
                };
                playerTelemetryUtilsService.navigateTelemetry(telemetryData);
            };

            previewContent.next = function () {
                var telemetryData = {};
                pdfDelegate.$getByHandle('content-player').next();
                previewContent.getCurrentPage = previewContent.getCurrentPage <
                                previewContent.totalPageNumber ? previewContent.getCurrentPage + 1
                                : previewContent.getCurrentPage;
                telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    type: 'TOUCH',
                    subtype: '',
                    data: { stageId: previewContent.getCurrentPage }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
                telemetryNavData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    stageid: previewContent.getCurrentPage - 1,
                    stageto: previewContent.getCurrentPage,
                    data: {}
                };
                playerTelemetryUtilsService.navigateTelemetry(telemetryNavData);
                previewContent.contentProgress = previewContent.getCurrentPage *
                                                 100 / previewContent.totalPageNumber;
                if (previewContent.getCurrentPage === previewContent.totalPageNumber) {
                    playerTelemetryUtilsService.endTelemetry({
                        progress: previewContent.contentProgress
                    });
                }
            };

            previewContent.rotate = function () {
                pdfDelegate.$getByHandle('content-player').rotate();
                var telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    type: 'ROTATE',
                    subtype: '',
                    data: { stageId: previewContent.getCurrentPage }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            };

            previewContent.goToPage = function (pageNumber) {
                if (pageNumber > previewContent.getCurrentPage) {
                    previewContent.contentProgress = previewContent.getCurrentPage *
                                                        100 / previewContent.totalPageNumber;
                }
                var telemetryNavData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    stageid: previewContent.getCurrentPage,
                    stageto: pageNumber,
                    data: {}
                };
                pdfDelegate.$getByHandle('content-player').goToPage(pageNumber);
                previewContent.getCurrentPage = pageNumber;
                var telemetryData = {
                    id: previewContent._instance.id,
                    ver: previewContent._instance.ver,
                    type: 'TOUCH',
                    subtype: '',
                    data: { stageId: previewContent.getCurrentPage }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
                playerTelemetryUtilsService.navigateTelemetry(telemetryNavData);
            };

            previewContent.getTotalPage = function () {
                $timeout(function () {
                    previewContent.totalPageNumber =
                    pdfDelegate.$getByHandle('content-player').getPageCount();
                    previewContent.getCurrentPage =
                    pdfDelegate.$getByHandle('content-player').getCurrentPage();
                    var telemetryData = {
                        id: previewContent._instance.id,
                        ver: previewContent._instance.ver,
                        data: { mode: 'play', stageid: 1 }
                    };
                    playerTelemetryUtilsService.startTelemetry(telemetryData);
                }, 1000);
            };

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
                contentService.retire(previewContent.contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        previewContent.loader.showLoader = false;
                        previewContent.isShowDeleteButton = false;
                        previewContent.isShowFlagActionButton = false;
                        toasterService.success(previewContent.message.RETIRE_CONTENT.SUCCESS);
//                $state.go("WorkSpace.PublishedContent");
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
                        previewContent.contentData.status = 'DraftFlag';
                        toasterService.success(previewContent.message.ACCEPT_CONTENT_FLAG.SUCCESS);
//                $state.go("WorkSpace.FlaggedContent");
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
                        toasterService.success(previewContent.message.DISCARD_CONTENT_FLAG.SUCCESS);
//                $state.go("WorkSpace.PublishedContent");
                    } else {
                        previewContent.loader.showLoader = false;
                        toasterService.error(previewContent.message.DISCARD_CONTENT_FLAG.FAILED);
                    }
                }).catch(function () {
                    previewContent.loader.showLoader = false;
                    toasterService.error(previewContent.message.DISCARD_CONTENT_FLAG.FAILED);
                });
            };
        }]);
