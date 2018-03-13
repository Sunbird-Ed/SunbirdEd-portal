'use strict'

angular.module('playerApp')
  .service('batchService', ['restfulLearnerService', 'config', 'permissionsService', 'userService', '$rootScope',
    function (restfulLearnerService, config, permissionsService, userService, $rootScope) {
      /**
       * @class batchService
       * @desc Service to manage batches.
       * @memberOf Services
       */
      this.batchDetails = ''
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
        return restfulLearnerService.post(config.URL.BATCH.CREATE, req)
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
        return restfulLearnerService.patch(config.URL.BATCH.UPDATE, req)
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
        return restfulLearnerService.post(config.URL.BATCH.ADD_USERS + '/' + batchId, req)
      }

      this.removeUsers = function (req) {
        return restfulLearnerService.remove(config.URL.BATCH.DELETE + '/' + req.batchId, req)
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
        return restfulLearnerService.get(config.URL.BATCH.GET_DETAILS + '/' + req.batchId, req)
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
        return restfulLearnerService.post(config.URL.BATCH.GET_BATCHS, req)
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
        return restfulLearnerService.post(config.URL.ADMIN.USER_SEARCH, req)
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

      this.getUserOtherDetail = function (userData) {
        if (userData.email && userData.phone) {
          return ' (' + userData.email + ', ' + userData.phone + ')'
        }
        if (userData.email && !userData.phone) {
          return ' (' + userData.email + ')'
        }
        if (!userData.email && userData.phone) {
          return ' (' + userData.phone + ')'
        }
      }

      this.getRequestBodyForUserSearch = function (query, users) {
        var request = {
          filters: {}
        }
        if (query) {
          request.query = query
        }
        if (users) {
          request.filters['identifier'] = users
        }
        var isCourseMentor = permissionsService.getRoleOrgMap() && permissionsService.getRoleOrgMap()['COURSE_MENTOR']
        var profile = userService.getCurrentUserProfile()
        if (isCourseMentor && isCourseMentor.includes(profile.rootOrgId)) {
          request.filters['rootOrgId'] = profile.rootOrgId
        } else {
          try {
            var orgIds = permissionsService.getRoleOrgMap()['COURSE_MENTOR']
            _.remove(orgIds, function (id) {
              return id === profile.rootOrgId
            })
          } catch (error) {
            console.error(error)
          }
          request.filters['organisations.organisationId'] = orgIds
        }
        return {
          request: request
        }
      }

      this.filterUserSearchResult = function (userData, query) {
        if (query) {
          var fname = userData.firstName !== null && userData.firstName.includes(query)
          var lname = userData.lastName !== null && userData.lastName.includes(query)
          var email = userData.email !== null && userData.email.includes(query)
          var phone = userData.phone !== null && userData.phone.includes(query)
          return fname || lname || email || phone
        } else {
          return true
        }
      }
    }])
