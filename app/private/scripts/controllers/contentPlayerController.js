'use strict';

angular.module('playerApp')
    .controller('contentPlayerCtrl', ['playerTelemetryUtilsService', '$state', '$scope',
        'contentService', 'pdfDelegate', '$timeout', '$stateParams', 'config', '$rootScope',
        function (playerTelemetryUtilsService, $state, $scope, contentService, pdfDelegate,
        $timeout, $stateParams, config, $rootScope) {
            $scope.isClose = $scope.isclose;
            $scope.isHeader = $scope.isheader;
            $scope.showModalInLectureView = true;
            $scope.contentProgress = 0;

            function showPlayer(data) {
                $scope.contentData = data;
                $scope._instance = {
                    id: $scope.contentData.identifier,
                    ver: $scope.contentData.pkgVersion
                };
                $scope.showMetaData = $scope.isshowmetaview;
                $rootScope.contentId = $scope.contentData.identifier;

            /**
             * @event 'sunbird:portal:telemetryend'
             * Listen for this event to get the telemetry OE_END event
             * from renderer
             * Player controller dispatching the event sunbird
             */
                window.addEventListener('renderer:telemetry:event',function (event, data) { // eslint-disable-line
                    org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
                    event.detail.telemetryData);
                });
                window.onbeforeunload = function (e) { // eslint-disable-line
                    playerTelemetryUtilsService.endTelemetry({ progress: $scope.contentProgress });
                };

                if ($scope.contentData.mimeType === 'application/vnd.ekstep.ecml-archive' ||
                    $scope.contentData.mimeType === 'application/vnd.ekstep.html-archive') {
                    $scope.showIFrameContent = true;
                    var iFrameSrc = config.ekstep_CP_config.baseURL;
                    $timeout(function () {
                        var previewContentIframe = $('#contentViewerIframe')[0];
                        previewContentIframe.src = iFrameSrc;
                        previewContentIframe.onload = function () {
                            var configuration = {};
                            configuration.context = config.ekstep_CP_config.context;
                            configuration.context.contentId = $scope.contentData.identifier;
                            configuration.context.sid = $rootScope.sessionId;
                            configuration.context.uid = $rootScope.userId;
                            configuration.context.channel = org.sunbird.portal.channel;
                            if (_.isUndefined($stateParams.courseId)) {
                                configuration.context.dims = org.sunbird.portal.dims;
                            } else {
                                var cloneDims = _.cloneDeep(org.sunbird.portal.dims);
                                cloneDims.push($stateParams.courseId);
                                configuration.context.dims = cloneDims;
                            }
                            configuration.context.app = [org.sunbird.portal.appid];
                            configuration.context.partner = [];
                            configuration.config = config.ekstep_CP_config.config;
                            configuration.context.cdata = [{
                                id: $stateParams.courseId,
                                type: 'course'
                            }];
                            configuration.plugins = config.ekstep_CP_config.config.plugins;
                            configuration.repos = config.ekstep_CP_config.config.repos;
                            previewContentIframe.contentWindow.initializePreview(configuration);
                        };
                    }, 1000);
                } else {
                    $scope.showIFrameContent = false;
                    var telemetryInitData = { contentId: $scope.contentData.identifier };
                    playerTelemetryUtilsService.init(telemetryInitData);
                }
            }

            $scope.initVideoEvents = function (video) {
                $rootScope.videoElem = video;
                var telemetryData = {};

                video.on('play', function () {
                if (parseInt(this.currentTime()) === 0) { //eslint-disable-line
                    telemetryData = {
                        id: $scope._instance.id,
                        ver: $scope._instance.ver,
                        data: { mode: 'play' }
                    };
                    playerTelemetryUtilsService.startTelemetry(telemetryData);
                } else {
                    telemetryData = {
                        id: $scope._instance.id,
                        ver: $scope._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'RESUME' }
                    };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                }
                });

                video.on('pause', function () {
                    telemetryData = {
                        id: $scope._instance.id,
                        ver: $scope._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'PAUSE' }
                    };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                });

                video.on('timeupdate', function () {
                $scope.contentProgress = parseInt(this.currentTime() * 100 / this.duration());// eslint-disable-line
                });

                video.on('ended', function () {
                    $scope.contentProgress = 100;
                    playerTelemetryUtilsService.endTelemetry({ progress: $scope.contentProgress });
                });

                video.on('volumechange', function () {
                    telemetryData = {
                        id: $scope._instance.id,
                        ver: $scope._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'VOLUME' }
                    };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                });

                video.on('fullscreenchange', function () {
                    telemetryData = {
                        id: $scope._instance.id,
                        ver: $scope._instance.ver,
                        type: 'TOUCH',
                        data: { subtype: 'FULLSCREEN' }
                    };
                    playerTelemetryUtilsService.updateTelemetry(telemetryData);
                });
            };

            function showLoaderWithMessage(showMetaLoader, message, closeButton, tryAgainButton) {
                var error = {};
                error.showError = true;
                error.showMetaLoader = showMetaLoader;
                error.messageClass = 'red';
                error.message = message;
                error.showCloseButton = closeButton;
                error.showTryAgainButton = tryAgainButton;
                $scope.errorObject = error;
            }

            function getContent(contentId) {
                var req = { contentId: contentId };
                contentService.getById(req).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        $scope.errorObject = {};
                        showPlayer(response.result.content);
                    } else {
                        var message = $rootScope.errorMessages.COMMON.UNABLE_TO_PLAY;
                        showLoaderWithMessage(false, message, true, true);
                    }
                }).catch(function () {
                    var message = $rootScope.errorMessages.COMMON.UNABLE_TO_PLAY;
                    showLoaderWithMessage(false, message, true, true);
                });
            }

            $scope.close = function () {
                if ($scope.closeurl) {
                    if ($rootScope.search.searchKeyword !== '') {
                        $timeout(function () {
                            $rootScope.$emit('initSearch', {});
                        }, 0);
                    } else {
                        $state.go($scope.closeurl);
                    }
                }
                $scope.errorObject = {};
                if ($scope.id) {
                    $scope.id = '';
                }
                if ($scope.body) {
                    $scope.body = {};
                }

                $scope.visibility = false;
                playerTelemetryUtilsService.endTelemetry({ progress: $scope.contentProgress });
                window.removeEventListener('renderer:telemetry:event', function () {
                    org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
                                                    event.detail.telemetryData);
                });
                $('#dropdownId').dropdown('restore defaults');
            };

            $scope.updateContent = function (scope) {
                if (scope.body) {
                    showPlayer(scope.body);
                } else if (scope.id) {
                    getContent(scope.id);
                }
            };

            $scope.tryAgain = function () {
                $scope.errorObject = {};
                getContent($scope.id);
            };

            $scope.zoomIn = function () {
                pdfDelegate.$getByHandle('content-player').zoomIn();
                var telemetryData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    type: 'ZOOM',
                    subtype: '',
                    data: { stageId: $scope.getCurrentPage.toString() }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            };

            $scope.zoomOut = function () {
                pdfDelegate.$getByHandle('content-player').zoomOut();
                var telemetryData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    type: 'ZOOM',
                    subtype: '',
                    data: { stageId: $scope.getCurrentPage.toString() }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            };

            $scope.previous = function () {
                var telemetryData = {};

                pdfDelegate.$getByHandle('content-player').prev();
                $scope.getCurrentPage
            = $scope.getCurrentPage > 1
            ? $scope.getCurrentPage - 1 : $scope.getCurrentPage;

                telemetryData = { id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    type: 'TOUCH',
                    subtype: '',
                    data: { stageId: $scope.getCurrentPage.toString() }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
                telemetryData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    stageid: ($scope.getCurrentPage + 1).toString(),
                    stageto: $scope.getCurrentPage.toString(),
                    data: {}
                };
                playerTelemetryUtilsService.navigateTelemetry(telemetryData);
            };

            $scope.next = function () {
                pdfDelegate.$getByHandle('content-player').next();

                $scope.getCurrentPage = $scope.getCurrentPage < $scope.totalPageNumber
                                        ? $scope.getCurrentPage + 1 : $scope.getCurrentPage;

                var telemetryData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    type: 'TOUCH',
                    subtype: '',
                    data: { stageId: $scope.getCurrentPage ? $scope.getCurrentPage.toString() : '' }
                };

                playerTelemetryUtilsService.updateTelemetry(telemetryData);
                var telemetryNavData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    stageid: ($scope.getCurrentPage - 1).toString(),
                    stageto: $scope.getCurrentPage ? $scope.getCurrentPage.toString() : '',
                    data: {}
                };
                playerTelemetryUtilsService.navigateTelemetry(telemetryNavData);
                $scope.contentProgress = $scope.getCurrentPage * 100 / $scope.totalPageNumber;
                if ($scope.getCurrentPage === $scope.totalPageNumber) {
                    playerTelemetryUtilsService.endTelemetry({
                        progress: $scope.contentProgress
                    });
                }
            };

            $scope.rotate = function () {
                pdfDelegate.$getByHandle('content-player').rotate();
                var telemetryData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    type: 'ROTATE',
                    subtype: '',
                    data: { stageId: $scope.getCurrentPage.toString() }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
            };

            $scope.goToPage = function (pageNumber) {
                if (pageNumber > $scope.getCurrentPage) {
                    $scope.contentProgress = $scope.getCurrentPage * 100 / $scope.totalPageNumber;
                }
                var telemetryNavData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    stageid: $scope.getCurrentPage ? $scope.getCurrentPage.toString() : '',
                    stageto: pageNumber ? pageNumber.toString() : '',
                    data: {}
                };
                pdfDelegate.$getByHandle('content-player').goToPage(pageNumber);
                $scope.getCurrentPage = pageNumber;
                var telemetryData = {
                    id: $scope._instance.id,
                    ver: $scope._instance.ver,
                    type: 'TOUCH',
                    subtype: '',
                    data: { stageId: $scope.getCurrentPage ? $scope.getCurrentPage.toString() : '' }
                };
                playerTelemetryUtilsService.updateTelemetry(telemetryData);
                playerTelemetryUtilsService.navigateTelemetry(telemetryNavData);
            };

            $scope.getTotalPage = function () {
                $timeout(function () {
                    $scope.totalPageNumber = pdfDelegate.$getByHandle('content-player')
                                                        .getPageCount();
                    $scope.getCurrentPage = pdfDelegate.$getByHandle('content-player')
                                                        .getCurrentPage();
                    var telemetryData = {
                        id: $scope._instance.id,
                        ver: $scope._instance.ver,
                        data: { mode: 'play', stageid: '1' }
                    };
                    playerTelemetryUtilsService.startTelemetry(telemetryData);
                }, 1000);
            };
        }]);
