'use strict'

angular.module('playerApp')
  .service('pageSectionService', ['restfulLearnerService', 'searchService',
    function (restfulLearnerService, searchService) {
    /**
     * @class pageSectionService
     * @desc Service to manage sections of page.
     * @memberOf Services
     */
    /**
         * @method getPageData
         * @desc Get page sections
         * @memberOf Services.pageSectionService
         * @param {string}  path - Url path of page
         * @param {object}  request - Request object
         * @param {string}  request.source - Source ie. 'Web'
         * @param {string}  request.name - Page type url ie- 'resource' or  'course'
         * @returns {Promise} Promise object represents sections of a page
         * @instance
         */
      this.getPageData = function (path, req) {
        req.request = searchService.updateReqForChannelFilter(req.request)
        return restfulLearnerService.post(path, req)
      }
    }])
