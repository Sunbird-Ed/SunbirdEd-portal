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
            '$timeout', '$rootScope', '$stateParams',
            '$location', '$anchorScroll', 'toasterService',
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
                editContent.selectedConcepts = [];
                editContent.contentPlayer = { isContentPlayerEnabled: false };
                editContent.contentUploadUrl = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX +
                        config.URL.CONTENT.UPLOAD;
                var mimeType = config.MIME_TYPE;
                editContent.checkMimeTypeForEditContent = [
                    mimeType.pdf, mimeType.mp4, mimeType.youtube, mimeType.pYoutube,
                    mimeType.html, mimeType.ecml, mimeType.ePub, mimeType.h5p
                ];
                editContent.checkMimeTypeForUploadContent = [
                    mimeType.pdf, mimeType.mp4, mimeType.youtube, mimeType.pYoutube,
                    mimeType.html, mimeType.ePub, mimeType.h5p
                ];
                editContent.mimeTypeForPdfVideoHtmlEPUBH5P = [mimeType.pdf, mimeType.mp4,
                    mimeType.html, mimeType.ePub, mimeType.h5p];
                editContent.mimeTypeForYoutubeVideo = mimeType.youtube;
                editContent.message = $rootScope.errorMessages.WORKSPACE;
                var commonMessage = $rootScope.errorMessages.COMMON;

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
                    if (editContent.uploadedContentMimeType === mimeType.pdf) {
                        editContent.fileUploadOptions = ' ' + commonMessage.PDF_MESSAGE;
                        editContent.allowedExtensions = ['pdf'];
                        editContent.acceptFiles = 'application/pdf';
                        editContent.invalidFileMessage = ' ' + commonMessage.INVALID_PDF_FILE;
                    }
                    if (editContent.uploadedContentMimeType === mimeType.mp4) {
                        editContent.fileUploadOptions = ' ' + commonMessage.MP4_MESSAGE;
                        editContent.allowedExtensions = ['mp4'];
                        editContent.acceptFiles = 'video/mp4';
                        editContent.invalidFileMessage = ' ' + commonMessage.INVALID_MP4_FILE;
                    }
                    if (editContent.uploadedContentMimeType === mimeType.html) {
                        editContent.fileUploadOptions = ' ' + commonMessage.ZIP_MESSAGE;
                        editContent.allowedExtensions = ['zip'];
                        editContent.acceptFiles = '';
                        editContent.invalidFileMessage = ' ' + commonMessage.INVALID_ZIP_FILE;
                    }
                    if (editContent.uploadedContentMimeType === mimeType.ePub) {
                        editContent.fileUploadOptions = ' ' + commonMessage.EPUB_MESSAGE;
                        editContent.allowedExtensions = ['epub'];
                        editContent.acceptFiles = 'application/epub+zip';
                        editContent.invalidFileMessage = ' ' + commonMessage.INVALID_EPUB_FILE;
                    }
                    if (editContent.uploadedContentMimeType === mimeType.h5p) {
                        editContent.fileUploadOptions = ' ' + commonMessage.H5P_MESSAGE;
                        editContent.allowedExtensions = ['h5p'];
                        editContent.acceptFiles = 'application/zip';
                        editContent.invalidFileMessage = ' ' + commonMessage.INVALID_H5P_FILE;
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
                                'versionKey,audience,language,gradeLevel,ageGroup,subject,' +
                                'medium,author,domain,createdBy'
                    };

                    function updateDropDownMetaData(response) {
                        $timeout(function () {
                            $('#contentTypeDropDown').dropdown('set selected');
                            $('#audienceDropDown').dropdown('set selected');
                            $('#languageDropDown').dropdown('set selected');
                            $('#gradesDropDown').dropdown('set selected');
                            if (response.ageGroup) {
                                response.ageGroup.filter(function (val) {
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
                        }, 0);
                    }

                    contentService.getById(req, qs).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            if (!editContent.checkContentAccess(response.result.content)) {
                                toasterService.warning(commonMessage.UN_AUTHORIZED);
                                $state.go('Home');
                            }
                            editContent.contentData = {};
                            editContent.contentData = response.result.content;
                            editContent.iconImage = editContent.contentData.appIcon;
                            updateDropDownMetaData(response.result.content);
                            checkMimeType();
                            editContent.loader.showLoader = false;
                            if (isReview) {
                                editContent.submitForReview(editContent.contentData);
                            }
                        } else {
                            editContent.loader.showLoader = false;
                            toasterService.error(editContent.message.GET.FAILED);
                        }
                    }).catch(function () {
                        editContent.loader.showLoader = false;
                        toasterService.error(editContent.message.GET.FAILED);
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
                    if (files &&
                            files[0].name.match(/.(jpg|jpeg|png)$/i) && files[0].size < 4000000) {
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
                        alert(commonMessage.INVALID_IMAGE);
                    }
                };

                editContent.uploadContentIcon = function (requestBody, isReviewContent) {
                    editContent.loader = toasterService.loader('', editContent.message
                                                                                .UPLOAD_ICON.START);

                    editContent.icon.append('container', 'content/' + editContent.contentId);
                    contentService.uploadMedia(editContent.icon).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            editContent.iconUpdate = false;
                            requestBody.content.appIcon = res.result.url;
                            editContent.loader.showLoader = false;
                            editContent.updateContent(requestBody, isReviewContent);
                        } else {
                            editContent.loader.showLoader = false;
                            toasterService.error(editContent.message.UPLOAD_ICON.FAILED);
                        }
                    }).catch(function () {
                        editContent.loader.showLoader = false;
                        toasterService.error(editContent.message.UPLOAD_ICON.FAILED);
                    });
                };

                editContent.updateContent = function (requestBody, isReviewContent) {
                    editContent.loader = toasterService.loader('', $rootScope.errorMessages
                                                                        .WORKSPACE.UPDATE.START);
                    contentService.update(requestBody, editContent.contentId).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            editContent.loader.showLoader = false;
                            toasterService.success(editContent.message.UPDATE.SUCCESS);
                            editContent.contentData.artifactUrl = requestBody.content.artifactUrl;
                            if (editContent.youtubeFileLink) {
                                editContent.youtubeFileLink = '';
                            }
                            if (isReviewContent) {
                                editContent.callReviewApi();
                            }
                        } else {
                            editContent.loader.showLoader = false;
                            toasterService.error(editContent.message.UPDATE.FAILED);
                        }
                    }).catch(function () {
                        editContent.loader.showLoader = false;
                        toasterService.error(editContent.message.UPDATE.FAILED);
                    });
                };

                editContent.saveMetaContent = function (data, isReviewContent) {
                    editContent.requiredFieldsMessage = [];
                    delete data.body;
                    var newData = angular.copy(data);
                    newData.createdBy = editContent.userId;
                    delete newData.languageCode;
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
                    var messages = editContent.message.REQUIRED_FIELDS;
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
                    editContent.loader = toasterService.loader('', editContent.message
                            .REVIEW_CONTENT.START);
                    var req = { content: {} };
                    contentService.review(req, editContent.contentId).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            editContent.loader.showLoader = false;
                            toasterService.success(editContent.message.REVIEW_CONTENT.SUCCESS);
//                        $state.go("WorkSpace.ReviewContent");
                        } else {
                            editContent.loader.showLoader = false;
                            toasterService.error(editContent.message.REVIEW_CONTENT.FAILED);
                        }
                    }).catch(function () {
                        editContent.loader.showLoader = false;
                        toasterService.error(editContent.message.REVIEW_CONTENT.FAILED);
                    });
                };

                editContent.scrollUpToButton = function () {
                    $timeout(function () {
                        $location.hash('content-player-bottom-edit');
                        // call $anchorScroll()
                        $anchorScroll();
                    }, 500);
                };

                editContent.previewContent = function (requestData) {
                    editContent.showUploadFileForm = false;
                    editContent.contentPlayer.contentData = requestData;
                    editContent.contentPlayer.isContentPlayerEnabled = true;
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

                editContent.initializeFineUploader = function () {
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
                                sizeError: '{file} ' + commonMessage.INVALID_FILE_SIZE + ' ' +
                                        config.MaxFileSizeToUpload / (1000 * 1024) + ' MB.',
                                typeError: '{file} ' + editContent.invalidFileMessage
                            },
                            callbacks: {
                                onComplete: function (id, name, responseJSON, xhr) {
                                    if (responseJSON.success) {
                                        editContent.initializeData(false);
                                        editContent.showUploadFileForm = false;
                                    }
                                    // if (xhr.statusText === 'OK') {
                                    //     responseJSON.success = true;
                                    //     var artifactUrl = xhr.responseURL.split('?')[0];
                                    //     editContent.manualUploader.cancel(id);
                                    //     editContent.uploadContent(artifactUrl);
                                    // }
                                },
                                onSubmitted: function (id, name) {
                                    editContent.youtubeFileLink = '';
                                    editContent.uploadedFileId = id;
                                    editContent.selectedFileName = name;
                                    editContent.selectedFile = this.getFile(id);
                                    editContent.uploadContentInS3();
                                    // editContent.getContentUploadUrl(editContent.contentId);
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

                editContent.uploadFileForm = function () {
                    editContent.scrollUpToButton();
                    editContent.showUploadFileForm = true;
                    editContent.contentPlayer = {};
                };

                editContent.uploadContentInS3 = function () {
                    var endpoint = editContent.contentUploadUrl + '/' + editContent.contentId;
                    editContent.manualUploader.setEndpoint(endpoint, editContent.uploadedFileId);
                    editContent.manualUploader.uploadStoredFiles();
                    // editContent.manualUploader.setParams({
                    //     paramsInBody: true,
                    //     contentType: editContent.contentData.mimeType,
                    //     processData: false,
                    //     data: editContent.selectedFile,
                    //     method: 'PUT'
                    // });
                    // editContent.manualUploader.setCustomHeaders({
                    //     'Content-Type': editContent.contentData.mimeType,
                    //     Accept: '*/*'
                    // });
                    // editContent.manualUploader.setDeleteFileParams('data', editContent.uploadedFileId);
                    // $.ajax({
                    //     type: 'PUT',
                    //     url: endpoint,
                    //     // Content type must much with the parameter you signed your URL with
                    //     contentType: editContent.contentData.mimeType,
                    //     // this flag is important, if not set, it will try to send data as a form
                    //     processData: false,
                    //     // the actual file is sent raw
                    //     data: editContent.selectedFile
                    // })
                    //   .success(function () {
                    //       var artifactUrl = endpoint.split('?')[0];
                    //       editContent.manualUploader.cancel(editContent.uploadedFileId);
                    //       editContent.uploadContent(artifactUrl);
                    //   })
                    //   .error(function () {
                    //       alert('File NOT uploaded');
                    //       console.log(arguments);
                    //   });

                    // console.log('editContent.contentData.mimeType', editContent.contentData.mimeType);
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
                            editContent.youtubeFileLink = 'https://www.youtube.com/embed/' +
                                                            match[2] + '?autoplay=1&enablejsapi=1';
                            editContent.invalidYoutubeUrl = false;
                        } else {
                            editContent.invalidYoutubeUrl = true;
                        }
                    } else {
                        editContent.invalidYoutubeUrl = true;
                    }
                };

                editContent.deleteContent = function (requestData) {
                    editContent.loader = toasterService.loader('', editContent.message
                                                                            .RETIRE_CONTENT.START);
                    var request = {
                        contentIds: [requestData.identifier]
                    };
                    contentService.retire(request).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            editContent.loader.showLoader = false;
                            editContent.closeEditForm(requestData);
                            toasterService.success(editContent.message.RETIRE_CONTENT.SUCCESS);
                        } else {
                            editContent.loader.showLoader = false;
                            toasterService.error(editContent.message.RETIRE_CONTENT.FAILED);
                        }
                    });
                };
                $scope.$on('selectedConcepts', function (event, args) {
                    editContent.contentData.concepts = args.selectedConcepts;
                });

                editContent.getContentUploadUrl = function (contentId) {
                    var requestBody = {
                        content: {
                            fileName: editContent.selectedFileName
                        }
                    };
                    contentService.uploadURL(requestBody, contentId).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            editContent.uploadContentInS3(res.result.pre_signed_url);
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

                editContent.uploadContent = function (url) {
                    var requestBody = {};
                    editContent.loader = toasterService.loader('', $rootScope.errorMessages
                                                                    .WORKSPACE.UPLOAD_CONTENT.START);
                    var qs = { fileUrl: url };
                    contentService.upload(requestBody, editContent.contentId, qs).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            editContent.loader.showLoader = false;
                            editContent.showUploadFileForm = false;
                            editContent.contentData.artifactUrl = res.result.content_url;
                            toasterService.success('Uploaded successfully');
                        } else {
                            editContent.loader.showLoader = false;
                            toasterService.error($rootScope.errorMessages.WORKSPACE
                                                                .UPLOAD_CONTENT.FAILED);
                        }
                    }).catch(function () {
                        editContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE
                                                                .UPLOAD_CONTENT.FAILED);
                    });
                };
            }]);
