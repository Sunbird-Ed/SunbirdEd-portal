'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:UseruserContentCtrl
 * @description
 * # UseruserContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('UsercontentCtrl', function(contentService) {
        var userContent = this;

        userContent.getPublishedContent = function() {
            var req = {
                "filters": {
                    "createdBy": "123456",
                    "status": ["live"]
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
                    "createdBy": "123456",
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
    });
