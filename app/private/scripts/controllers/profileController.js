'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ProfileController', function($scope, $rootScope, userService, config, $timeout) {
        var profile = this;
        profile.userId = $rootScope.userId;
        // profile.summary = 'Dedicated, ambitious and goal-driven educator with 3 year progressive experience in high school settings. Documented success in providing activities and materials that engage and develop the students intellectually. Thorough understanding of implementing the use of information technology in lesson preparation.';
        profile.experienceForm = false;
        // profile.userId = '44f76ae4-1850-48d2-97e1-2408c5a6d9fc';
        // profile.userId = '5ac2edd3-8d2e-49a4-ac86-9ed5c2e10f3e';
        // update profile image
        profile.openImageBrowser = function() {
            console.log('trying to change');
            $('#iconImageInput').click();
        };
        profile.open = function() {
            $timeout(function() {
                console.log('trying to open');
                $('#example2').calendar({
                    type: 'date',
                    formatter: {
                        date: function(date, settings) {
                            if (!date) return '';
                            var day = date.getDate();
                            var month = date.getMonth() + 1;
                            var year = date.getFullYear();
                            var selectedDate = day + '/' + month + '/' + year;
                            profile.user.dob = selectedDate;
                            return selectedDate;
                        }
                    }
                });
            }, 1500);
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
                    profile.user.avatar = e.target.result;
                    $scope.$apply();
                    profile.updateProfile();
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

        profile.userProfile = function(userProfile) {
            profile.loader.showLoader = false;
            if (userProfile && userProfile.responseCode === 'OK') {
                console.log('sdfghjkljgfcvjkhgfhjkgfhjkl', 'data', JSON.stringify(userProfile.result.response, null, 2));
                var profileData = userProfile.result.response;

                profile.user = profileData;
                // profile.user.organizationName = profileData.jobProfile[0].orgName;
                // profile.user.city = profileData.address[0].city;
            } else {
                console.log('jfhdsf gere');
                throw new Error('');
            }
        };
        // Get user profile
        profile.getProfile = function() {
            profile.loader = showLoaderWithMessage('', config.MESSAGES.PROFILE.HEADER.START);
            userService.getUserProfile(profile.userId)
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
            delete profile.user.userName;
            delete profile.user.status;
            delete profile.user.identifier;
            console.error('user request on update', profile.user);
            // delete profile.user.email;
            // profile.user.id = profile.user.userId;
            profile.updateProfileRequest = {
                'id': 'unique API ID',
                'ts': '2013/10/15 16:16:39',
                'params': {

                },
                'request': profile.user
            };
            profile.loader = showLoaderWithMessage('', config.MESSAGES.PROFILE.HEADER.START);
            // console.log('profile.user.jobprofile121342533647', profile.user.dob);
            userService.updateUserProfile(profile.updateProfileRequest)
                .then(function(successResponse) {
                    if (userProfile && userProfile.responseCode === 'OK') {
                        profile.experienceForm = false;
                        profile.basicProfileForm = false;
                        profile.addressForm = false;
                        profile.educationForm = false;
                        console.log('successResponse on udate', successResponse);
                        profile.getProfile();
                    } else throw new error;
                }).catch(function() {
                    profile.experienceForm = false;
                    profile.basicProfileForm = false;
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, config.MESSAGES.PROFILE.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
                });
        };
        //profile newAddress

        profile.EditBasicProfile = function() {
            console.log('valuesof input', $('#endDateInput').val());

            profile.updateProfile();
        };
        profile.addAddress = function(newAddress) {
            profile.user.address.push(newAddress);
            profile.updateProfile();
        };
        profile.addEducation = function(newEducation) {
            profile.user.education.push(newEducation);
            console.log('newEducation', newEducation);
            profile.updateProfile();
        };

        profile.addExperience = function(newExperience) {
            var startDate = $('#rangestartAdd').calendar('get date');
            var endDate = $('#rangestartAdd').calendar('get date');

            newExperience.endDate = endDate;
            newExperience.startDate = startDate;
            profile.user.jobProfile.push(newExperience);
            profile.updateProfile();
            console.log('newExperience', newExperience);
        };
        profile.editExperience = function() {
            var endDate = $('#end').calendar('get date');

            profile.date = endDate;
            console.log('profile.date', profile.date);
        };

        profile.setDate = function(date) {
            $('#end').calendar('set startDate', date);
            $('#endDateInput').val(date);
            console.log('trying to set end date');
            console.log('valuesof input', $('#endDateInput').val(date));
        };
        profile.getDate = function() {
            $('#end').calendar('get date');
            console.log('trying to get end date');
        };
    });