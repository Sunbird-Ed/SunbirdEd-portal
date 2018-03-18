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
      this.getIssueList = function () {
        var url = config.URL.BADGE.GET_ISSUER_LIST
        return restfulLearnerService.get(url)
      }
      /**
                     * @method getBadges
                     * @desc Get badges
                     * @memberOf Services.adminService
                     * @returns {Promise} Promise object containing list of badges.
                     * @instance
                     */
      this.getAllBadgesList = function (data) {
        var url = config.URL.BADGE.GET_BADGE_CLASS_LIST
        return restfulLearnerService.post(url, data)
      }

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
