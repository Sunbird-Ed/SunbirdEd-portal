'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:EditContentController
 * @description
 * @author Anuj Gupta
 * # EditContentController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('EditContentController', ['contentService', 'config', '$scope', '$state',
        '$timeout', '$rootScope', '$stateParams', '$location', '$anchorScroll', 'toasterService',
        function (contentService, config, $scope, $state, $timeout, $rootScope, $stateParams,
            $location, $anchorScroll, toasterService) {
            var editContent = this;
            editContent.contentId = $stateParams.contentId;
            editContent.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
            editContent.audiences = config.DROPDOWN.COMMON.audiences;
            editContent.languages = config.DROPDOWN.COMMON.languages;
            editContent.grades = config.DROPDOWN.COMMON.grades;
            editContent.ageGroup = config.DROPDOWN.COMMON.ageGroup;
            editContent.mediums = config.DROPDOWN.COMMON.medium;
            editContent.subjects = config.DROPDOWN.COMMON.subjects;
            editContent.boards = config.DROPDOWN.COMMON.boards;
            editContent.userId = $rootScope.userId;
            editContent.showUploadFileForm = false;
            $scope.contentPlayer = { isContentPlayerEnabled: false };
            editContent.contentUploadUrl = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX +
                                            config.URL.CONTENT.UPLOAD;
            editContent.checkMimeTypeForEditContent = [
                'application/pdf', 'video/mp4', 'application/vnd.ekstep.html-archive',
                'video/youtube', 'application/vnd.ekstep.ecml-archive'
            ];
            editContent.checkMimeTypeForUploadContent = ['application/pdf', 'video/mp4',
                'application/vnd.ekstep.html-archive', 'video/youtube'];
            editContent.mimeTypeForPdfVideoHtml = ['application/pdf', 'video/mp4',
                'application/vnd.ekstep.html-archive'];
            editContent.mimeTypeForYoutubeVideo = 'video/youtube';

            editContent.initializeDropDown = function () {
                $timeout(function () {
                    $('.multiSelectDropDown')
                            .dropdown();
                    $('.singleSelectDropDown')
                            .dropdown();
                }, 10);
            };

            function checkMimeType() {
                editContent.uploadedContentMimeType = editContent.contentData.mimeType;
                if (editContent.uploadedContentMimeType === 'application/pdf') {
                    editContent.fileUploadOptions = $rootScope.errorMessages.COMMON.PDF_MESSAGE;
                    editContent.allowedExtensions = ['pdf'];
                    editContent.acceptFiles = 'application/pdf';
                    editContent.invalidFileMessage = $rootScope.errorMessages.COMMON
                                                    .INVALID_PDF_FILE;
                }
                if (editContent.uploadedContentMimeType === 'video/mp4') {
                    editContent.fileUploadOptions = $rootScope.errorMessages.COMMON.MP4_MESSAGE;
                    editContent.allowedExtensions = ['mp4'];
                    editContent.acceptFiles = 'video/mp4';
                    editContent.invalidFileMessage = $rootScope.errorMessages.COMMON
                                                    .INVALID_MP4_FILE;
                }
                if (editContent.uploadedContentMimeType === 'application/vnd.ekstep.html-archive') {
                    editContent.fileUploadOptions = $rootScope.errorMessages.COMMON.ZIP_MESSAGE;
                    editContent.allowedExtensions = ['zip'];
                    editContent.acceptFiles = 'application/zip';
                    editContent.invalidFileMessage = $rootScope.errorMessages.COMMON
                                                    .INVALID_ZIP_FILE;
                }
            }

            editContent.initializeData = function (isReview) {
                editContent.loader = toasterService.loader('', $rootScope.errorMessages
                                            .WORKSPACE.GET.START);

                editContent.initializeDropDown();

                var req = { contentId: editContent.contentId };
                var qs = {
                    mode: 'edit',
                    fields: 'name,description,appIcon,contentType,mimeType,artifactUrl,' +
                            ',versionKey,audience,language,gradeLevel,ageGroup,subject,' +
                            'medium,author,domain,createdBy'
                };

                contentService.getById(req, qs).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        if (!editContent.checkContentAccess(response.result.content)) {
                            toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                            $state.go('Home');
                        }
                        editContent.contentData = {};
                        editContent.contentData = response.result.content;
                        editContent.iconImage = editContent.contentData.appIcon;
                        checkMimeType();
                        $timeout(function () {
                            $('#contentTypeDropDown').dropdown('set selected');
                            $('#audienceDropDown').dropdown('set selected');
                            $('#languageDropDown').dropdown('set selected');
                            $('#gradesDropDown').dropdown('set selected');
                            if (response.result.content.ageGroup) {
                                response.result.content.ageGroup.filter(function (val) {
                                    var ageGroup = [];
                                    if (val === '<5') {
                                        ageGroup.push('&lt;5');
                                    } else if (val === '>10') {
                                        ageGroup.push('&gt;10');
                                    } else {
                                        ageGroup.push(val);
                                    }
                                    return ageGroup;
                                });
                                $('#ageGroupDropDown').dropdown('set selected');
                            }
                            $('#subjectDropDown').dropdown('set selected');
                            $('#mediumDropDown').dropdown('set selected');
                        }, 100);
                        editContent.loader.showLoader = false;
                        if (isReview) {
                            editContent.submitForReview(editContent.contentData);
                        }
                    } else {
                        editContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.GET.FAILED);
                    }
                }).catch(function () {
                    editContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.GET.FAILED);
                });
            };

            editContent.checkContentAccess = function (data) {
                if (data.createdBy === $rootScope.userId &&
                    _.indexOf(editContent.checkMimeTypeForEditContent, data.mimeType) > -1) {
                    return true;
                }
                return false;
            };

            editContent.openImageBrowser = function () {
                $('#iconImageInput').click();
            };

            $scope.updateIcon = function (files) {
                if (files && files[0].name.match(/.(jpg|jpeg|png)$/i) && files[0].size < 4000000) {
                    var fd = new FormData();
                    fd.append('file', files[0]);
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        editContent.iconImage = e.target.result;
                        $scope.$apply();
                    };
                    reader.readAsDataURL(files[0]);
                    editContent.icon = fd;
                    editContent.iconUpdate = true;
                } else {
                    alert($rootScope.errorMessages.COMMON.INVALID_IMAGE);
                }
            };

            editContent.uploadContentIcon = function (requestBody, isReviewContent) {
                editContent.loader = toasterService.loader('', $rootScope.errorMessages.WORKSPACE
                                                .UPLOAD_ICON.START);
                contentService.uploadMedia(editContent.icon).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        editContent.iconUpdate = false;
                        requestBody.content.appIcon = res.result.url;
                        editContent.loader.showLoader = false;
                        editContent.updateContent(requestBody, isReviewContent);
                    } else {
                        editContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_ICON.FAILED);
                    }
                }).catch(function () {
                    editContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.UPLOAD_ICON.FAILED);
                });
            };

            editContent.updateContent = function (requestBody, isReviewContent) {
                editContent.loader = toasterService.loader('', $rootScope.errorMessages
                                                .WORKSPACE.UPDATE.START);

                contentService.update(requestBody, editContent.contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        editContent.loader.showLoader = false;
                        toasterService.success($rootScope.errorMessages.WORKSPACE.UPDATE.SUCCESS);
                        if (editContent.youtubeFileLink) {
                            editContent.youtubeFileLink = '';
                            editContent.contentData.artifactUrl = requestBody.content.artifactUrl;
                        }
                        if (isReviewContent) {
                            editContent.callReviewApi();
                        }
                    } else {
                        editContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.UPDATE.FAILED);
                    }
                }).catch(function () {
                    editContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.UPDATE.FAILED);
                });
            };

            editContent.saveMetaContent = function (data, isReviewContent) {
                editContent.requiredFieldsMessage = [];
                var newData = angular.copy(data);
                newData.createdBy = editContent.userId;
                var requestBody = {
                    content: newData
                };
                if (editContent.iconUpdate) {
                    editContent.uploadContentIcon(requestBody, isReviewContent);
                } else {
                    editContent.updateContent(requestBody, isReviewContent);
                }
            };

            function checkAllRequiredField(contentData) {
                var requiredFieldsMessage = [];
                var messages = $rootScope.errorMessages.WORKSPACE.REQUIRED_FIELDS;
                if (!contentData.name) {
                    requiredFieldsMessage.push(messages.TITLE);
                }
                if (!contentData.description) {
                    requiredFieldsMessage.push(messages.DESCRIPTION);
                }
                if (!contentData.contentType) {
                    requiredFieldsMessage.push(messages.LESSON_TYPE);
                }
                if (contentData.audience && !contentData.audience.length) {
                    requiredFieldsMessage.push(messages.AUDIENCE);
                }
                if (!contentData.subject) {
                    requiredFieldsMessage.push(messages.SUBJECT);
                }
                if (!contentData.gradeLevel || contentData.gradeLevel &&
                    !contentData.gradeLevel.length) {
                    requiredFieldsMessage.push(messages.GRADE);
                }
                if (!contentData.medium || contentData.medium && !contentData.medium.length) {
                    requiredFieldsMessage.push(messages.MEDIUM);
                }
                return requiredFieldsMessage;
            }

            editContent.submitForReview = function (contentData) {
                editContent.requiredFieldsMessage = checkAllRequiredField(contentData);

                if (editContent.requiredFieldsMessage.length === 0) {
                    var isReviewContent = true;
                    editContent.saveMetaContent(contentData, isReviewContent);
                }
            };

            editContent.callReviewApi = function () {
                editContent.loader = toasterService.loader('', $rootScope.errorMessages.WORKSPACE
                                    .REVIEW_CONTENT.START);
                var req = { content: {} };
                contentService.review(req, editContent.contentId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        editContent.loader.showLoader = false;
                        toasterService.success($rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT
                                                        .SUCCESS);
//                        $state.go("WorkSpace.ReviewContent");
                    } else {
                        editContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT
                                            .FAILED);
                    }
                }).catch(function () {
                    editContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT.FAILED);
                });
            };

            editContent.scrollUpToButton = function () {
                $timeout(function () {
                    $location.hash('content-player-bottom-edit');
                    // call $anchorScroll()
                    $anchorScroll();
                }, 300);
            };

            editContent.previewContent = function (requestData) {
                editContent.showUploadFileForm = false;
                $scope.contentPlayer.contentData = requestData;
                $scope.contentPlayer.isContentPlayerEnabled = true;
                editContent.scrollUpToButton();
            };

            editContent.closeEditForm = function (requestData) {
                if (requestData.mimeType === 'application/vnd.ekstep.ecml-archive') {
                    $state.go('WorkSpace.DraftContent');
                } else {
                    $state.go('WorkSpace.AllUploadedContent');
                }
            };

            editContent.openContentEditor = function (contentId) {
                var params = { contentId: contentId };
                $state.go('ContentEditor', params);
            };

            editContent.openCollectionEditor = function (data) {
                var params = { contentId: data.identifier, type: data.contentType };
                $state.go('CollectionEditor', params);
            };

            if ($stateParams.backState === 'ContentEditor') {
                editContent.initializeData(true);
            } else {
                editContent.initializeData(false);
            }

            editContent.uploadFileForm = function () {
                editContent.scrollUpToButton();
                editContent.showUploadFileForm = true;
                $scope.contentPlayer = {};
                $timeout(function () {
                    editContent.manualUploader = new qq.FineUploader({
                        element: document.getElementById('fine-uploader-manual-trigger'),
                        template: 'qq-template-manual-trigger',
                        request: {
                            endpoint: editContent.contentUploadUrl + '/' + editContent.contentId
                        },
                        autoUpload: false,
                        debug: true,
                        validation: {
                            acceptFiles: editContent.FileExtensionToUpload,
                            sizeLimit: config.MaxFileSizeToUpload,
                            allowedExtensions: editContent.allowedExtensions
                        },
                        messages: {
                            sizeError: '{file}' + $rootScope.errorMessages.COMMON.INVALID_FILE_SIZE
                                            + config.MaxFileSizeToUpload / (1000 * 1024) + ' MB.',
                            typeError: '{file}' + editContent.invalidFileMessage
                        },
                        callbacks: {
                            onComplete: function (id, name, responseJSON) {
                                if (responseJSON.success) {
                                    editContent.initializeData(false);
                                    editContent.showUploadFileForm = false;
                                }
                            },
                            onSubmitted: function (id) {
                                editContent.youtubeFileLink = '';
                                editContent.uploadedFileId = id;
                                editContent.uploadContent();
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
                                }
                            }
                        }
                    });
                    $('#fileUploadOptions').text(editContent.fileUploadOptions);
                }, 100);
            };

            editContent.uploadContent = function () {
                var endpoint = editContent.contentUploadUrl + '/' + editContent.contentId;
                editContent.manualUploader.setEndpoint(endpoint, editContent.uploadedFileId);
                editContent.manualUploader.uploadStoredFiles();
            };

            editContent.uploadYoutubeFile = function (contentData) {
                var requestData = angular.copy(contentData);
                requestData.artifactUrl = editContent.youtubeFileLink;
                var requestBody = {
                    content: requestData
                };
                editContent.updateContent(requestBody, false);
            };

            editContent.validateYouTubeUrl = function (url) {
                editContent.invalidYoutubeUrl = false;
                if (url !== undefined && url !== '') {
                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/; //eslint-disable-line
                    var match = url.match(regExp);
                    if (match && match.length > 1 && match[2].length === 11) {
                        editContent.youtubeFileLink = 'https://www.youtube.com/embed/' + match[2] +
                                                        '?autoplay=1&enablejsapi=1';
                        editContent.invalidYoutubeUrl = false;
                    } else {
                        editContent.invalidYoutubeUrl = true;
                    }
                } else {
                    editContent.invalidYoutubeUrl = true;
                }
            };
        }]);
