'use strict'

angular.module('playerApp')
    .service('batchService', ['httpServiceJava', 'config', function (httpServiceJava, config) {
         /**
     * @class batchService
     * @desc Service to manage batches.
     * @memberOf Services
     */
      var batchDetails = ''
        /**
             * @method create
             * @desc Create a new batch
             * @memberOf Services.batchService
             * @param {Object} request - Request object
             * @param {string} request.courseId - Course Id.
             * @param {string} request.name - Name of batch
             * @param {string} request.description - Description of batch.
             * @param {string} request.enrollmentType - Enrollment type for batch ie-Open, invite-only.
             * @param {string} request.startDate - Start date batch
             * @param {string} request.endDate - End date for batch
             * @param {Object[]} request.createdFor - UserId list of mentees.
             * @param {Object[]} request.mentor - UserId list of Mentors
             * @returns {Promise} Promise object containing response code and batch id.
             * @instance
             */
      this.create = function (req) {
        return httpServiceJava.post(config.URL.BATCH.CREATE, req)
      }
         /**
             * @method update
             * @desc Update a existing batch
             * @memberOf Services.batchService
             * @param {Object} request - Request object
             * @param {string} request.id - Batch id.
             * @param {string} request.courseId - Course Id.
             * @param {string} request.name - Name of batch
             * @param {string} request.description - Description of batch.
             * @param {string} request.enrollmentType - Enrollment type for batch ie-Open, invite-only.
             * @param {string} request.startDate - Start date batch
             * @param {string} request.endDate - End date for batch
             * @param {Object[]} request.createdFor - UserId list of mentees.
             * @param {Object[]} request.mentor - UserId list of Mentors
             * @returns {Promise} Promise object containing response code.
             * @instance
             */

      this.update = function (req) {
        return httpServiceJava.patch(config.URL.BATCH.UPDATE, req)
      }
         /**
             * @method addUsers
             * @desc Add mentee to existing batch
             * @memberOf Services.batchService
             * @param {Object} request - Request object
             * @param {Object[]} request.userIds - UserId list of mentees.
             * @param {string} batchId - Batch id.
             * @returns {Promise} Promise object containing response code corresponding to each mentee.
             * @instance
             */

      this.addUsers = function (req, batchId) {
        return httpServiceJava.post(config.URL.BATCH.ADD_USERS + '/' + batchId, req)
      }

      this.removeUsers = function (req) {
        return httpServiceJava.remove(config.URL.BATCH.DELETE + '/' + req.batchId, req)
      }
        /**
             * @method getBatchDetails
             * @desc Get batch details
             * @memberOf Services.batchService
             * @param {Object} request - Request object
             * @param {string} request.batchId - Batch id.
             * @returns {Promise} Promise object containing  batch details.
             * @instance
             */

      this.getBatchDetails = function (req) {
        return httpServiceJava.get(config.URL.BATCH.GET_DETAILS + '/' + req.batchId, req)
      }
        /**
             * @method getAllBatches
             * @desc Get list of all batches
             * @memberOf Services.batchService
             * @param {Object} request - Request object
             * @param {Object} request.filters - Filters
             * @param {string} request.filters.courseId - CourseId
             * @param {string} request.filters.createdBy - UserId of user who create the batch
             * @param {string} request.filters.enrollmentType - Open or invite-only.
             * @returns {Promise} Promise object containing  list of batches
             * @instance
             */

      this.getAllBatchs = function (req) {
        return httpServiceJava.post(config.URL.BATCH.GET_BATCHS, req)
      }
        /**
             * @method getAllBatches
             * @desc Get list of all batches
             * @memberOf Services.batchService
             * @param {Object} request - Request object
             * @param {Object} request.filters - Filters
             * @param {Object[]} request.filters.identifier - List of user Ids
             * @param {string} request.filters.organisations.organisationId - To get
             *  all the user of some particular organization.
             * @param {string} request.filters.enrollmentType - Open or invite-only.
             * @returns {Promise} Promise object containing  list of batches
             * @instance
             */

      this.getUserList = function (req) {
        return httpServiceJava.post(config.URL.ADMIN.USER_SEARCH, req)
      }
         /**
             * @method setBatchData
             * @desc Set batch data locally
             * @memberOf Services.batchService
             * @param {Object} batchData - Batch data request
             * @instance
             */

      this.setBatchData = function (batchData) {
        this.batchDetails = batchData
      }
        /**
             * @method getBatchData
             * @desc Set batch data
             * @memberOf Services.batchService
             * @returns {Object} Object containing of batch data
             * @instance
             */

      this.getBatchData = function () {
        return this.batchDetails
      }
    }])
