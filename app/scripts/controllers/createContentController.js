'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:CreatecontentCtrl
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('createContentCtrl', function($scope, contentService, $timeout, $rootScope, $window, $sce) {
        $scope.showContentEditor = false;
        $scope.iconUpdate = false;
        $scope.formStep = 0;
        $scope.meta = $scope.meta || {};
        $scope.content = $scope.content || {};
        $scope.ekURL = undefined;
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

        $scope.showError = function(message) {
            $scope.messageClass = "red";
            $scope.showMetaLoader = false;
            $scope.message = message;
            $timeout(function() {
                $scope.showDimmer = false;
            }, 2000);
        }

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
                    $scope.showError("Unable to create " + $scope.meta.name + " content.");
                }
            }, function(err) {
                $scope.showError("Unable to create " + $scope.meta.name + " content.");
            });
        }
        $scope.createContent = function(requestBody, nextFlag) {
            contentService.create(requestBody).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content created Successfully.";
                    if (nextFlag) {
                        $scope.formStep = 1;
                    }
                } else {
                    $scope.showError("Unable to create " + $scope.meta.name + " content.");
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showError("Unable to create " + $scope.meta.name + " content.");
            });
        }

        $scope.updateContent = function(requestBody, nextFlag) {
            requestBody.content.versionKey = $scope.versionKey;
            contentService.update(requestBody, $scope.contentId).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content updated Successfully.";
                    if (nextFlag) {
                        $scope.initStepOne();
                    }
                } else {
                    $scope.showError("Unable to update " + $scope.meta.name + " content.");
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showError("Unable to update " + $scope.meta.name + " content.");
            });
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
                $scope.content.url = content.artifactUrl;
            } else {
                $scope.initMeta();
            }
            $scope.showContentEditor = true;
            $scope.applySemantic();
        })

        $scope.closeEditor = function() {
            $scope.showContentEditor = false;
            $rootScope.$emit("editContentDisable", {});
        }

        //create content meta code ends here


        $scope.initStepOne = function() {

            $scope.formStep = 1;
            $scope.content.url = $scope.content.url || undefined;
            $scope.content.file = undefined;
            if ($scope.meta.type == "application/vnd.ekstep.ecml-archive" || $scope.meta.type == "application/vnd.ekstep.html-archive") {
                window.context = {
                    "content_id": "do_11224848119413145617",
                    "sid": "rctrs9r0748iidtuhh79ust993",
                    "user": {
                        "id": "390",
                        "name": "Chetan Sachdev",
                        "email": "chetan.sachdev@tarento.com",
                        "avtar": "https://dev.ekstep.in/media/com_easysocial/defaults/avatars/user/medium.png",
                        "logout": "https://dev.ekstep.in/index.php?option=com_easysocial&view=login&layout=logout"
                    },
                    "baseURL": "https://dev.ekstep.in/",
                    "editMetaLink": "/component/ekcontent/contentform/do_10097535?Itemid=0"
                };
                $scope.ekURL = $sce.trustAsResourceUrl("/thirdparty/content-editor/index.html")
            }
        }



        $scope.updateUrl = function(req, nextFlag) {
            req.content.versionKey = $scope.versionKey;
            req.content.artifactUrl = $scope.content.url;
            contentService.update(req, $scope.contentId).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content updated Successfully.";
                    if (nextFlag) {
                        $scope.formStep = 2;
                    }
                } else {
                    $scope.showError("Unable to update " + $scope.meta.name + " content.");
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showError("Unable to update " + $scope.meta.name + " content.");
            });
        }

        $scope.uploadContent = function(req, nextFlag) {
            var fd = new FormData();
            fd.append("file", $scope.content.file)
            contentService.uploadMedia(fd).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.content.url = res.result.url;
                    $scope.updateUrl(req, nextFlag)
                } else {
                    $scope.showError("Unable to create " + $scope.meta.name + " content.");
                }
            }, function(err) {
                $scope.showError("Unable to create " + $scope.meta.name + " content.");
            });
        }

        $scope.updateMediaContent = function(nextFlag) {
            $scope.showMetaLoader = $scope.showDimmer = true;
            $scope.messageType = "";
            $scope.message = "Saving " + $scope.meta.name + " content, Please wait...";
            if ($scope.meta.type != "application/vnd.ekstep.ecml-archive" && $scope.meta.type != "application/vnd.ekstep.html-archive") {
                var req = {
                    "content": {}
                };
                if ($scope.content.file) {
                    $scope.uploadContent(req, nextFlag);
                } else {
                    $scope.updateUrl(req, nextFlag);
                }
            } else {

            }

        }

        $scope.reviewContent = function() {
            $scope.showMetaLoader = $scope.showDimmer = true;
            $scope.messageType = "";
            $scope.message = "Sending " + $scope.meta.name + " content for review, Please wait...";
            var req = undefined;
            contentService.review(req, $scope.contentId).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content sent for review successfully.";
                } else {
                    $scope.showError("Unable to send for review " + $scope.meta.name + " content.");
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showError("Unable to send for review " + $scope.meta.name + " content.");
            });
        }

        $scope.publishContent = function() {
            $scope.showMetaLoader = $scope.showDimmer = true;
            $scope.messageType = "";
            $scope.message = "Publishing " + $scope.meta.name + " content, Please wait...";
            var req = undefined;
            contentService.publish(req, $scope.contentId).then(function(res) {
                if (res && res.responseCode === "OK") {
                    $scope.contentId = res.result.content_id;
                    $scope.versionKey = res.result.versionKey;
                    $scope.messageClass = "green";
                    $scope.message = $scope.meta.name + " content published successfully.";
                    $scope.formStep = -1;
                    $scope.closeEditor();
                } else {
                    $scope.showError("Unable to publish " + $scope.meta.name + " content.");
                }
                $scope.showMetaLoader = false;
                $timeout(function() {
                    $scope.showDimmer = false;
                }, 2000);
            }, function(error) {
                $scope.showError("Unable to publish" + $scope.meta.name + " content.");
            });
        }

    });
