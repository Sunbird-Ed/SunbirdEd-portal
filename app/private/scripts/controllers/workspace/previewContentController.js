'use strict';

angular.module('playerApp').controller('PreviewContentController', function (playerTelemetryUtilsService, $stateParams, $rootScope, $state, $sce, contentService, pdfDelegate, $timeout, config) {

    var previewContent = this;
    previewContent.contentProgress = 0;
    previewContent.contentId = $stateParams.contentId;
    previewContent.userId = $rootScope.userId;
    previewContent.isShowPublishRejectButton = $stateParams.backState === "WorkSpace.UpForReviewContent" ? true : false;

    function showPlayer(data) {
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
        window.addEventListener('renderer:telemetry:event', function (event, data) {
            console.info('Telemetry events', event.detail.telemetryData);
            org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry', event.detail.telemetryData);
        });
        window.onbeforeunload = function (e) {
            playerTelemetryUtilsService.endTelemetry({progress: previewContent.contentProgress});
        }


        if (previewContent.contentData.mimeType === 'application/vnd.ekstep.ecml-archive' || previewContent.contentData.mimeType === 'application/vnd.ekstep.html-archive') {
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
                    configuration.context.channel = 'Sunbird_channel',
                            configuration.context.dimension = 'Sunbird_dimension',
                            configuration.context.appid = 'Sunbird_appId',
                            configuration.config = config.ekstep_CP_config.config;
                    configuration.context.cdata = {'id': $stateParams.tocId, 'type': 'course'};
                    configuration.plugins = config.ekstep_CP_config.config.plugins;
                    configuration.repos = config.ekstep_CP_config.config.repos;
                    previewContentIframe.contentWindow.initializePreview(configuration);
                };
            }, 1000);
        } else {
            previewContent.showIFrameContent = false;
            var telemetryInitData = {contentId: previewContent.contentData.identifier}
            playerTelemetryUtilsService.init(telemetryInitData);
        }
    }


    previewContent.initVideoEvents = function (video) {

        video.on('play', function () {
            if (parseInt(this.currentTime()) == 0) {
                var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, "data": {"mode": "play"}};
                playerTelemetryUtilsService.startTelemetry(telemetryData);
            } else {
                var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", "data": {subtype: "RESUME"}};
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            }
        });
        video.on('pause', function () {
            var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", "data": {subtype: "PAUSE"}};
            playerTelemetryUtilsService.updateTelemetry(telemetryData);
        });
        video.on('timeupdate', function () {
            previewContent.contentProgress = parseInt(this.currentTime() * 100 / this.duration());
        });
        video.on('ended', function () {
            previewContent.contentProgress = 100;
            playerTelemetryUtilsService.endTelemetry({progress: previewContent.contentProgress});
        });
        video.on('volumechange', function () {
            var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", "data": {subtype: "VOLUME"}};
            playerTelemetryUtilsService.updateTelemetry(telemetryData);
        });
        video.on('fullscreenchange', function () {
            var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", "data": {subtype: "FULLSCREEN"}};
            playerTelemetryUtilsService.updateTelemetry(telemetryData);
        });
    }

    /**
     * This function helps to show loader or any error message at the time of api call.
     * @param {Boolean} showMetaLoader
     * @param {String} messageClass
     * @param {String} message
     */
    function showLoaderWithMessage(showMetaLoader, messageClass, message, closeButton, tryAgainButton) {
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
        var req = {contentId: contentId};
        contentService.getById(req).then(function (response) {
            if (response && response.responseCode === 'OK') {
                previewContent.errorObject = {};
                showPlayer(response.result.content);
            } else {
                var message = 'Unable to play, please try Again or close.';
                showLoaderWithMessage(false, 'red', message, true, true);
            }
        }).catch(function (error) {
            var message = 'Unable to play, please try Again or close.';
            showLoaderWithMessage(false, 'red', message, true, true);
        });
    }

    previewContent.closePreview = function () {
        previewContent.errorObject = {};
        playerTelemetryUtilsService.endTelemetry({progress: previewContent.contentProgress});
        window.removeEventListener('renderer:telemetry:event', function () {
            console.info("event is removed.");
        });
        $state.go($stateParams.backState);
    };

    previewContent.tryAgain = function () {
        previewContent.errorObject = {};
        getContent(previewContent.id);
    };

    previewContent.zoomIn = function () {
        pdfDelegate.$getByHandle('content-player').zoomIn();
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "ZOOM", subtype: "", "data": {"stageId": previewContent.getCurrentPage}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };
    previewContent.zoomOut = function () {
        pdfDelegate.$getByHandle('content-player').zoomOut();
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "ZOOM", subtype: "", "data": {"stageId": previewContent.getCurrentPage}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };

    previewContent.previous = function () {
        pdfDelegate.$getByHandle('content-player').prev();
        previewContent.getCurrentPage = previewContent.getCurrentPage > 1 ? previewContent.getCurrentPage - 1 : previewContent.getCurrentPage;
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", subtype: "", "data": {"stageId": previewContent.getCurrentPage}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, "stageid": previewContent.getCurrentPage + 1, "stageto": previewContent.getCurrentPage, "data": {}};
        playerTelemetryUtilsService.navigateTelemetry(telemetryData);
    };

    previewContent.next = function () {
        pdfDelegate.$getByHandle('content-player').next();
        previewContent.getCurrentPage = previewContent.getCurrentPage < previewContent.totalPageNumber ? previewContent.getCurrentPage + 1 : previewContent.getCurrentPage;
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", subtype: "", "data": {"stageId": previewContent.getCurrentPage}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
        var telemetryNavData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, "stageid": previewContent.getCurrentPage - 1, "stageto": previewContent.getCurrentPage, "data": {}};
        playerTelemetryUtilsService.navigateTelemetry(telemetryNavData);
        previewContent.contentProgress = previewContent.getCurrentPage * 100 / previewContent.totalPageNumber;
        if (previewContent.getCurrentPage == previewContent.totalPageNumber) {
            playerTelemetryUtilsService.endTelemetry({progress: previewContent.contentProgress});
        }
    };

    previewContent.rotate = function () {
        pdfDelegate.$getByHandle('content-player').rotate();
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "ROTATE", subtype: "", "data": {"stageId": previewContent.getCurrentPage}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };

    previewContent.goToPage = function (pageNumber) {
        if (pageNumber > previewContent.getCurrentPage) {
            previewContent.contentProgress = previewContent.getCurrentPage * 100 / previewContent.totalPageNumber;
        }
        var telemetryNavData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, "stageid": previewContent.getCurrentPage, "stageto": pageNumber, "data": {}};
        pdfDelegate.$getByHandle('content-player').goToPage(pageNumber);
        previewContent.getCurrentPage = pageNumber;
        var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, type: "TOUCH", subtype: "", "data": {"stageId": previewContent.getCurrentPage}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
        playerTelemetryUtilsService.navigateTelemetry(telemetryNavData);
    };

    previewContent.getTotalPage = function () {
        $timeout(function () {
            previewContent.totalPageNumber = pdfDelegate.$getByHandle('content-player').getPageCount();
            previewContent.getCurrentPage = pdfDelegate.$getByHandle('content-player').getCurrentPage();
            var telemetryData = {"id": previewContent._instance.id, "ver": previewContent._instance.ver, "data": {"mode": "play", "stageid": 1}};
            playerTelemetryUtilsService.startTelemetry(telemetryData);
        }, 2000);
    };

    getContent(previewContent.contentId);

    /**
     * This function helps to show loader with message.
     * @param {String} headerMessage
     * @param {String} loaderMessage
     */
    function showLoader(headerMessage, loaderMessage) {
        var loader = {};
        loader.showLoader = true;
        loader.headerMessage = headerMessage;
        loader.loaderMessage = loaderMessage;
        return loader;
    }

    /**
     * This function called when api failed, and its show failed response for 2 sec.
     * @param {String} message
     */
    function showErrorMessage(isClose, message, messageType) {
        var error = {};
        error.showError = true;
        error.isClose = isClose;
        error.message = message;
        error.messageType = messageType;
        return error;
    }


    previewContent.publishContent = function () {
        var request = {
            content: {
                "lastPublishedBy": previewContent.userId
            }
        };

        var api = "previewContentApi";
        previewContent[api] = {};
        previewContent[api].loader = showLoader("", $rootScope.errorMessages.WORKSPACE.PUBLISH_CONTENT.START);

        contentService.publish(request, previewContent.contentId).then(function (res) {
            if (res && res.responseCode === 'OK') {
                previewContent[api].loader.showLoader = false;
                $state.go("WorkSpace.UpForReviewContent")
            } else {
                previewContent[api].loader.showLoader = false;
                previewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.PUBLISH_CONTENT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            }
        }).catch(function (error) {
            previewContent[api].loader.showLoader = false;
            previewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.PUBLISH_CONTENT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
        });
    };

    previewContent.rejectContent = function () {
        
        var api = "previewContentApi";
        previewContent[api] = {};
        previewContent[api].loader = showLoader("", $rootScope.errorMessages.WORKSPACE.REJECT_CONTENT.START);
        
        var request = {};

        contentService.reject(request, previewContent.contentId).then(function (res) {
            if (res && res.responseCode === 'OK') {
                previewContent[api].loader.showLoader = false;
                $state.go("WorkSpace.UpForReviewContent");
            } else {
                previewContent[api].loader.showLoader = false;
                previewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REJECT_CONTENT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            }
        }).catch(function (error) {
            previewContent[api].loader.showLoader = false;
            previewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REJECT_CONTENT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
        });
    };


});
