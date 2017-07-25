'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:PublishedContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('PublishedContentController', function(contentService, searchService, config, $rootScope, $state, ToasterService) {

        var publishedContent = this;
        publishedContent.userId = $rootScope.userId;

        function getPublishedContent() {

            publishedContent.loader = ToasterService.loader("", $rootScope.errorMessages.WORKSPACE.PUBLISHED.START);

            var request = {
                filters: {
                    status: ["Live"],
                    createdBy: publishedContent.userId
                },

                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            
            publishedContent.publishedContentData = [];
            searchService.search(request).then(function(res) {
                    if (res && res.responseCode === 'OK') {
                        publishedContent.loader.showLoader = false;
                        publishedContent.publishedContentData = res.result.content;
                        if (res.result.count === 0) {
                            publishedContent.zeroContentMessage = $rootScope.errorMessages.WORKSPACE.PUBLISHED.NO_CONTENT;
                        }
                    } else {
                        publishedContent.loader.showLoader = false;
                        ToasterService.error($rootScope.errorMessages.WORKSPACE.PUBLISHED.FAILED);
                    }
                })
                .catch(function(error) {
                    publishedContent.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages.WORKSPACE.PUBLISHED.FAILED);
                });
        };

        publishedContent.initializeData = function() {
            getPublishedContent();
        };

        publishedContent.openContentPlayer = function(item) {
            if (item.mimeType === "application/vnd.ekstep.content-collection") {
                $state.go("CollectionEditor", { contentId: item.identifier, type: item.contentType, state: "WorkSpace.PublishedContent" });
            } else {
                var params = { contentId: item.identifier, backState: $state.current.name };
                $state.go("PreviewContent", params);
            }
        };
    });
