/**
  * @namespace Services
  */

'use strict'

angular.module('playerApp')
  .service('setupService', ['config', 'restfulLearnerService', function (config, restfulLearnerService) {
    /**
     * @class setupService
     * @desc Service to manage org types
     * @memberOf Services
     */

    /**
         * @method addOrgType
         * @desc Add new org type
         * @memberOf Services.setupService
         * @param {Object}  request -Request to add new org type
         * @param {string} request.name - The name of the org type.
         * @returns {Promise} Promise object represents the response code and message
         * @instance
         */
    this.addOrgType = function (req) {
      var url = config.URL.ORG_TYPE.ADD
      return restfulLearnerService.post(url, req)
    }
    /**
         * @method updateOrgType
         * @desc Update existing org types
         * @memberOf Services.setupService
         * @param {Object}  request -Request to update existing org type
         * @param {string} request.name - The name of the org type.
         * @param {string} request.id - The id of the org type.
         * @returns {Promise} Promise object represents the response code and message
         * @instance
         */
    this.updateOrgType = function (req) {
      var url = config.URL.ORG_TYPE.UPDATE
      return restfulLearnerService.patch(url, req)
    }
    /**
         * @method getOrgTypes
         * @desc Get list of existing org types
         * @memberOf Services.setupService
         * @returns {Promise} Promise object represents the list of org types
         * @instance
         */
    this.getOrgTypes = function () {
      var url = config.URL.ORG_TYPE.GET
      return restfulLearnerService.get(url)
    }
  }])
