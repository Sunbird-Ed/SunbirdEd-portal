'use strict'

angular.module('playerApp')
  .service('adminService', ['config', 'restfulLearnerService', function (config, restfulLearnerService) {
    /**
     * @class adminService
     * @desc Service to manage user settings.
     * @memberOf Services
     */
    /**
             * @method userSearch
             * @desc Search a user
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {string} request.query - Search query.
             * @param {Object} request.filter - Filter applied on search:- ie. Grades,Medium,Subject.
             * @returns {Promise} Promise object represents the list of users
             * @instance
             */
    this.userSearch = function (req) {
      var url = config.URL.ADMIN.USER_SEARCH
      return restfulLearnerService.post(url, req)
    }
    /**
             * @method orgSearch
             * @desc Search a organization
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {string} request.query - Search query.
             * @param {Object} request.filter - Filter applied on search:- ie. Org type.
             * @returns {Promise} Promise object represents the list of organizations
             * @instance
             */
    this.orgSearch = function (req) {
      var url = config.URL.ADMIN.ORG_SEARCH
      return restfulLearnerService.post(url, req)
    }
    /**
             * @method deleteUser
             * @desc delete a user
             * @memberOf Services.adminService
             * @param {Object}  request - Request object to delete a user
             * @param {string} request.userId - UserId of user .
             * @returns {Promise} Promise object containing response code and message
             * @instance
             */

    this.deleteUser = function (req) {
      var url = config.URL.ADMIN.DELETE_USER
      return restfulLearnerService.post(url, req)
    }
    /**
             * @method updateRoles
             * @desc Update user roles
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {string} request.userId - UserId of user .
             * @param {string} request.organizationId - Organization where user belongs .
             * @param {Object[]} request.roles - Roles of user .
             * @returns {Promise} Promise object containing response code and message
             * @instance
             */

    this.updateRoles = function (req) {
      var url = config.URL.ADMIN.UPDATE_USER_ORG_ROLES
      return restfulLearnerService.post(url, req)
    }
    /**
             * @method bulkUserUpload
             * @desc Bulk upload  users .
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {Object[]} request.users  - .csv file of users.
             * @param {string} request.organizationId - Organization where user belongs .
             * @returns {Promise} Promise object containing process Id of bulk upload
             * @instance
             */

    this.bulkUserUpload = function (req) {
      var url = config.URL.ADMIN.BULK.USERS_UPLOAD
      return restfulLearnerService.upload(url, req)
    }
    /**
             * @method bulkOrgUpload
             * @desc Bulk upload  users .
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {Object[]} request.orgs  - .csv file of organizations.
             * @returns {Promise} Promise object containing process Id of bulk upload
             * @instance
             */
    this.bulkOrgrUpload = function (req) {
      var url = config.URL.ADMIN.BULK.ORGANIZATIONS_UPLOAD
      return restfulLearnerService.upload(url, req)
    }
    /**
             * @method bulkUploadStatus
             * @desc Bulk upload  users .
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {string}  request.id - process id response of bulk upload
             * @returns {Promise} Promise object containing uploaded organizations/users status
             * @instance
             */

    this.bulkUploadStatus = function (processId) {
      var url = config.URL.ADMIN.BULK.STATUS + '/' + processId
      return restfulLearnerService.get(url)
    }

    /**
             * @method addBadges
             * @desc assign badge to  users .
             * @memberOf Services.adminService
             * @param {Object}  request - Request object
             * @param {string}  request.badgeTypeId - Badge type id
             * @param {string}  request.receiverId - User  id
             * @returns {Promise} Promise object containing response code and message.
             * @instance
             */

    this.addBadges = function (req) {
      var url = config.URL.BADGE.ASSIGN
      return restfulLearnerService.post(url, req)
    }
    /**
             * @method getBadges
             * @desc Get badges
             * @memberOf Services.adminService
             * @returns {Promise} Promise object containing list of badges.
             * @instance
             */
    this.getBadges = function () {
      var url = config.URL.BADGE.GET
      return restfulLearnerService.get(url)
    }
    /**
             * @method setBadges
             * @desc Set badges to a local variable
             * @memberOf Services.adminService
             * @param {Object}  request - List of badges
             * @instance
             */
    this.setBadges = function (badges) {
      this.badges = badges.result.response
    }

    /**
             * @method getBadgesList
             * @desc Get locally saved badges list or api call
             * @memberOf Services.adminService
             * @returns {Promise} Promise object containing list of badges.
             * @instance
             */
    this.getBadgesList = function () {
      return this.badges ? this.badges : this.getBadges().then(function (res) {
        return res.result.response
      })
    }
  }])
