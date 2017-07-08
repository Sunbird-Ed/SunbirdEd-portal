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

            contentCreation.mimeType = ['application/pdf', 'video/youtube', 'video/mp4', 'application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.html-archive']
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
                        endpoint: 'http://localhost:5000/api/sb/v1/content/upload/' + contentCreation.contentId
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
                        acceptFiles: 'application/pdf, video/youtube, video/mp4, application/vnd.ekstep.ecml-archive, application/vnd.ekstep.html-archive'
                    },
                    callbacks: {
                        onValidate: function (data) {
                            console.log("On validate data", data);
                        },
                        onComplete: function (id, name, responseJSON) {
                            document.getElementById('trigger-proceed').style.display = 'none';
                            document.getElementById('trigger-proceed').style.display = 'block';
                            console.log("onComplete:", id, name, responseJSON);
                        },
                        onSubmitted: function (id, name) {
                            contentCreation.showContentCreationModal = true;
                            contentCreation.uploadedFileId = id;
                            document.getElementById('trigger-proceed').style.display = 'block';
                            console.log("onSubmitted: id", id);
                            console.log("onSubmitted: name", name);
                        },
                        onError: function (id, name, error) {
                            console.log("onError:", id, name, error);
                        },
                        onCancel: function() {
                            document.getElementById('trigger-proceed').style.display = 'none';
                        }
                    }
                });

                document.getElementById("trigger-proceed").onclick = function () {
                    contentCreation.showContentCreationModal = true;
                    contentCreation.openContentCreationModal();
                };
                document.getElementById("trigger-update").onclick = function () {
                    contentCreation.editContent();
                };
            }, 500);
            
            contentCreation.editContent = function() {
                $state.go("EditSlideShow");
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
                    $('.singleSelectDropDown')
                            .dropdown('restore defaults');
                    $('#contentCreationModal').modal({
                        onShow: function () {
                            contentCreation.clearContentCreationModal();
                        },
                        onHide: function () {
                            contentCreation.clearContentCreationModal();
                            contentCreation.closeContentCreationModal();
                            return;
                        }
                    }).modal('show');
                }, 100);
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
                        contentCreation.hideContentCreationModal();
                        contentCreation.contentId = res.result.content_id;
                        contentCreation.uploadContent(res.result.content_id);
                    } else {
                        contentCreation[api].loader.showLoader = false;
                        contentCreation[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.CREATE_SLIDESHOW.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }, function (error) {
                    contentCreation[api].loader.showLoader = false;
                    contentCreation[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.CREATE_SLIDESHOW.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };

            contentCreation.saveMetaData = function (data) {

                var api = 'createApi';
                contentCreation[api] = {};
                contentCreation[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.CREATE_SLIDESHOW.START);

                var requestBody = angular.copy(data);

                requestBody.createdBy = contentCreation.userId;

                requestBody.name = requestBody.name ? requestBody.name : "Default title";
                requestBody.description = requestBody.description ? requestBody.description : "Default description";
                requestBody.contentType = requestBody.contentType ? requestBody.contentType : "Story";

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
                var endpoint = 'http://localhost:5000/api/sb/v1/content/upload' + '/' + contentCreation.contentId;
                contentCreation.manualUploader.setEndpoint(endpoint, contentCreation.uploadedFileId)
                contentCreation.manualUploader.uploadStoredFiles();
            };


        });