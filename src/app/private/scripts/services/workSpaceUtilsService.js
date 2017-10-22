'use strict';

angular.module('playerApp')
    .service('workSpaceUtilsService', ['$state', function ($state) {
    /**
     * @class workSpaceUtilsService
     * @desc Service to manage workspace.
     * @memberOf Services
     */

            /**
             * @method removeContentLocal
             * @desc Remove local content
             * @memberOf Services.workSpaceUtilsService
             * @param {Object[]}   contentList - List of content
             * @param {Object[]}  requestData - Requested data
             * @returns {Promise} Promise object represents filtered content list
             * @instance
             */
        this.removeContentLocal = function (contentList, requestData) {
            return contentList.filter(function (content) {
                return requestData.indexOf(content.identifier) === -1;
            });
        };
            /**
             * @method collectionEditor
             * @desc State transaction to collection editor
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */
        this.collectionEditor = function (item, state) {
            $state.go('CollectionEditor', {
                contentId: item.identifier,
                type: item.contentType,
                state: state
            });
        };
            /**
             * @method contentEditor
             * @desc State transaction to content editor
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */
        this.contentEditor = function (item, state) {
            var params = {
                contentId: item.identifier,
                state: state
            };
            $state.go('ContentEditor', params);
        };
            /**
             * @method genericEditor
             * @desc State transaction to generic editor
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */
        this.genericEditor = function (item, state) {
            var params = {
                contentId: item.identifier,
                state: state
            };
            $state.go('GenericEditor', params);
        };
            /**
             * @method previewContent
             * @desc State transaction to preview content
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */
        this.previewContent = function (item, state) {
            var params = {
                contentId: item.identifier,
                backState: state
            };
            $state.go('PreviewContent', params);
        };
         /**
             * @method previewCollection
             * @desc State transaction to preview collection
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */

        this.previewCollection = function (item, state) {
            $state.go('PreviewCollection', {
                Id: item.identifier,
                name: item.name,
                backState: state
            });
        };
            /**
             * @method openContentEditor
             * @desc open content editor based item mime type
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */
        this.openContentEditor = function (item, state) {
            if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                this.collectionEditor(item, state);
            } else if (item.mimeType === 'application/vnd.ekstep.ecml-archive') {
                this.contentEditor(item, state);
            } else {
                this.genericEditor(item, state);
            }
        };
            /**
             * @method openContentPlayer
             * @desc open content player based item mime type
             * @memberOf Services.workSpaceUtilsService
             * @param {Object}  item - Item
             * @param {string}  state - Present state
             * @instance
             */
        this.openContentPlayer = function (item, state) {
            if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                this.collectionEditor(item, state);
            } else {
                this.previewContent(item, state);
            }
        };
    }]);
