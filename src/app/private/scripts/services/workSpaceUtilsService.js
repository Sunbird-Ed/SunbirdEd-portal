'use strict'

angular.module('playerApp')
  .service('workSpaceUtilsService',
    ['$state', '$window', '$location', 'config',
      function ($state, $window, $location, config) {
        /**
     * @class workSpaceUtilsService
     * @desc Service to manage workspace.
     * @memberOf Services
     */
        this.baseUrl = new $window.URL($location.absUrl()).origin + '/'

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
            return requestData.indexOf(content.identifier) === -1
          })
        }

        /**
     * @method collectionEditor
     * @desc State transaction to collection editor
     * @memberOf Services.workSpaceUtilsService
     * @param {Object}  item - Item
     * @param {string}  state - Present state
     * @instance
     */
        this.collectionEditor = function (item, state) {
          var params = {
            contentId: item.identifier,
            type: item.contentType,
            state: state
          }
          if (item.framework) {
            params.framework = item.framework
          }
          $state.go('CollectionEditor', params)
        }

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
          }
          $state.go('ContentEditor', params)
        }

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
          }
          $state.go('GenericEditor', params)
        }

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
          }
          $state.go('PreviewContent', params)
        }

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
          })
        }

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
            this.collectionEditor(item, state)
          } else if (item.mimeType === 'application/vnd.ekstep.ecml-archive') {
            this.contentEditor(item, state)
          } else {
            this.genericEditor(item, state)
          }
        }

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
            this.collectionEditor(item, state)
          } else {
            this.previewContent(item, state)
          }
        }

        /**
     * @method getPublicShareUrl
     * @desc generate the url to play content for public users.
     * @memberOf Services.workSpaceUtilsService
     * @param {string}  identifier - content or course identifier
     * @param {string}  type - content or course type
     * @returns {string} url to share.
     * @instance
     */
        this.getPublicShareUrl = function (identifier, type) {
          return this.baseUrl + type + '/' + identifier
        }

        /**
     * @method getBase64Url
     * @desc generate the base url to play unlisted content for public users.
     * @memberOf Services.getBase64Url
     * @param {string}  identifier - content or course identifier
     * @param {string}  type - content or course type
     * @returns {string} base64url to share.
     * @instance
     */
        this.getBase64Url = function (type, identifier) {
          return btoa(type + '/' + identifier)
        }

        /**
     * @method getUnlistedShareUrl
     * @desc generate the url to play unlisted content for other users.
     * @memberOf Services.workSpaceUtilsService
     * @param {object}  cData - content data
     * @returns {string} url to share.
     * @instance
     */
        this.getUnlistedShareUrl = function (cData) {
          if (cData.contentType === 'Course') {
            return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('course', cData.identifier)
          } else if (cData.mimeType === 'application/vnd.ekstep.content-collection') {
            return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('collection', cData.identifier)
          } else {
            return this.baseUrl + 'unlisted' + '/' + this.getBase64Url('content', cData.identifier)
          }
        }

        /**
     * @method hideRemoveModel
     * @desc hide the remove conetent model.
     * @memberOf Services.workSpaceUtilsService
     * @param {string}  modelId - Id of the model
     * @instance
     */
        this.hideRemoveModel = function (modelId) {
          $(modelId).modal('hide')
          $(modelId).modal('hide all')
          $(modelId).modal('hide other')
          $(modelId).modal('hide dimmer')
        }
      }])
