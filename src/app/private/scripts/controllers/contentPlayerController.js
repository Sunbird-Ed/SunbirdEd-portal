'use strict';

angular.module('playerApp')
    .controller('contentPlayerCtrl', ['playerTelemetryUtilsService', '$state', '$scope',
        'contentService', '$timeout', '$stateParams', 'config', '$rootScope',
        function (playerTelemetryUtilsService, $state, $scope, contentService,
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
                document.getElementById('contentPlayer').addEventListener('renderer:telemetry:event',function (event, data) { // eslint-disable-line
                    org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
                    event.detail.telemetryData);
                });
                window.onbeforeunload = function (e) { // eslint-disable-line
                    playerTelemetryUtilsService.endTelemetry({ progress: $scope.contentProgress });
                };
                $scope.showIFrameContent = true;
                var iFrameSrc = config.ekstep_CP_config.baseURL;
                $timeout(function () {
                    var previewContentIframe = $('#contentViewerIframe')[0];
                    previewContentIframe.src = iFrameSrc;
                    previewContentIframe.onload = function () {
                        var playerWidth = $('#contentViewerIframe').width();
                        if (playerWidth) {
                            var height = playerWidth * (9 / 16);
                            $('#contentViewerIframe').css('height', height + 'px');
                        }
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
                            cloneDims.push($rootScope.batchHashTagId);
                            configuration.context.dims = cloneDims;
                        }
                        configuration.context.app = [org.sunbird.portal.appid];
                        configuration.context.partner = [];
                        configuration.context.cdata = [{
                            id: $stateParams.courseId,
                            type: 'course'
                        }];
                        configuration.config = config.ekstep_CP_config.config;
                        configuration.config.plugins = config.ekstep_CP_config.config.plugins;
                        configuration.config.repos = config.ekstep_CP_config.config.repos;
                        configuration.metadata = $scope.contentData;
                        configuration.data = $scope.contentData.mimeType !== config.MIME_TYPE.ecml ?
                                            {} : data.body;
                        previewContentIframe.contentWindow.initializePreview(configuration);
                    };
                }, 0);
            }

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
                var qs = {
                    fields: 'body,editorState,stageIcons,templateId,languageCode,template,' +
                        'gradeLevel,status,concepts,versionKey,name,appIcon,contentType,owner,' +
                        'domain,code,visibility,createdBy,description,language,mediaType,' +
                        'osId,languageCode,createdOn,lastUpdatedOn,audience,ageGroup,' +
                        'attributions,artifactUrl,mimeType'
                };
                contentService.getById(req, qs).then(function (response) {
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
                document.getElementById('contentPlayer').removeEventListener('renderer:telemetry:event', function () {
                    org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
                                                    event.detail.telemetryData);
                }, false);
            };

            $scope.updateContent = function (scope) {
                if (scope.body) {
                    getContent(scope.body.identifier);
                } else if (scope.id) {
                    getContent(scope.id);
                }
            };

            $scope.tryAgain = function () {
                $scope.errorObject = {};
                getContent($scope.id);
            };

            $scope.getConceptsNames = function (concepts) {
                var conceptNames = _.map(concepts, 'name').toString();
                if (concepts && conceptNames.length < concepts.length) {
                    var filteredConcepts = _.filter($rootScope.concepts, function (p) {
                        return _.includes(concepts, p.identifier);
                    });
                    conceptNames = _.map(filteredConcepts, 'name').toString();
                }
                return conceptNames;
            };

            // Restore default values(resume course, view dashboard) onAfterUser leave current state
            $('#courseDropdownValues').dropdown('restore defaults');
        }]);
