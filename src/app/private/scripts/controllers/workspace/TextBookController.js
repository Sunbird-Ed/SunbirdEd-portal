'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:TextBookController
 * @author Harish Kumar Gangula
 * @description
 * # TextBookController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('TextBookController', ['contentService', '$timeout', '$state', 'config',
        '$rootScope', 'toasterService', function (contentService, $timeout, $state, config,
            $rootScope, toasterService) {
            var textbook = this;
            textbook.boards = config.DROPDOWN.COMMON.boards;
            textbook.mediums = config.DROPDOWN.COMMON.medium;
            textbook.subjects = config.DROPDOWN.COMMON.subjects;
            textbook.grades = config.DROPDOWN.COMMON.grades;
            textbook.showCreateTextBookModal = false;
            textbook.isTextBookCreated = false;
            textbook.userId = $rootScope.userId;
            textbook.mimeType = 'application/vnd.ekstep.content-collection';
            textbook.defaultName = 'Untitled textbook';
            textbook.contentType = 'TextBook';

            textbook.hideCreateTextBookModal = function () {
                $('#createTextBookModal').modal('hide');
                $('#createTextBookModal').modal('hide others');
                $('#createTextBookModal').modal('hide dimmer');
            };

            textbook.initializeModal = function () {
                textbook.showCreateTextBookModal = true;
                $timeout(function () {
                    $('#boardDropDown').dropdown();
                    $('#mediumDropDown').dropdown();
                    $('#subjectDropDown').dropdown();
                    $('#gradeDropDown').dropdown();
                    $('#createTextBookModal').modal({
                        onHide: function () {
                            textbook.data = {};
                            if (!textbook.isTextBookCreated) {
                                $state.go('WorkSpace.ContentCreation');
                            }
                        }
                    }).modal('show');
                }, 10);
            };

            textbook.createContent = function (requestData) {
                textbook.loader = toasterService.loader('', $rootScope.errorMessages.WORKSPACE
                                                                    .CREATE_TEXTBOOK.START);
                contentService.create(requestData).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        textbook.isTextBookCreated = true;
                        textbook.showCreateTextBookModal = false;
                        textbook.loader.showLoader = false;
                        textbook.hideCreateTextBookModal();
                        textbook.initEKStepCE(res.result.content_id);
                    } else {
                        textbook.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_TEXTBOOK
                                                                                    .FAILED);
                    }
                }).catch(function () {
                    textbook.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_TEXTBOOK.FAILED);
                });
            };

            textbook.saveMetaData = function (data) {
                var requestBody = angular.copy(data);
                requestBody.name = requestBody.name ? requestBody.name : textbook.defaultName;
                requestBody.mimeType = textbook.mimeType;
                requestBody.createdBy = textbook.userId;
                requestBody.contentType = textbook.contentType;
                var requestData = {
                    content: requestBody
                };
                textbook.createContent(requestData);
            };

            textbook.initEKStepCE = function (contentId) {
                var params = { contentId: contentId, type: 'TextBook' };
                $state.go('CollectionEditor', params);
            };
        }]);
