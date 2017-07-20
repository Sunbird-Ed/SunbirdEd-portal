'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCreationController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('ContentCreationController', function (contentService, config, $scope, $state, $timeout, $rootScope) {

            var contentCreation = this;
            contentCreation.contentUploadUrl = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX + config.URL.CONTENT.UPLOAD;

            contentCreation.mimeType = [{
                    name: 'Pdf',
                    value: 'application/pdf'
                }, {
                    name: 'Video',
                    value: 'video/mp4'
                }, {
                    name: 'Html Archive',
                    value: 'application/vnd.ekstep.html-archive'
                }];
            contentCreation.youtubeVideoMimeType = {name: 'Youtube Video',
                    value: "video/youtube"};
                
            contentCreation.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
            contentCreation.showContentCreationModal = true;
            contentCreation.userId = $rootScope.userId;
            contentCreation.data = {};

            $timeout(function () {
                contentCreation.manualUploader = new qq.FineUploader({
                    element: document.getElementById('fine-uploader-manual-trigger'),
                    template: 'qq-template-manual-trigger',
                    request: {
                        customHeaders: {
                            cid: "sunbird"
                    },
                        endpoint: contentCreation.contentUploadUrl + '/' + contentCreation.contentId
                    },
                    thumbnails: {
                        placeholders: {
                            waitingPath: '/source/placeholders/waiting-generic.png',
                            notAvailablePath: '/source/placeholders/not_available-generic.png'
                        }
                    },
                    autoUpload: false,
                    debug: true,
                    validation: {
                        acceptFiles: 'application/pdf, video/mp4, application/vnd.ekstep.html-archive, video/youtube'
                    },
                    callbacks: {
                        validate: function(data) {
                            console.log("validate data", data);
                        },
                        onValidate: function (data) {
                            console.log("On validate data", data);
                        },
                        onComplete: function (id, name, responseJSON) {
                            if(responseJSON.success) {
                                contentCreation.editContent(contentCreation.contentId);
                            }
                            console.log("onComplete:", id, name, responseJSON);
                        },
                        onSubmitted: function (id, name) {
                            contentCreation.youtubeFileLink = '';
                            contentCreation.showContentCreationModal = true;
                            contentCreation.uploadedFileId = id;
                            contentCreation.openContentCreationModal();
                            document.getElementById("hide-section-with-button").style.display = 'none';
                        },
                        onError: function (id, name, error) {
                            console.log("onError:", id, name, error);
                        }
                    }
                });
            }, 300);

            contentCreation.editContent = function (contentId) {
                var params = {contentId: contentId}
                $state.go("EditContent", params);
            };

            contentCreation.openContentCreationModal = function () {
                contentCreation.initilizeModal();
            };

            contentCreation.hideContentCreationModal = function () {
                $('#contentCreationModal')
                        .modal('hide');
                $('#contentCreationModal')
                        .modal('hide others');
                $('#contentCreationModal')
                        .modal('hide all');
                $('#contentCreationModal')
                        .modal('hide dimmer');
            };

            contentCreation.clearContentCreationModal = function () {
                if (contentCreation.createApi) {
                    contentCreation.createApi.error = {};
                }
                contentCreation.data = {};
            };

            contentCreation.closeContentCreationModal = function () {
                $timeout(function () {
                    contentCreation.showContentCreationModal = false;
                }, 0);
            };

            contentCreation.initilizeModal = function () {
                $timeout(function () {

                    $('#contentCreationModal').modal({
                        onShow: function () {
                            contentCreation.clearContentCreationModal();
                        },
                        onHide: function () {
                            if (!contentCreation.contentId && !contentCreation.youtubeFileLink) {
                                document.getElementById("hide-section-with-button").style.display = 'block';
                                contentCreation.manualUploader.cancel(contentCreation.uploadedFileId);
                            }
                            contentCreation.clearContentCreationModal();
                            contentCreation.closeContentCreationModal();
                            return;
                        }
                    }).modal('show');
                    $('.singleSelectDropDown')
                            .dropdown('restore defaults');

                    if (contentCreation.youtubeFileLink) {
                        $('#mimeTypeDropDown').dropdown('set text', "Youtube Video");
                        $("#mimeTypeDropDown").dropdown("destroy");
                    }
                }, 10);
            };

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

            /**
             * This function helps to show loader with message.
             * @param {String} headerMessage
             * @param {String} loaderMessage
             */
            function showLoaderWithMessage(headerMessage, loaderMessage) {
                var loader = {};
                loader.showLoader = true;
                loader.headerMessage = headerMessage;
                loader.loaderMessage = loaderMessage;
                return loader;
            }

            contentCreation.createContent = function (requestData, api) {

                contentService.create(requestData).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        contentCreation[api].loader.showLoader = false;
                        contentCreation.contentId = res.result.content_id;
                        contentCreation.hideContentCreationModal();
                        if(contentCreation.youtubeFileLink) {
                            contentCreation.youtubeFileLink = '';
                            contentCreation.editContent(res.result.content_id);
                        } else {
                            contentCreation.uploadContent(res.result.content_id);
                        }
                    } else {
                        contentCreation[api].loader.showLoader = false;
                        contentCreation[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    contentCreation[api].loader.showLoader = false;
                    contentCreation[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
            };

            contentCreation.saveMetaData = function (data) {

                var api = 'createApi';
                contentCreation[api] = {};
                contentCreation[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.START);

                var requestBody = angular.copy(data);

                requestBody.createdBy = contentCreation.userId;

                requestBody.name = requestBody.name ? requestBody.name : "Untitled";
                requestBody.contentType = requestBody.contentType ? requestBody.contentType : "Story";
                if(contentCreation.youtubeFileLink) {
                    requestBody.mimeType = contentCreation.youtubeVideoMimeType.value;
                    requestBody.artifactUrl = contentCreation.youtubeFileLink;
                } else {
                    requestBody.mimeType = requestBody.mimeType.value;
                }

                var requestdata = {
                    "content": requestBody,
                    "params": {
                        "cid": "new",
                        "sid": "12345"
                    }
                };
                contentCreation.createContent(requestdata, api);
            };

            contentCreation.uploadContent = function () {
                var endpoint = contentCreation.contentUploadUrl + '/' + contentCreation.contentId;
                contentCreation.manualUploader.setEndpoint(endpoint, contentCreation.uploadedFileId);
                contentCreation.manualUploader.uploadStoredFiles();
            };
            
            contentCreation.uploadYoutubeFile = function() {
                contentCreation.initilizeModal();
            };
            
            contentCreation.validateYouTubeUrl = function(url) {
                contentCreation.invalidYoutubeUrl = false;
                if (url !== undefined && url !== '') {        
                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                    var match = url.match(regExp);
                    if (match && match.length > 1 && match[2].length === 11) {
                        contentCreation.youtubeFileLink = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1';
                        contentCreation.invalidYoutubeUrl = false;
                    } else {
                        contentCreation.invalidYoutubeUrl = true;
                    }
                } else {
                    contentCreation.invalidYoutubeUrl = true;
                }
            };
            
        });
