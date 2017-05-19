'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:UseruserContentCtrl
 * @description
 * # UseruserContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('UsercontentCtrl', function(contentService, $rootScope) {
        var userContent = this;
        userContent.contentItem = undefined;
        userContent.hideUserContent = false;

        userContent.getPublishedContent = function() {
            var req = {
                "filters": {
                    "createdBy": "12345678",
                    "status": ["live"],
                    "contentType": ["application/pdf", "video/youtube", "video/mp4", "application/vnd.ekstep.ecml-archive","application/vnd.ekstep.html-archive"]
                },
                "params": {
                    "cid": "12"
                }
            }
            contentService.search(req).then(function(res) {
                    userContent.content = undefined;
                    if (res.responseCode === 'OK' && res.result.count > 0) {
                        userContent.publishedContent = res.result.content;
                    }
                }),
                function(errorMessage) {
                    $log.warn(errorMessage);
                };

        };
        userContent.getPublishedContent();
        userContent.getDraftContent = function() {
            var req = {
                "filters": {
                    "createdBy": "12345678",
                    "status": ["draft"]
                },
                "params": {
                    "cid": "12"
                }
            }
            contentService.search(req).then(function(res) {
                    userContent.content = undefined;
                    if (res.responseCode === 'OK' && res.result.count > 0) {
                        userContent.draftContent = res.result.content;
                    }
                }),
                function(errorMessage) {
                    $log.warn(errorMessage);
                };

        };
        userContent.getDraftContent();
        userContent.loadRating = function() {
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
            $('.popup-button').popup();

        };

        userContent.editContent = function(content){
            userContent.hideUserContent = true;
            $rootScope.$emit("editContentEnable", content);
        }

        $rootScope.$on("editContentDisable",function (e,c) {
            userContent.hideUserContent = false;
            userContent.getDraftContent();
            userContent.getPublishedContent();
        })
    });
