'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:EditContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('EditContentController', function (contentService, config, $scope, $state, $timeout, $rootScope, $stateParams) {

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

            editContent.initializeData = function () {

                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.GET.START);

                editContent.initilizeView();

                var req = {contentId: editContent.contentId};
                var qs = {mode: "edit", fields: 'name,description,appIcon,contentType,mimeType,artifactUrl,versionKey,audience,language,gradeLevel,ageGroup,subject,medium,author,domain'}

                contentService.getById(req, qs).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        editContent.data = angular.copy(response.result.content);
                        editContent.iconImage = editContent.data.appIcon;
                        $timeout(function () {
                            $('#contentTypeDropDown').dropdown('set selected', response.result.content.contentType);
                            $('#audienceDropDown').dropdown('set selected', response.result.content.audience);
                            $('#languageDropDown').dropdown('set selected', response.result.content.language);
                            $('#gradesDropDown').dropdown('set selected', response.result.content.gradeLevel);
                            $('#ageGroupDropDown').dropdown('set selected', response.result.content.ageGroup);
                            $('#subjectDropDown').dropdown('set selected', response.result.content.subject);
                            $('#mediumDropDown').dropdown('set selected', response.result.content.medium);
                        }, 100);
                        editContent[api].loader.showLoader = false;
                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(false, config.MESSAGES.WORKSPACE.GET.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(false, config.MESSAGES.WORKSPACE.GET.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };

            editContent.openImageBrowser = function () {
                $('#iconImageInput').click();
            };

            $scope.updateIcon = function (files) {
                if (files) {
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
                }
            };

            editContent.saveMetaContent = function (data) {
                var newData = angular.copy(data);
                newData.createdBy = editContent.userId;

                var requestBody = {
                    "content": newData
                };

                if (editContent.iconUpdate) {
                    editContent.uploadOrUpdateAppIcon(requestBody);
                } else {
                    editContent.updateContent(requestBody);
                }
            };

            editContent.uploadOrUpdateAppIcon = function (requestBody) {
                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.UPLOAD_ICON.START);

                contentService.uploadMedia(editContent.icon).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        requestBody.content.appIcon = res.result.url;
                        editContent[api].loader.showLoader = false;
                        editContent.updateContent(requestBody);
                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.UPLOAD_ICON.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.UPLOAD_ICON.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };

            editContent.updateContent = function (requestBody) {

                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.UPDATE.START);

                contentService.update(requestBody, editContent.contentId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, requestBody.content.name + " updated Successfully", config.MESSAGES.COMMON.SUCCESS);
                        editContent[api].error.success = true;
                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };

            editContent.submitForReview = function (contentId) {

                var api = 'editApi';
                editContent[api] = {};
                editContent[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.REVIEW_CONTENT.START);
                var req = {content: {}};

                contentService.review(req, contentId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        editContent[api].loader.showLoader = false;
                        $state.go("WorkSpace.ReviewContent");

                    } else {
                        editContent[api].loader.showLoader = false;
                        editContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.REVIEW_CONTENT.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    editContent[api].loader.showLoader = false;
                    editContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.REVIEW_CONTENT.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };

            editContent.previewContent = function (requestData) {
                $scope.contentPlayer.contentData = requestData;
                $scope.contentPlayer.isContentPlayerEnabled = true;
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

        });
