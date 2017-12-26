'use strict'

angular.module('playerApp')
  .service('noteService', ['restfulLearnerService', 'config', function (restfulLearnerService, config) {
    /**
     * @class noteService
     * @desc Service to manage notes.
     * @memberOf Services
     */
    /**
         * @method search
         * @desc Search notes
         * @memberOf Services.noteService
         * @param {object}  request - Request object
         * @param {object}  request.filters - Filters object
         * @param {string}  request.filters.userId - Search notes by user Id
         * @param {string}  request.filters.courseId - Search notes by course Id
         * @param {string}  request.filters.contentId - Search notes by content Id
         * @param {object}  request.sort_by - Sort_by object
         * @param {string}  request.sort_by.updatedDate - Sort search results by updatedDate
         * @returns {Promise} Promise object represents the list of notes
         * @instance
         */
    this.search = function (req) {
      return restfulLearnerService.post(config.URL.NOTES.SEARCH, req)
    }
    /**
         * @method create
         * @desc Create notes
         * @memberOf Services.noteService
         * @param {object}  request - Request object
         * @param {string}  request.note - Note description
         * @param {string}  request.userId - userId of user
         * @param {string}  request.title - Note tittle
         * @param {string}  request.courseId - Course id
         * @param {string}  request.contentId - Content id
         * @param {string}  request.createdBy - User's name
         * @param {string}  request.updatedBy - userId of user
         * @returns {Promise} Promise object represents the response code and note id
         * @instance
         */

    this.create = function (req) {
      return restfulLearnerService.post(config.URL.NOTES.CREATE, req)
    }
    /**
         * @method update
         * @desc Update existing notes
         * @memberOf Services.noteService
         * @param {string}  id - Note id
         * @param {object}  request - Request object
         * @param {string}  request.note - Note description
         * @param {string}  request.title - Note tittle
         * @param {string}  request.tag - Note tag
         * @param {string}  request.updatedBy - UserId of user
         * @returns {Promise} Promise object represents the response code and note id
         * @instance
         */

    this.update = function (req) {
      var url = config.URL.NOTES.UPDATE + '/' + req.noteId
      return restfulLearnerService.patch(url, req)
    }
    /**
         * @method remove
         * @desc Remove existing notes
         * @memberOf Services.noteService
         * @param {string}  id - Note id
         * @param {object}  request - Request object
         * @param {string}  request.noteId - Note id
         * @returns {Promise} Promise object represents the response code and message
         * @instance
         */

    this.remove = function (req) {
      var url = config.URL.NOTES.DELETE + '/' + req.noteId
      return restfulLearnerService.remove(url, req)
    }
  }])
