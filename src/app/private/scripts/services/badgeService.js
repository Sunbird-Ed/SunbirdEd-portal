/**
 * @author: Anuj Gupta
 * @description: This service useful to handle badge data
 */
'use strict'

angular.module('playerApp')
  .service('badgeService', ['restfulLearnerService', 'config', 'permissionsService', 'userService', '$rootScope',
    function (restfulLearnerService, config, permissionsService, userService, $rootScope) {
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
      this.getAllBadgesList = function (data) {
        var url = config.URL.BADGE.BADGE_CLASS_SEARCH
        return restfulLearnerService.post(url, data)
      }

      /**
       * @method getDetailedBadgeAssertions
       * @description Get list of detailed badge assertions details including description.
       * @param {*} data Search badges request data.
       * @param {*} assertions List of badge assertions.
       * @returns {Promise} Promise object containing response code and message.
       */
      this.getDetailedBadgeAssertions = function (data, assertions) {
        return new Promise(function (resolve, reject) {
          var url = config.URL.BADGE.BADGE_CLASS_SEARCH
          restfulLearnerService.post(url, data).then(function (badgeSearchResponse) {
            var detailedAssertions = assertions
            if (badgeSearchResponse && badgeSearchResponse.responseCode === 'OK') {
              if (badgeSearchResponse.result && badgeSearchResponse.result.badges) {
                angular.forEach(detailedAssertions, function (detailedAssertion) {
                  var badgeFound = _.find(badgeSearchResponse.result.badges, { 'badgeId': detailedAssertion.badgeId })
                  if (badgeFound) {
                    detailedAssertion.description = badgeFound.description
                  }
                })
              }
            }
            resolve(detailedAssertions)
          }).catch(function (error) {
            reject(error)
          })
        })
      }
    }])
