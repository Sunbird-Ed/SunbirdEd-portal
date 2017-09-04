'use strict';

angular.module('loginApp')
    .controller('contentPlayerCtrl', ['playerTelemetryUtilsService', '$state', '$scope',
        '$timeout', '$stateParams', '$rootScope', 'config', 'contentService', 'toasterService',
        function (playerTelemetryUtilsService, $state, $scope,
        $timeout, $stateParams, $rootScope, config, contentService, toasterService) {
            $scope.isHeader = $scope.isheader;
            $scope.isClose = $scope.isclose;
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
                        // configuration.context.channel = org.sunbird.portal.channel;
                        // if (_.isUndefined($stateParams.courseId)) {
                        //     configuration.context.dims = org.sunbird.portal.dims;
                        // } else {
                        //     var cloneDims = _.cloneDeep(org.sunbird.portal.dims);
                        //     cloneDims.push($stateParams.courseId);
                        //     configuration.context.dims = cloneDims;
                        // }
                        // configuration.context.app = [org.sunbird.portal.appid];
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
                }, 1000);
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
                        if (config.CONTENT_TYPE.resource.indexOf(response.result.content.contentType) === -1) {
                            toasterService.warning('Invalid content access');
                            $state.go('Landing');
                        }
                        $scope.errorObject = {};
                        if (response.result.content.mimeType === config.MIME_TYPE.collection) {
                            var contentData = response.result.content;
                            window.localStorage.setItem('redirectUrl', '/preview/collection/' + contentId + '/' + contentData.name + '/');
                            $state.go('PublicCollection', { contentId: contentData.identifier, name: contentData.name });
                        } else {
                            showPlayer(response.result.content);
                            if (!$scope.isClose) {
                                $rootScope.titleName = response.result.content.name;
                                window.localStorage.setItem('redirectUrl', '/content/' + contentId + '/' + response.result.content.name);
                            }
                        }
                    } else {
                        toasterService.error($rootScope.errorMessages.Content.Failed);
                        $state.go('Landing');
                    }
                }).catch(function () {
                    toasterService.error($rootScope.errorMessages.Content.Failed);
                    $state.go('Landing');
                });
            }

            $scope.close = function () {
                $scope.visibility = false;
                // playerTelemetryUtilsService.endTelemetry({ progress: $scope.contentProgress });
                // window.removeEventListener('renderer:telemetry:event', function () {
                //     org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
                //                                     event.detail.telemetryData);
                // });
            };

            $scope.init = function () {
                $scope.errorObject = {};
                getContent($scope.id);
            };
        }]);
