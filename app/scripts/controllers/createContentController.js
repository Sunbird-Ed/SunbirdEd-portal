'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:CreatecontentCtrl
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('createContentCtrl', function($scope, contentService, $timeout, $rootScope) {
        $scope.showContentEditor = false;
        $scope.iconUpdate = false;
        $scope.formStep = 0;
        $scope.meta = $scope.meta || {};
        $scope.initMeta = function() {
            $scope.meta.name = "";
            $scope.meta.description = "";
            $scope.meta.type = "application/vnd.ekstep.ecml-archive";
            $scope.iconImage = undefined;
            $scope.versionKey = undefined;
            $scope.contentId = undefined;
            $scope.iconUpdate = false;
        }
        $scope.initMeta();
        $scope.applySemantic = function() {
            $timeout(function() {
                $("#contenttype").dropdown();
            })
        }

        $scope.updateIcon = function(files) {
            if (files) {
                var fd = new FormData();
                if (files.length) {

                }
                fd.append("file", files[0]);

                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.iconImage = e.target.result;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
                $scope.icon = fd;
                $scope.iconUpdate = true;
            }
        };

        $scope.openImageBrowser = function() {
            $('#iconImageInput').click();
        }

        $scope.saveMetaContent = function(nextFlag) {
            $scope.showMetaLoader = $scope.showDimmer = true;
            $scope.messageType = "";
            $scope.message = "Saving " + $scope.meta.name + " content, Please wait...";
            var requestBody = {
                "content": {
                    "mimeType": $scope.meta.type,
                    "contentType": "Story",
                    "name": $scope.meta.name,
                    "description": $scope.meta.description,
                    "createdBy": "12345678"
                },
                "params": {
                    "cid": "new",
                    "sid": "12345"
                }
            }

            if ($scope.iconUpdate) {
                $scope.uploadOrUpdateAppIcon(requestBody, nextFlag)
            } else {
                if ($scope.contentId) {
                    $scope.updateContent(requestBody, nextFlag);
                } else {
                    $scope.createContent(requestBody, nextFlag);
                }
            }


        }
        $scope.uploadOrUpdateAppIcon = function(requestBody, nextFlag) {

            contentService.uploadMedia($scope.icon).then(function(res) {
                if (res && res.responseCode === "OK") {
                    requestBody.content.appIcon = res.result.url;
                    if ($scope.contentId) {
                        $scope.updateContent(requestBody, nextFlag)
                    } else {
                        $scope.createContent(requestBody, nextFlag);
                    }

                } else {
                    $scope.showContentCreationError();
                }
            }, function(err) {
                $scope.showContentCreationError();
            });
        }
        $scope.createContent = function(requestBody, nextFlag) {
            contentService.create(requestBody).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content created Succesfully.";
                    if (nextFlag) {
                        $scope.formStep = 1;
                        console.log($scope.meta.type);
                    }
                } else {
                    $scope.showContentCreationError();
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showContentCreationError();
            });
        }

        $scope.updateContent = function(requestBody, nextFlag) {
            requestBody.content.versionKey = $scope.versionKey;
            contentService.update(requestBody, $scope.contentId).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content updated Succesfully.";
                    if (nextFlag) {
                        $scope.formStep = 1;
                    }
                } else {
                    $scope.showContentUpdateError();
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showContentUpdateError();
            });
        }

        $scope.showContentCreationError = function() {
            $scope.messageClass = "red";
            $scope.showMetaLoader = false;
            $scope.message = "Unable to create " + $scope.meta.name + " content.";
            $timeout(function() {
                $scope.showDimmer = false;
            }, 2000);
        }

        $scope.showContentUpdateError = function() {
            $scope.messageClass = "red";
            $scope.showMetaLoader = false;
            $scope.message = "Unable to update " + $scope.meta.name + " content.";
            $timeout(function() {
                $scope.showDimmer = false;
            }, 2000);
        }

        $rootScope.$on("editContentEnable", function(e, content) {
            $scope.formStep = 0;
            if (content) {
                $scope.meta.name = content.name;
                $scope.meta.description = content.description;
                $scope.meta.type = content.mimeType;
                $scope.versionKey = content.versionKey;
                $scope.contentId = content.identifier;
                $scope.iconImage = content.appIcon;
            } else {
                $scope.initMeta();
            }
            $scope.showContentEditor = true;
        })

        $scope.closeEditor = function() {
            $scope.showContentEditor = false;
            $rootScope.$emit("editContentDisable", {});
        }
        $scope.applySemantic();
    });
