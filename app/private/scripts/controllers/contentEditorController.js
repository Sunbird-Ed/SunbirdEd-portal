'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentEditorController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentEditorController', function (config, $stateParams,
        ToasterService, $sce, $state, contentService, $timeout, $rootScope) {
        var contentEditor = this;
        contentEditor.contentId = $stateParams.contentId;
        contentEditor.openContentEditor = function () {
            window.context = {
                user: {
                    id: $rootScope.userId,
                    name: $rootScope.firstName + ' ' + $rootScope.lastName
                },
                sid: $rootScope.sessionId,
                contentId: contentEditor.contentId,
                pdata: {
                    id: org.sunbird.portal.appid,
                    ver: '1.0'
                },
                etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
                channel: org.sunbird.portal.channel
            };
            window.config = {
                baseURL: '',
                modalId: 'contentEditor',
                apislug: '/action',
                alertOnUnload: true,
                headerLogo:
                !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
                aws_s3_urls:
                ['https://s3.ap-south-1.amazonaws.com/ekstep-public-'
                + org.sunbird.portal.ekstep_env
                + '/', 'https://ekstep-public-'
                + org.sunbird.portal.ekstep_env
                + '.s3-ap-south-1.amazonaws.com/'],
                plugins: [
                    {
                        id: 'org.ekstep.sunbirdheader',
                        ver: '1.0',
                        type: 'plugin'
                    }
                ],
                dispatcher: 'local',
                localDispatcherEndpoint: '/content-editor/telemetry'
            };
            $('#contentEditor').iziModal({
                title: '',
                iframe: true,
                iframeURL:
                '/thirdparty/bower_components/content-editor-iframe/index.html',
                navigateArrows: false,
                fullscreen: false,
                openFullscreen: true,
                closeOnEscape: false,
                overlayClose: false,
                overlay: false,
                overlayColor: '',
                onClosed: function () {
                    $state.go('EditContent', {
                        contentId: contentEditor.contentId
                    });
                }
            });
            $timeout(function () {
                $('#contentEditor').iziModal('open');
            }, 100);
        };

        var validateModal = {
            state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent'],
            status: ['Review', 'Draft', 'Live'],
            mimeType: config.CreateLessonMimeType
        };

        contentEditor.validateRequest = function (reqData, validateData) {
            var status = reqData.status;
            var createdBy = reqData.createdBy;
            var state = reqData.state;
            var userId = reqData.userId;
            var validateDataStatus = validateData.status;
            if (reqData.mimeType === validateData.mimeType) {
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
        };

        contentService.getContentData = function () {
            var req = { contentId: contentEditor.contentId };
            var qs = { fields: 'createdBy,status,mimeType' };

            contentService.getById(req, qs).then(function (response) {
                if (response && response.responseCode === 'OK') {
                    var rspData = response.result.content;
                    rspData.state = $stateParams.state;
                    rspData.userId = $rootScope.userId;

                    if (contentEditor.validateRequest(rspData, validateModal)) {
                        contentEditor.openContentEditor();
                    } else {
                        ToasterService
                        .warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                        $state.go('Home');
                    }
                } else {
                    ToasterService
                    .warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                    $state.go('Home');
                }
            });
        };

        contentEditor.init = function () {
            org.sunbird.portal.eventManager
            .addEventListener('sunbird:portal:editor:editmeta', function () {
                var params = { contentId: contentEditor.contentId };
                $state.go('EditContent', params);
            });

            org.sunbird.portal.eventManager
            .addEventListener('sunbird:portal:editor:close', function () {
                $state.go('WorkSpace.DraftContent');
            });

            org.sunbird.portal.eventManager
            .addEventListener('sunbird:portal:content:review',
            function (event, data) { //eslint-disable-line
                var params = {
                    contentId: contentEditor.contentId,
                    backState: $state.current.name };
                $state.go('EditContent', params);
            });

            window.addEventListener('editor:metadata:edit',
            function (event, data) { //eslint-disable-line
                org.sunbird.portal.eventManager
                .dispatchEvent('sunbird:portal:editor:editmeta');
            });

            window.addEventListener('editor:window:close',
            function (event, data) { //eslint-disable-line
                org.sunbird.portal.eventManager
                .dispatchEvent('sunbird:portal:editor:close');
            });

            window.addEventListener('editor:content:review',
            function (event, data) { //eslint-disable-line
                org.sunbird.portal.eventManager
                .dispatchEvent('sunbird:portal:content:review',
                event.detail.contentId);
            });
        };

        contentEditor.init();
//        contentEditor.openContentEditor();
        contentService.getContentData();
    });
