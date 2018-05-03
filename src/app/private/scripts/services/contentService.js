'use strict'

angular.module('playerApp')
  .service('contentService', ['restfulContentService', 'config', '$rootScope', 'restfulLearnerService',
    function (restfulContentService, config, $rootScope, restfulLearnerService) {
    /**
     * @class contentService
     * @desc Service to manage content.
     * @memberOf Services
     */
      /**
             * @method create
             * @desc Create a new content
             * @memberOf Services.contentService
             * @param {Object}  request - Request object
             * @param {Object} request.content - Content data
             * @param {string} request.content.mimeType - MimeType of content
             * @param {string} request.content.contentType - ContentType of content
             * @param {string} request.content.name - Name of content
             * @param {string} request.content.description - Description about content
             * @param {string} request.content.createdBy - User identifier of owner
             * @returns {Promise} Promise object contains response code and content Id
             * @instance
             */
      this.create = function (req) {
        var resourceType = _.get(req, 'content.resourceType')
        if (_.isString(resourceType)) {
          req.content.resourceType = [resourceType]
        }
        req.content.organization = $rootScope.organisationNames
        req.content.createdFor = $rootScope.organisationIds
        req.content.creator = $rootScope.firstName + ' ' + $rootScope.lastName
        return restfulContentService.post(config.URL.CONTENT.CREATE, req)
      }
      /**
             * @method copy
             * @desc Copy a content
             * @memberOf Services.contentService
             * @param {Object} request - Request object
             * @param {Object} request.content - Content data
             * @param {string} request.content.description - Description about content
             * @param {string} request.content.code - Code of content
             * @param {string} request.content.createdBy - User identifier of owner
             * @returns {Promise} Promise object contains response code and content Id
             * @instance
             */
      this.copy = function (req, id) {
        req.content.createdFor = $rootScope.organisationIds
        req.content.creator = $rootScope.firstName + ' ' + $rootScope.lastName
        req.content.organization = $rootScope.organisationNames
        var url = config.URL.CONTENT.COPY + '/' + id
        return restfulContentService.post(url, req)
      }
      /**
             * @method publish
             * @desc Publish a content
             * @memberOf Services.contentService
             * @param {Object}  request - Request object
             * @param {Object} request.content - Content data
             * @param {string} request.content.lastPublishedBy - UserId of last Published by user
             * @param {string} id - Content Id
             * @returns {Promise} Promise object contains response code and content Id
             * @instance
             */
      this.publish = function (req, id) {
        var url = config.URL.CONTENT.PUBLISH + '/' + id
        return restfulContentService.post(url, req)
      }
      /**
             * @method retire
             * @desc Retire a  content
             * @memberOf Services.contentService
             * @param {Object}  request - Request object
             * @param {string} request.contentIds - Content Id
             * @returns {Promise} Promise object contains response code and content Id
             * @instance
             */

      this.retire = function (req) {
        var url = config.URL.CONTENT.RETIRE
        return restfulContentService.remove(url, req)
      }
      /**
             * @method reject
             * @desc Reject a  content
             * @memberOf Services.contentService
             * @param {string}  id - Content id
             * @returns {Promise} Promise object contains response code and content Id
             * @instance
             */

      this.reject = function (data, id) {
        var url = config.URL.CONTENT.REJECT + '/' + id
        return restfulContentService.post(url, data)
      }

      /**
             * @method uploadMedia
             * @desc Upload a media
             * @memberOf Services.contentService
             * @param {Object}  request - Upload media file
             * @returns {Promise} Promise object contains response code and uploaded media url
             * @instance
             */
      this.uploadMedia = function (req) {
        return restfulLearnerService.upload(config.URL.CONTENT.UPLOAD_MEDIA, req)
      }

      this.getById = function (req, qs) {
        var url = config.URL.CONTENT.GET + '/' + req.contentId
        return restfulContentService.get(url, req, null, qs)
      }
      /**
             * @method flag
             * @desc Upload a media
             * @memberOf Services.contentService
             * @param {Object}  request- Upload media file
             * @param {Object}  request.flaggedBy - Name of user who is flagging a content
             * @param {Object}  request.versionKey - Content versionKey
             * @param {Object} contentId - Content id
             * @returns {Promise} Promise object contains response code and uploaded media url
             * @instance
             */

      this.flag = function (req, contentId) {
        var url = config.URL.CONTENT.FLAG + '/' + contentId
        return restfulContentService.post(url, req)
      }

      this.acceptContentFlag = function (req, contentId) {
        var url = config.URL.CONTENT.ACCEPT_FLAG + '/' + contentId
        return restfulContentService.post(url, req)
      }

      this.discardContentFlag = function (req, contentId) {
        var url = config.URL.CONTENT.DISCARD_FLAG + '/' + contentId
        return restfulContentService.post(url, req)
      }

      this.validateContent = function (fieldData) {
        if (_.isString(fieldData)) {
          var contentFieldData = [fieldData]
          return (_.isArray(contentFieldData)) ? (_.compact(contentFieldData).join(', ')) : ''
        } else {
          return (_.isArray(fieldData)) ? (_.compact(fieldData).join(', ')) : ''
        }
      }

      this.getConceptsNames = function (concepts) {
        var conceptNames = _.map(concepts, 'name')
        if (concepts && _.isArray(concepts) && conceptNames.length < concepts.length) {
          var filteredConcepts = _.filter($rootScope.concepts, function (p) {
            return _.includes(concepts, p.identifier)
          })
          conceptNames = _.map(filteredConcepts, 'name')
        }
        return conceptNames.join(', ')
      }
    }])
