'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ProfileController', function($scope, $rootScope, profileService, config, $timeout) {
        var profile = this;
        // profile.userId = $rootScope.userId;
        profile.summary = 'Dedicated, ambitious and goal-driven educator with 3 year progressive experience in high school settings. Documented success in providing activities and materials that engage and develop the students intellectually. Thorough understanding of implementing the use of information technology in lesson preparation.';

        profile.userId = '01e1db99-c67e-4bde-a1c0-38b16696780d';
        console.log('$rootScope.userId', $rootScope.userId);
        // update profile image
        profile.openImageBrowser = function() {
            $('#iconImageInput').click();
        };

        profile.updateIcon = function(files) {
            if (files) {
                var fd = new FormData();
                if (files.length) {

                }
                fd.append('file', files[0]);

                var reader = new FileReader();
                reader.onload = function(e) {
                    profile.profilePic = e.target.result;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
                profile.icon = fd;
                profile.iconUpdate = true;
            }
        };
        /**
         * This function called when api failed, and its show failed response for 2 sec.
         * @param {String} message
         */
        function showErrorMessage(isClose, message, messageType) {
            var error = {};
            error.showError = true;
            error.isClose = isClose;
            error.message = message;
            error.messageType = messageType;
            return error;
        }

        /**
         * This function helps to show loader with message.
         * @param {String} headerMessage
         * @param {String} loaderMessage
         */
        function showLoaderWithMessage(headerMessage, loaderMessage) {
            var loader = {};
            loader.showLoader = true;
            loader.headerMessage = headerMessage;
            loader.loaderMessage = loaderMessage;
            return loader;
        }
        profile.validate = function() {
            $('#profileEdit')
                .form({
                    fields: {
                        name: 'empty',
                        gender: 'empty',
                        username: 'empty',
                        password: ['minLength[6]', 'empty'],
                        skills: ['minCount[2]', 'empty'],
                        terms: 'checked'
                    }
                });
        };
        profile.userProfile = function(userProfile) {
            profile.loader.showLoader = false;
            if (userProfile && userProfile.responseCode === 'OK') {
                var profileData = userProfile.result.response[0];

                console.log('userProfile', JSON.stringify(profileData.lastName, null, 2));
                profile.profilePic = profileData.avatar;
                profile.firstName = profileData.firstName;
                profile.lastName = profileData.lastName;
                // profile.summary = profileData.summary;
                profile.preferredLanguage = profileData.language;
                // profile.organizationName = profileData.organisations[0].name;
                profile.city = profileData.address[0].city;
                profile.user = profileData;
            } else {
                console.log('jfhdsf gere');
                throw new Error('');
            }
        };
        // Get user profile
        profile.getProfile = function() {
            profile.loader = showLoaderWithMessage('', config.MESSAGES.PROFILE.HEADER.START);
            profileService.getUserProfile(profile.userId)
                .then(function(successResponse) {
                    profile.userProfile(successResponse);
                }).catch(function(error) {
                    console.log('i am here in catch', error);
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, config.MESSAGES.PROFILE.HEADER.FAILED, config.MESSAGES.COMMON.ERROR);
                });
        };
        profile.getProfile();
        // update user profile
        profile.updateProfile = function() {
            profile.updateProfileRequest = {};
            profile.loader = showLoaderWithMessage('', config.MESSAGES.PROFILE.HEADER.START);
            userService.updateUserProfile(profile.updateProfileRequest)
                .then(function(successResponse) {
                    profile.userProfile(successResponse);
                }).catch(function() {
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, config.MESSAGES.PROFILE.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
                });
        };
        //profile newAddress

        profile.EditBasicProfile = function() {
            console.log('item', JSON.stringify(profile.user, null, 2));
            profile.updateProfile();
        };
        profile.addNew = function(newAddress) {
            profile.user.address.push(newAddress);
            console.log('item', newAddress);
        };
        profile.addEducation = function(newEducation) {
            console.log('newEducation', newEducation);
        };

        profile.addExperience = function(newExperience) {
            console.log('newExperience', newExperience);
        };
    });