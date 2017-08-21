'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCreationController
 * @description
 * @author Anuj Gupta
 * # ContentCreationController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCreationController', ['contentService', 'config', '$scope', '$state',
        '$timeout', '$rootScope', 'toasterService', function (contentService, config, $scope,
            $state, $timeout, $rootScope, toasterService) {
            var contentCreation = this;
            contentCreation.contentUploadUrl = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX +
                                                config.URL.CONTENT.UPLOAD;

            contentCreation.mimeType = [
                { name: 'Pdf', value: config.MIME_TYPE.pdf },
                { name: 'Video', value: config.MIME_TYPE.mp4 },
                { name: 'Html Archive', value: config.MIME_TYPE.html },
                { name: 'E-pub', value: config.MIME_TYPE.ePub },
                { name: 'H5p', value: config.MIME_TYPE.h5p }
            ];
            contentCreation.youtubeVideoMimeType = {
                name: 'Youtube Video', value: config.MIME_TYPE.youtube
            };
            contentCreation.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
            contentCreation.showContentCreationModal = false;
            contentCreation.userId = $rootScope.userId;
            contentCreation.data = {};
            contentCreation.defaultName = 'Untitled';
            contentCreation.defaultContentType = 'Story';
            contentCreation.youtubeVideoUrl = '';

            $timeout(function () {
                contentCreation.manualUploader = new qq.FineUploader({
                    element: document.getElementById('fine-uploader-manual-trigger'),
                    template: 'qq-template-manual-trigger',
                    request: {
                        endpoint: contentCreation.contentUploadUrl + '/' + contentCreation.contentId
                    },
                    autoUpload: false,
                    debug: true,
                    validation: {
                        sizeLimit: config.MaxFileSizeToUpload,
                        allowedExtensions: config.AllowedFileExtension
                    },
                    messages: {
                        sizeError: '{file} ' +
                        $rootScope.errorMessages.COMMON.INVALID_FILE_SIZE + ' ' +
                                                config.MaxFileSizeToUpload / (1000 * 1024) + ' MB.'
                    },
                    callbacks: {
                        onComplete: function (id, name, responseJSON, xhr) {
                            if (responseJSON.success) {
                                contentCreation.editContent(contentCreation.contentId);
                            }
                            // if (xhr.statusText === 'OK') {
                            //     responseJSON.success = true;
                            //     var artifactUrl = xhr.responseURL.split('?')[0];
                            //     contentCreation.manualUploader.cancel(id);
                            //     contentCreation.uploadContent(id, artifactUrl, contentCreation.contentId);
                            //     // contentCreation.editContent(contentCreation.contentId);
                            // }
                        },
                        onSubmitted: function (id, name) {
                            contentCreation.youtubeVideoUrl = '';
                            contentCreation.uploadedFileId = id;
                            contentCreation.selectedFileName = name;
                            contentCreation.selectedFile = this.getFile(id);
                            contentCreation.initializeModal();
                            document.getElementById('hide-section-with-button')
                                                    .style.display = 'none';
                        },
                        onCancel: function () {
                            document.getElementById('hide-section-with-button')
                                                    .style.display = 'block';
                        },
                        onStatusChange: function (id, oldStatus, newStatus) {
                            if (newStatus === 'rejected') {
                                document.getElementById('hide-progress-bar-on-reject')
                                                    .style.display = 'none';
                                contentCreation.data = {};
                            }
                        }
                    }
                });
                $('#fileUploadOptions').text($rootScope.labels.WORKSPACE.startCreating
                                                                    .fileUploadOptions);

                window.cancelUploadFile = function () {
                    document.getElementById('hide-section-with-button').style.display = 'block';
                };
            }, 300);

            contentCreation.editContent = function (contentId) {
                var params = { contentId: contentId };
                $state.go('EditContent', params);
            };

            contentCreation.hideContentCreationModal = function () {
                $('#contentCreationModal').modal('hide');
                $('#contentCreationModal').modal('hide others');
                $('#contentCreationModal').modal('hide all');
                $('#contentCreationModal').modal('hide dimmer');
            };

            contentCreation.closeContentCreationModal = function () {
                $timeout(function () {
                    contentCreation.showContentCreationModal = false;
                }, 10);
            };

            contentCreation.initializeModal = function () {
                contentCreation.showContentCreationModal = true;
                var lessonDD = $('#lessonTypeDropDown').dropdown();
                var mimeTypeDD = $('#mimeTypeDropDown').dropdown();
                if (contentCreation.youtubeVideoUrl) {
                    mimeTypeDD.dropdown('set text', 'Youtube Video');
                    mimeTypeDD.dropdown('destroy');
                    lessonDD.dropdown('clear');
                } else {
                    mimeTypeDD.dropdown('set text', 'Mime Type');
                    mimeTypeDD.dropdown('clear');
                    lessonDD.dropdown('clear');
                }
                $timeout(function () {
                    $('#contentCreationModal').modal({
                        onShow: function () {

                        },
                        onHide: function () {
                            if (!contentCreation.contentId && !contentCreation.youtubeVideoUrl) {
                                document.getElementById('hide-section-with-button')
                                                        .style.display = 'block';
                                contentCreation.manualUploader.cancel(contentCreation
                                                                                .uploadedFileId);
                            }
                            contentCreation.data = {};
                            contentCreation.closeContentCreationModal();
                            return true;
                        }
                    }).modal('show');
                }, 10);
            };

            contentCreation.createContent = function (requestData) {
                contentCreation.loader = toasterService.loader('', $rootScope.errorMessages
                                                                .WORKSPACE.UPLOAD_CONTENT.START);
                contentService.create(requestData).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        contentCreation.loader.showLoader = false;
                        contentCreation.contentId = res.result.content_id;
                        contentCreation.versionKey = res.result.versionKey;
                        contentCreation.hideContentCreationModal();
                        if (contentCreation.youtubeVideoUrl) {
                            contentCreation.youtubeVideoUrl = '';
                            contentCreation.editContent(res.result.content_id);
                        } else {
                            contentCreation.uploadContentInS3();
                            // contentCreation.getContentUploadUrl(res.result.content_id);
                        }
                    } else {
                        contentCreation.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_CONTENT
                                                                                        .FAILED);
                    }
                }).catch(function () {
                    contentCreation.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_CONTENT.FAILED);
                });
            };

            contentCreation.saveMetaData = function (data) {
                var requestBody = angular.copy(data);
                requestBody.createdBy = contentCreation.userId;
                requestBody.name = requestBody.name ? requestBody.name
                                                            : contentCreation.defaultName;
                requestBody.contentType = requestBody.contentType ? requestBody.contentType
                                                            : contentCreation.defaultContentType;
                if (contentCreation.youtubeVideoUrl) {
                    requestBody.mimeType = contentCreation.youtubeVideoMimeType.value;
                    requestBody.artifactUrl = contentCreation.youtubeVideoUrl;
                } else {
                    requestBody.mimeType = requestBody.mimeType.value;
                }
                contentCreation.selectedFileMimeType = requestBody.mimeType;
                var requestData = {
                    content: requestBody
                };
                contentCreation.createContent(requestData);
            };

            contentCreation.uploadContentInS3 = function () {
                var endpoint = contentCreation.contentUploadUrl + '/' + contentCreation.contentId;
                contentCreation.manualUploader.setEndpoint(endpoint,
                                                                contentCreation.uploadedFileId);
                contentCreation.manualUploader.uploadStoredFiles();
            };

            contentCreation.uploadYoutubeFile = function () {
                contentCreation.initializeModal();
            };

            contentCreation.validateYouTubeUrl = function (url) {
                contentCreation.invalidYoutubeVideoUrl = false;
                if (url !== undefined && url !== '') {
                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/; //eslint-disable-line
                    var match = url.match(regExp);
                    if (match && match.length > 1 && match[2].length === 11) {
                        contentCreation.youtubeVideoUrl = 'https://www.youtube.com/embed/' +
                                                            match[2] + '?autoplay=1&enablejsapi=1';
                        contentCreation.invalidYoutubeVideoUrl = false;
                    } else {
                        contentCreation.invalidYoutubeVideoUrl = true;
                    }
                } else {
                    contentCreation.invalidYoutubeVideoUrl = true;
                }
            };

            contentCreation.getContentUploadUrl = function (contentId) {
                var requestBody = {
                    content: {
                        fileName: contentCreation.selectedFileName
                    }
                };
                contentService.uploadURL(requestBody, contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        contentCreation.uploadContentInS3(res.result.pre_signed_url);
                    } else {
                        toasterService.error($rootScope.errorMessages
                                                                .WORKSPACE.UPLOAD_CONTENT.FAILED);
                        // handle error
                    }
                }).catch(function () {
                    toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_CONTENT.FAILED);
                    // handle error
                });
            };

            contentCreation.uploadContent = function (id, url, contentId) {
                var requestBody = {};
                contentCreation.loader = toasterService.loader('', $rootScope.errorMessages
                                                                        .WORKSPACE.UPLOAD_CONTENT.START);
                var qs = { fileUrl: url };
                contentService.upload(requestBody, contentId, qs).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        contentCreation.loader.showLoader = false;
                        contentCreation.editContent(contentCreation.contentId);
                    } else {
                        contentCreation.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_CONTENT.FAILED);
                    }
                }).catch(function () {
                    contentCreation.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_CONTENT.FAILED);
                });
            };
        }]);
