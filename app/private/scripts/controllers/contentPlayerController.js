'use strict';

angular.module('playerApp').controller('contentPlayerCtrl', function (playerTelemetryUtilsService, $state, $scope, $sce, contentService, pdfDelegate, $timeout, config) {
    var player = this;
    $scope.isClose = $scope.isclose;
    $scope.isHeader = $scope.isheader;
    $scope.showModalInLectureView = true;

    $scope.updateDataOnWatch = function (scope) {
        if (scope.body) {
            showPlayer(scope.body);
        } else if (scope.id) {
            getContent(scope.id);
        }
    };

    function showPlayer(data) {
        $scope.contentData = data;
        $scope._instance = {
            id: $scope.contentData.identifier,
            ver: $scope.contentData.pkgVersion
        };
        $scope.showMetaData = $scope.isshowmetaview;
        /**
         * @event 'sunbird:portal:telemetryend' 
         * Listen for this event to get the telemetry OE_END event from renderer
         * Player controller dispatching the event subird 
         */
        window.addEventListener('renderer:telemetryevent:end', function (event, data) {
            console.info('OE_END event:', event.detail.telemetryData);
            org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:telemetryend', event.detail.telemetryData);
        });

        if ($scope.contentData.mimeType === 'application/vnd.ekstep.ecml-archive' || $scope.contentData.mimeType === 'application/vnd.ekstep.html-archive') {
            $scope.showIFrameContent = true;
            var iFrameSrc = config.ekstep_CP_config.baseURL;
            $timeout(function () {
                var previewContentIframe = $('#contentViewerIframe')[0];
                previewContentIframe.src = iFrameSrc;
                previewContentIframe.onload = function () {
                    var configuration = {};
                    configuration.context = config.ekstep_CP_config.context;
                    configuration.context.contentId = $scope.contentData.identifier;
                    // TODO: sid,uid,channel 
                    configuration.context.sid = 'Sunbird_sid';
                    configuration.context.uid = 'Sunbird_uid';
                    configuration.context.channel = 'Sunbird_channel',
                            configuration.context.dimension = 'Sunbird_dimension',
                            configuration.context.appid = 'Sunbird_appId',
                            configuration.config = config.ekstep_CP_config.config;
                    configuration.plugins = config.ekstep_CP_config.config.plugins;
                    configuration.repos = config.ekstep_CP_config.config.repos;
                    previewContentIframe.contentWindow.initializePreview(configuration);
                };
            }, 1000);
        } else {
            $scope.showIFrameContent = false;
            var telemetryInitData = {contentId: $scope.contentData.identifier}
            playerTelemetryUtilsService.init(telemetryInitData);
        }
    }


    $scope.initVideoEvents = function (video) {

        video.on('play', function () {
            if (parseInt(this.currentTime()) == 0) {
                var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, "data": {"mode": "play"}};
                playerTelemetryUtilsService.startTelemetry(telemetryData);
            } else {
                var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "TOUCH", subtype: "RESUME", "data": {}};
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            }
        });
        video.on('pause', function () {
            var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "TOUCH", subtype: "PAUSE", "data": {}};
            playerTelemetryUtilsService.updateTelemetry(telemetryData);
        });

        video.on('ended', function () {
            playerTelemetryUtilsService.endTelemetry();
        });
        video.on('volumechange', function () {
            var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "TOUCH", subtype: "VOLUME", "data": {}};
            playerTelemetryUtilsService.updateTelemetry(telemetryData);
        });
        video.on('fullscreenchange', function () {
            var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "TOUCH", subtype: "FULLSCREEN", "data": {}};
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
        $scope.errorObject = error;
    }

    function getContent(contentId) {
        var req = {contentId: contentId};
        contentService.getById(req).then(function (response) {
            if (response && response.responseCode === 'OK') {
                $scope.errorObject = {};
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

    $scope.close = function () {
        if ($scope.closeurl)
        {
            $state.go($scope.closeurl);
        }
        $scope.errorObject = {};
        if ($scope.id) {
            $scope.id = '';
        }
        if ($scope.body) {
            $scope.body = {};
        }

        $scope.visibility = false;
        playerTelemetryUtilsService.endTelemetry();
    };
    $scope.tryAgain = function () {
        $scope.errorObject = {};
        getContent($scope.id);
    };
    $scope.zoomIn = function () {
        pdfDelegate.$getByHandle('content-player').zoomIn();
        var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "ZOOM", subtype: "", "data": {}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };
    $scope.zoomOut = function () {
        pdfDelegate.$getByHandle('content-player').zoomOut();
        var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "ZOOM", subtype: "", "data": {}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };
    $scope.previous = function () {
        pdfDelegate.$getByHandle('content-player').prev();
        $scope.getCurrentPage = $scope.getCurrentPage > 1 ? $scope.getCurrentPage - 1 : $scope.getCurrentPage;
        var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "OTHER", subtype: "", "data": {}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };
    $scope.next = function () {
        pdfDelegate.$getByHandle('content-player').next();
        $scope.getCurrentPage = $scope.getCurrentPage < $scope.totalPageNumber ? $scope.getCurrentPage + 1 : $scope.getCurrentPage;
        var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "OTHER", subtype: "", "data": {}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
        if ($scope.getCurrentPage == $scope.totalPageNumber) {
            playerTelemetryUtilsService.endTelemetry();
        }
    };
    $scope.rotate = function () {
        pdfDelegate.$getByHandle('content-player').rotate();
        var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "ROTATE", subtype: "", "data": {}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };
    $scope.goToPage = function (pageNumber) {
        pdfDelegate.$getByHandle('content-player').goToPage(pageNumber);
        $scope.getCurrentPage = pageNumber;
        var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, type: "OTHER", subtype: "", "data": {}};
        playerTelemetryUtilsService.updateTelemetry(telemetryData);
    };
    $scope.getTotalPage = function () {
        $timeout(function () {
            $scope.totalPageNumber = pdfDelegate.$getByHandle('content-player').getPageCount();
            $scope.getCurrentPage = pdfDelegate.$getByHandle('content-player').getCurrentPage();
            var telemetryData = {"id": $scope._instance.id, "ver": $scope._instance.ver, "data": {"mode": "play"}};
            playerTelemetryUtilsService.startTelemetry(telemetryData);
        }, 2000);
    };


});
