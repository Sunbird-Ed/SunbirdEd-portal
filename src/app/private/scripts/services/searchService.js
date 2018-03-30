'use strict'

angular.module('playerApp')
  .service('searchService', ['restfulContentService', 'config', '$q', 'restfulLearnerService', '$rootScope',
    function (restfulContentService, config, $q, restfulLearnerService, $rootScope) {
      /**
     * @class searchService
     * @desc Service to manage different type of search.
     * @memberOf Services
     */
      /**
             * @method contentSearch
             * @desc Search contents
             * @memberOf Services.searchService
             * @param {object}  request - Request object
             * @param {string}  request.query - Search query
             * @param {object}  request.filters - Filters object
             * @param {object[]}  request.filters.Curriculum - Filter results by curriculum
             * @param {object[]}  request.filters.ContentTypes - Filter results  by Content Types
             * @param {object[]}  request.filters.Medium - Filter results by medium
             * @param {object[]}  request.filters.Subjects - Filter results by subjects
             * @param {object[]}  request.filters.Concepts - Filter results by concepts
             * @param {object}  request.sort_by - Sort_by object
             * @param {string}  request.sort_by.modifiedOn - Sort search results by modified date
             * @param {string}  request.sort_by.createdOn - Sort search results by created date
             * @param {string}  request.offset - Limit number of results
             * @param {string}  request.limit - Number of result per page
             * @returns {Promise} Promise object represents the list of content
             * @instance
             */

      this.contentSearch = function (req) {
        if (!req.filters.contentType) {
          req.filters.contentType = [
            'Collection',
            'TextBook',
            'LessonPlan',
            'Resource',
            'Story',
            'Worksheet',
            'Game'
          ]
        }
        return restfulContentService.post(config.URL.CONTENT.SEARCH, req)
      }
      /**
             * @method courseSearch
             * @desc Search courses
             * @memberOf Services.searchService
             * @param {object}  request - Request object
             * @param {string}  request.query - Search query
             * @param {object}  request.filters - Filters object
             * @param {object[]}  request.filters.Curriculum - Filter results by curriculum
             * @param {object[]}  request.filters.Medium - Filter results by medium
             * @param {object[]}  request.filters.Subjects - Filter results by subjects
             * @param {object[]}  request.filters.Concepts - Filter results by concepts
             * @param {object}  request.sort_by - Sort_by object
             * @param {string}  request.sort_by.modifiedOn - Sort search results by modified date
             * @param {string}  request.sort_by.createdOn - Sort search results by created date
             * @param {string}  request.offset - Limit number of results
             * @param {string}  request.limit - Number of result per page
             * @returns {Promise} Promise object represents the list of courses
             * @instance
             */

      this.courseSearch = function (req) {
        return restfulContentService.post(config.URL.COURSE.SEARCH, req)
      }
      /**
             * @method search
             * @desc Search All possible results of query.
             * @memberOf Services.searchService
             * @param {object}  request - Request object
             * @param {string}  request.query - Search query
             * @param {object}  request.filters - Filters object
             * @param {object[]}  request.filters.status - Filter results by status of result ie-live active
             * @param {object[]}  request.filters.createdBy - Filter results by userId
             * @param {object[]}  request.filters.objectType - Filter results by objectType
             * @param {object[]}  request.filters.contentType - Filter results by contentType
             * @param {object}  request.sort_by - Sort_by object
             * @param {string}  request.sort_by.lastUpdatedOn - Sort search results by last updated date
             * @param {string}  request.offset - Limit number of results
             * @param {string}  request.limit - Number of result per page
             * @returns {Promise} Promise object represents the list of search results
             * @instance
             */

      this.search = function (req) {
        return restfulContentService.post(config.URL.COMPOSITE.SEARCH, req)
      }
      /**
             * @method setPublicUserProfile
             * @desc Set user's public profile to local variable.
             * @memberOf Services.searchService
             * @returns {string} Boolean value
             * @instance
             */
      this.setPublicUserProfile = function (user) {
        this.publicUser = { responseCode: 'OK',
          result: {
            response: user }
        }
        return true
      }
      /**
             * @method getPublicUserProfile
             * @desc Get user's public profile from local variable or api
             * @memberOf Services.searchService
             * @param {string}  identifier - Identifier of user
             * @returns {Promise} Promise object represents details of user available locally or api
             * @instance
             */
      this.getPublicUserProfile = function (identifier, endorsement) {
        if (endorsement !== undefined) {
          return restfulContentService.get(config.URL.USER.GET_PROFILE + '/' + identifier)
        }
        if (this.publicUser) {
          var deferred = $q.defer()
          deferred.resolve(this.publicUser)
          return deferred.promise
        }
        return restfulContentService.get(config.URL.USER.GET_PROFILE + '/' + identifier)
      }
      /**
             * @method getOrgTypes
             * @desc Get all org types
             * @memberOf Services.searchService
             * @returns {Promise} Promise object represents list of orgTypes
             * @instance
             */
      this.getOrgTypes = function () {
        var url = config.URL.ORG_TYPE.GET
        return restfulLearnerService.get(url)
      }
      /**
             * @method setOrgTypes
             * @desc Set orgTypes api result to local variable
             * @memberOf Services.searchService
             * @param {object}  orgTypes - list of OrgTypes.
             * @instance
             */
      this.setOrgTypes = function (orgTypes) {
        this.orgTypes = orgTypes
      }

      /**
             * @method getOrgTypeS
             * @desc Get list of orgTypes
             * @memberOf Services.searchService
             * @returns {Promise} Promise object represents list of orgTypes available locally or api
             * @instance
             */
      this.getOrgTypeS = function () {
        if (this.orgTypes) {
          var deferred = $q.defer()
          deferred.resolve(this.orgTypes)
          return deferred.promise
        }
        return this.getOrgTypes().then(function (res) {
          if (res.responseCode === 'OK') {
            return res.result.response
          }
        })
      }

      this.getChannel = function (channel) {
        channel = channel || org.sunbird.portal.channel
        return restfulContentService.get(config.URL.CHANNEL.READ + '/' + channel)
      }

      this.getFramework = function (id) {
        return restfulContentService.get(config.URL.FRAMEWORK.READ + '/' + id)
      }
    }])
