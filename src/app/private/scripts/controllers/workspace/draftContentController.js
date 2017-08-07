'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:DraftContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('DraftContentController', function(contentService, searchService, config, $rootScope, $state, ToasterService) {

        var draftContent = this;
        draftContent.userId = $rootScope.userId;

        function getDraftContent() {

            draftContent.loader = ToasterService.loader("", $rootScope.errorMessages.WORKSPACE.DRAFT.START);

            var request = {
                filters: {
                    status: ["Draft"],
                    createdBy: draftContent.userId,
                    mimeType: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.content-collection']
                },
                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            
            draftContent.draftContentData = [];
            searchService.search(request).then(function(res) {
                if (res && res.responseCode === 'OK') {
                    draftContent.loader.showLoader = false;
                    draftContent.draftContentData = res.result.content;
                    if (res.result.count === 0) {
                        draftContent.zeroContentMessage = $rootScope.errorMessages.WORKSPACE.DRAFT.NO_CONTENT;
                    }
                } else {
                    draftContent.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages.WORKSPACE.DRAFT.FAILED);
                }
            })
            .catch(function(error) {
                draftContent.loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.WORKSPACE.DRAFT.FAILED);
            });
        };

        draftContent.initializeData = function() {
            getDraftContent();
        };

        draftContent.openContentEditor = function(item) {
            if (item.mimeType === "application/vnd.ekstep.content-collection") {
                $state.go("CollectionEditor", { contentId: item.identifier, type: item.contentType, state: "WorkSpace.DraftContent" });
            } else {
                $state.go("EditContent", { contentId: item.identifier });
            }
        };
    });
