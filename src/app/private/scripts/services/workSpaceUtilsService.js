'use strict';

angular.module('playerApp')
    .service('workSpaceUtilsService', ['$state', function ($state) {
            
        this.removeContentLocal = function (contentList, requestData) {		
            return contentList.filter(function (content) {		
                return requestData.indexOf(content.identifier) === -1;		
           });		
        };

        this.collectionEditor = function (item, state) {
            $state.go('CollectionEditor', {
                contentId: item.identifier,
                type: item.contentType,
                state: state
            });
        };

        this.contentEditor = function (item, state) {
            var params = {
                contentId: item.identifier,
                state: state
            };
            $state.go('ContentEditor', params);
        };

        this.genericEditor = function (item, state) {
            var params = {
                contentId: item.identifier,
                state: state
            };
            $state.go('GenericEditor', params);
        };

        this.previewContent = function (item, state) {
            var params = {
                contentId: item.identifier,
                backState: state
            };
            $state.go('PreviewContent', params);
        };

        this.previewCollection = function (item, state) {
            $state.go('PreviewCollection', {
                Id: item.identifier,
                name: item.name,
                backState: state
            });
        };

        this.openContentEditor = function (item, state) {
            if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                this.collectionEditor(item, state);
            } else if (item.mimeType === 'application/vnd.ekstep.ecml-archive') {
                this.contentEditor(item, state);
            } else {
                this.genericEditor(item, state);
            }
        };

        this.openContentPlayer = function (item, state) {
            if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                this.collectionEditor(item, state);
            } else {
                this.previewContent(item, state);
            }
        };
    }]);
