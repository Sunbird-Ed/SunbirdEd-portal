'use strict';

angular.module('playerApp')
    .service('userService', [
        'config',
        'httpService',
        'httpServiceJava',
        function (config, httpService, httpServiceJava) {
     /**
     * @class userService
     * @desc Service to manage user profile.
     * @memberOf Services
     */
            this.currentUserProfile = {};
            this.resourceBundle = function (language, type) {
                var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + '/'
                    + type + '/' + language;
                return httpService.get(url);
            };
            /**
             * @method getUserProfile
             * @desc Get user profile
             * @memberOf Services.userService
             * @param {string}  uId - User identifier
             * @param {Object}  fields - Specific fields i.e-last login time etc(optional)
             * @returns {Promise} Promise object represents user profile
             * @instance
             */

            this.getUserProfile = function (uId, fields) {
                var url = config.URL.USER.GET_PROFILE + '/' + uId;
                if (fields && _.isString(fields)) {
                    url = url + '?fields=' + fields;
                }
                return httpServiceJava.get(url);
            };
            /**
             * @method updateUserProfile
             * @desc Get user profile
             * @memberOf Services.userService
             * @param {Object}  req - Request fields that a user want to update
             * @returns {Promise} Promise object represents response message and code.
             * @instance
             */
            this.updateUserProfile = function (req, name, email) {
                var url = config.URL.USER.UPDATE_USER_PROFILE;
                return httpServiceJava.patch(url, req);
            };
            /**
             * @method getTenantLogo
             * @desc Get tenant logo
             * @memberOf Services.userService
             * @returns {Promise} Promise object represents tenant logo
             * @instance
             */
            this.getTenantLogo = function () {
                return httpService.get(config.URL.USER.TENANT_LOGO);
            };
            /**
             * @method setCurrentUserProfile
             * @desc Set current user profile to local variable
             * @memberOf Services.userService
             * @param {Object}  req - User profile
             * @instance
             */

            this.setCurrentUserProfile = function (userProfile) {
                this.currentUserProfile = userProfile;
            };
            /**
             * @method getCurrentUserProfile
             * @desc Get current user profile from local variable
             * @memberOf Services.userService
             * @returns {Object} Promise object represents current user profile
             * @instance
             */
            this.getCurrentUserProfile = function () {
                return this.currentUserProfile;
            };
            /**
             * @method getSkills
             * @desc Get default skills
             * @memberOf Services.userService
             * @returns {Object} Promise object represents list skills
             * @instance
             */
            this.getSkills = function () {
                var url = config.URL.USER.SKILLS;
                return httpServiceJava.get(url);
            };
            /**
             * @method getUserSkills
             * @desc Get user's skills
             * @memberOf Services.userService
             * @param {Object}  req - Request Object
             * @param {string} req.endorsedUserId - User Id
             * @returns {Object} Promise object represents list of user's skills
             * @instance
             */
            this.getUserSkills = function (req) {
                var url = config.URL.USER.USER_SKILLS;
                return httpServiceJava.post(url, req);
            };
             /**
             * @method addSkills
             * @desc Add skill to user's skills and add skill to default skills list
             * @memberOf Services.userService
             *  @param {string} req.endorsedUserId - User Id
             * @param {Object[]} req.skillName - List of skill names
             * @returns {Object} Promise object represents response and response code
             * @instance
             */
            this.addSkills = function (req) {
                var url = config.URL.USER.ADD_SKILLS;
                return httpServiceJava.post(url, req);
            };
        }]);
