'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:EditContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('EditContentController', function (contentService, config, $scope, $state, $timeout, $rootScope, $stateParams, $location, $anchorScroll) {
            
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
            editContent.showCreateSlideShowModal = true;
            editContent.userId = $rootScope.userId;
            editContent.accept = false;
            $scope.contentPlayer = {isContentPlayerEnabled: false};
            editContent.checkMimeTypeForEditContent = ['application/pdf', 'video/mp4',
                'application/vnd.ekstep.html-archive', 'video/youtube', "application/vnd.ekstep.ecml-archive"];

            editContent.initilizeView = function () {
                editContent.showCreateSlideShowModal = true;
                $timeout(function () {
                    $('.multiSelectDropDown')
                            .dropdown();
                    $('.singleSelectDropDown')
                            .dropdown();
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
            
            editContent.initializeData = function (isReview) {

                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.GET.START);

                editContent.initilizeView();

                var req = {contentId: editContent.contentId};
                var qs = {mode: "edit", fields: 'name,description,appIcon,contentType,mimeType,artifactUrl,versionKey,audience,language,gradeLevel,ageGroup,subject,medium,author,domain,createdBy'}

                contentService.getById(req, qs).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        if (!editContent.checkContentAccess(response.result.content)) {
                            $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                            $state.go('Home');
                        }
                        editContent.contentData = {};
                        editContent.contentData = response.result.content;
                        editContent.iconImage = editContent.contentData.appIcon;
                        $timeout(function () {
                            $('#contentTypeDropDown').dropdown('set selected', response.result.content.contentType);
                            $('#audienceDropDown').dropdown('set selected', response.result.content.audience);
                            $('#languageDropDown').dropdown('set selected', response.result.content.language);
                            $('#gradesDropDown').dropdown('set selected', response.result.content.gradeLevel);
                            if(response.result.content.ageGroup) {
                                var ModifyAgeGroup = response.result.content.ageGroup.filter(function(val) {
                                    var ageGroup = [];
                                    if(val === "<5") {
                                        ageGroup.push("&lt;5");
                                    }else if(val === ">10") {
                                        ageGroup.push("&gt;10");
                                    } else {
                                        ageGroup.push(val);
                                    }
                                    return ageGroup;
                                });
                                $('#ageGroupDropDown').dropdown('set selected', response.result.content.ModifyAgeGroup);
                            }
                            $('#subjectDropDown').dropdown('set selected', response.result.content.subject);
                            $('#mediumDropDown').dropdown('set selected', response.result.content.medium);
                        }, 100);
                        editContent[api].loader.showLoader = false;
                        if (isReview) {
                            editContent.submitForReview(editContent.contentData)
                        }
                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(false, $rootScope.errorMessages.WORKSPACE.GET.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(false, $rootScope.errorMessages.WORKSPACE.GET.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
            };
            
            editContent.checkContentAccess = function(data) {
                if(data.createdBy === $rootScope.userId && _.indexOf(editContent.checkMimeTypeForEditContent, data.mimeType) > -1) {
                    return true;
                } else { 
                    return false;
                }
            };

            editContent.openImageBrowser = function () {
                $('#iconImageInput').click();
            };

            $scope.updateIcon = function (files) {
                console.log("File data", files[0]);
                if (files && files[0].name.match(/.(jpg|jpeg|png)$/i) && files[0].size < 4000000) {
                    var fd = new FormData();
                    fd.append("file", files[0]);

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        editContent.iconImage = e.target.result;
                        $scope.$apply();
                    };
                    reader.readAsDataURL(files[0]);
                    editContent.icon = fd;
                    editContent.iconUpdate = true;
                } else {
                    alert($rootScope.errorMessages.COMMON.INVAILID_IMAGE);
                }
            };

            editContent.saveMetaContent = function (data, isReviewContent) {
                editContent.requiredFieldsMessage = [];
                var newData = angular.copy(data);
                newData.createdBy = editContent.userId;

                var requestBody = {
                    "content": newData
                };

                if (editContent.iconUpdate) {
                    editContent.uploadOrUpdateAppIcon(requestBody, isReviewContent);
                } else {
                    editContent.updateContent(requestBody, isReviewContent);
                }
            };

            editContent.uploadOrUpdateAppIcon = function (requestBody, isReviewContent) {
                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.UPLOAD_ICON.START);

                contentService.uploadMedia(editContent.icon).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        editContent.iconUpdate = false; 
                        requestBody.content.appIcon = res.result.url;
                        editContent[api].loader.showLoader = false;
                        editContent.updateContent(requestBody, isReviewContent);
                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.UPLOAD_ICON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.UPLOAD_ICON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
            };

            editContent.updateContent = function (requestBody, isReviewContent) {

                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.UPDATE.START);

                contentService.update(requestBody, editContent.contentId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, "Saved Successfully", $rootScope.errorMessages.COMMON.SUCCESS);
                        editContent[api].error.success = true;
                        if (isReviewContent) {
                            editContent.callReviewApi();
                        }
                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.UPDATE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.UPDATE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
            };

            function checkAllRequiredField(contentData) {

                var requiredFieldsMessage = [];
                if (!contentData.name) {
                    requiredFieldsMessage.push("Title is missing");
                }
                if (!contentData.description) {
                    requiredFieldsMessage.push("Description is missing");
                }
                if (!contentData.contentType) {
                    requiredFieldsMessage.push("Lesson type is missing");
                }
                if (contentData.audience && !contentData.audience.length > 0) {
                    requiredFieldsMessage.push("Audience is missing");
                }
                if (!contentData.subject) {
                    requiredFieldsMessage.push("Subject is missing");
                }
                if (!contentData.gradeLevel || contentData.gradeLevel && !contentData.gradeLevel.length > 0) {
                    requiredFieldsMessage.push("Grade is missing");
                }
                if (!contentData.medium || contentData.medium && !contentData.medium.length > 0) {
                    requiredFieldsMessage.push("Medium is missing");
                }
                return requiredFieldsMessage;
            }

            editContent.submitForReview = function (contentData) {

                editContent.requiredFieldsMessage = checkAllRequiredField(contentData);

                if (editContent.requiredFieldsMessage.length > 0) {
                    return;
                } else {
                    var isReviewContent = true;
                    editContent.saveMetaContent(contentData, isReviewContent)
                }
            };

            editContent.callReviewApi = function () {
                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT.START);
                var req = {content: {}};

                contentService.review(req, editContent.contentId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT.SUCCESS, $rootScope.errorMessages.COMMON.SUCCESS);
//                        $state.go("WorkSpace.ReviewContent");

                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REVIEW_CONTENT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
            }

            editContent.previewContent = function (requestData) {
                
                $scope.contentPlayer.contentData = requestData;
                $scope.contentPlayer.isContentPlayerEnabled = true;
                $timeout(function () {
                    $location.hash('content-player-bottom-edit');

                    // call $anchorScroll()
                    $anchorScroll();
                }, 100);
            };

            editContent.closeEditForm = function (requestData) {
                if (requestData.mimeType === "application/vnd.ekstep.ecml-archive") {
                    $state.go("WorkSpace.DraftContent");
                } else {
                    $state.go("WorkSpace.AllUploadedContent");
                }
            };

            editContent.openContentEditor = function (contentId) {
                var params = {contentId: contentId};
                $state.go("ContentEditor", params);
            };
            
            editContent.openCollectionEditor = function (data) {
                var params = {contentId: data.identifier, type: data.contentType};
                $state.go("CollectionEditor", params);
            };

            if ($stateParams.backState === "ContentEditor") {
                editContent.initializeData(true);
            } else {
                editContent.initializeData(false);
            }

        });
