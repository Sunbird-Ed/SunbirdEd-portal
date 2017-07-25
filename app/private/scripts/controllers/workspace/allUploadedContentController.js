'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AllUploadedContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('AllUploadedContentController', function(contentService, searchService, config, $rootScope, $state, ToasterService) {

        var allUploadedContent = this;
        allUploadedContent.userId = $rootScope.userId;
        allUploadedContent.contentStatus = ["Draft"];
        allUploadedContent.contentMimeType = ["application/vnd.ekstep.html-archive", "video/youtube", "video/mp4", "application/pdf"];

        function getUploadedContent() {
            
            allUploadedContent.loader = ToasterService.loader("", $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.START);

            var request = {
                filters: {
                    status: allUploadedContent.contentStatus,
                    createdBy: allUploadedContent.userId,
                    mimeType: allUploadedContent.contentMimeType
                },
                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            
            allUploadedContent.allUploadedContentData = [];
            searchService.search(request).then(function(res) {
                if (res && res.responseCode === 'OK') {
                    allUploadedContent.loader.showLoader = false;
                    allUploadedContent.allUploadedContentData = res.result.content;
                    if (res.result.count === 0) {
                        allUploadedContent.zeroContentMessage = $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.NO_CONTENT;
                    }
                } else {
                    allUploadedContent.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.FAILED);
                }
            })
            .catch(function(error) {
                allUploadedContent.loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.FAILED);
            });
        };

        allUploadedContent.initializeData = function() {
            getUploadedContent();
        };

        allUploadedContent.openEditForm = function(item) {
            if (item.mimeType === "application/vnd.ekstep.content-collection") {
                $state.go("CollectionEditor", { contentId: item.identifier, type: item.contentType, state: "WorkSpace.AllUploadedContent" });
            } else {
                var params = { contentId: item.identifier };
                $state.go("EditContent", params);
            }
        };
    });
