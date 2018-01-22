'use strict'

angular.module('playerApp')
  .service('learnService', ['restfulLearnerService', 'config', function (restfulLearnerService, config) {
    /**
     * @class learnService
     * @desc Service to manage courses.
     * @memberOf Services
     */

    /**
         * @method enrolledCourses
         * @desc Get user's enrolled courses
         * @memberOf Services.learnService
         * @param {string}  uid - UserId of user
         * @returns {Promise} Promise object represents the list of user's enrolled courses
         * @instance
         */
    this.enrolledCourses = function (uid) {
      var url = config.URL.COURSE.GET_ENROLLED_COURSES + '/' + uid
      return restfulLearnerService.get(url)
    }

    this.otherSections = function () {
      return restfulLearnerService.get(config.URL.COURSE.GET_LEARN_OTHER_SECTION)
    }
    /**
         * @method recommendedCourses
         * @desc Get user's recommended courses
         * @memberOf Services.learnService
         * @param {object}  request - Request object.
         * @param {string}  request.recommendType - Recommended type ie-'course'
         * @returns {Promise} Promise object represents the list of user's Recommended courses
         * @instance
         */
    this.recommendedCourses = function () {
      return restfulLearnerService.get(config.URL.COURSE.RECOMMENDED_COURSE)
    }
  }])
