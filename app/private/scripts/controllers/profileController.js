'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ProfileController', function($scope, $rootScope, userService, config, $timeout, $filter) {
        var profile = this;
        profile.userId = $rootScope.userId;
        // profile.summary = 'Dedicated, ambitious and goal-driven educator with 3 year progressive experience in high school settings. Documented success in providing activities and materials that engage and develop the students intellectually. Thorough understanding of implementing the use of information technology in lesson preparation.';
        profile.experienceForm = false;
        // profile.userId = '44f76ae4-1850-48d2-97e1-2408c5a6d9fc';
        // profile.userId = '5ac2edd3-8d2e-49a4-ac86-9ed5c2e10f3e';
        // update profile image
        profile.languages = config.FILTER.RESOURCES.languages;
        profile.openImageBrowser = function() {
            console.log('trying to change');
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
                    profile.user.avatar = e.target.result;
                    $scope.$apply();
                    profile.EditBasicProfile();
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
                var profileData = userProfile.result.response;

                profile.user = profileData;

                profile.basicProfile = profile.user;
                profile.address = profileData.address;
                if (profileData.jobProfile.length) {
                    profileData.jobProfile.forEach(function(element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                }
                if (profileData.address.length) {
                    profileData.address.forEach(function(element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                }
                if (profileData.education.length) {
                    profileData.education.forEach(function(element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                }
                profile.education = profileData.education;
                profile.experience = profileData.jobProfile;
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
        profile.updateProfile = function(updateReq) {
            profile.updateProfileRequest = {
                'id': 'unique API ID',
                'ts': '2013/10/15 16:16:39',
                'params': {

                },
                'request': updateReq
            };
            profile.loader = showLoaderWithMessage('', config.MESSAGES.PROFILE.HEADER.START);

            userService.updateUserProfile(profile.updateProfileRequest)
                .then(function(successResponse) {
                    console.log('userProfile.responseCode', successResponse.responseCode);
                    if (successResponse && successResponse.responseCode === 'OK') {
                        profile.getProfile();
                        profile.experienceForm = false;
                        profile.basicProfileForm = false;
                        profile.addressForm = false;
                        profile.educationForm = false;
                        console.log('successResponse on udate', successResponse);
                    } else { console.log('failsed'); throw new Error(''); }
                }).catch(function() {
                    profile.experienceForm = false;
                    profile.basicProfileForm = false;
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, config.MESSAGES.PROFILE.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
                });
        };
        //profile newAddress
        // update basic info
        profile.EditBasicProfile = function() {
            delete profile.basicProfile.education;
            delete profile.basicProfile.jobProfile;
            delete profile.basicProfile.address;
            delete profile.basicProfile.userName;
            delete profile.basicProfile.status;
            delete profile.basicProfile.identifier;
            var dob = $('#editDob').calendar('get date');
            profile.basicProfile.dob = $filter('date')(dob, 'yyyy-MM-dd');
            profile.updateProfile(profile.basicProfile);
        };
        // edit address
        profile.addAddress = function(newAddress) {
            profile.address.push(newAddress);
            profile.editAddress(profile.address);
        };
        profile.editAddress = function(address) {
            var req = { address: address };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        // edit education
        profile.addEducation = function(newEducation) {
            newEducation.percentage = newEducation.percentage ? parseFloat(newEducation.percentage) : null;
            newEducation.yearOfPassing = newEducation.yearOfPassing ? parseInt(newEducation.yearOfPassing) : null;

            profile.education.push(newEducation);
            console.log('newEducation', newEducation);
            profile.editEducation(profile.education);
        };
        profile.editEducation = function(education) {
            console.log('education', education);
            var req = { education: education };
            req.userId = $rootScope.userId;
            console.log('req', req);
            profile.updateProfile(req);
        };
        // edit experience
        profile.addExperience = function(newExperience) {
            var startDate = $('#rangestartAdd').calendar('get date');
            var endDate = $('#rangestartAdd').calendar('get date');
            console.log('startDate', $filter('date')(endDate, 'yyyy-MM-dd'));
            newExperience.endDate = $filter('date')(endDate, 'yyyy-MM-dd');
            newExperience.joiningDate = $filter('date')(startDate, 'yyyy-MM-dd');
            profile.experience.push(newExperience);
            console.log('newExperience', profile.experience);
            var req = { jobProfile: profile.experience };
            req.userId = $rootScope.userId;
            req.email = profile.user.email;

            console.log('req experience', req);
            profile.updateProfile(req);
        };
        profile.editExperience = function(experiences) {
            experiences.forEach(function(element) {
                var startDate = $('#rangeStart').calendar('get date');
                var endDate = $('#rangeEnd').calendar('get date');
                element.startDate = startDate ? $filter('date')(startDate, 'yyyy-MM-dd') : element.startDate;
                element.endDate = endDate ? $filter('date')(endDate, 'yyyy-MM-dd') : element.startDate;
            }, this);
            var req = { jobProfile: experiences };
            req.userId = $rootScope.userId;
            console.log('req experience', req);
            profile.updateProfile(req);
        };

        profile.setEditStart = function(date) {
            $('#rangeStart').calendar('set startDate', date);
            console.log('trying to ser strtt');
        };
        profile.setEditEnd = function(date) {
            $('#rangeEnd').calendar('set endDate', date);
            console.log('trying to ser end');
        };
        profile.setDob = function() {
            $('#editDob').calendar('set date', profile.user.dob);
        };
        profile.getEditStart = function() {
            return ($('#rangeStart').calendar('get date'));
        };

        $timeout(function() {
            $('.ui.radio.checkbox')
                .checkbox('attach events', '.toggle.button').checkbox({
                    onChange: function() {
                        console.log('Value changed');
                    }
                });
        }, 1000);
        profile.setDropdownValue = function() {
            $timeout(function() {
                $('#languageSelect').dropdown();
                $('#languageSelect').dropdown('refresh');
                $('#languageSelect').dropdown('set selected', profile.basicProfile.language);
            }, 100);
        };
    });