'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ProfileController', function($scope, $rootScope, contentService, userService, config, $timeout, $filter) {
        var profile = this;
        profile.userId = $rootScope.userId;
        profile.experienceForm = false;
        profile.currentJobLocation = null;
        profile.isCurrentJobExist = false;
        profile.profileSummary = '';
        profile.languages = config.DROPDOWN.COMMON.languages;
        profile.subjects = config.DROPDOWN.COMMON.subjects;
        var errorMessageType=$rootScope.errorMessages.COMMON;
        var addressValidationError=$rootScope.errorMessages.PROFILE.FORM_VALIDATION.ADDRESS;
        var basicProfileValidationError=$rootScope.errorMessages.PROFILE.FORM_VALIDATION.BASIC_PROFILE;
        var apiMessages=$rootScope.errorMessages.PROFILE.API;
        //forms validation
        profile.formValidation = function() {
            $('.addressEditForm').form({
                fields: {
                    radio: {
                        rules: [{
                            type: 'checked',
                            prompt: addressValidationError.address_type
                        }]
                    },
                    addLine1: {
                        rules: [{
                            type: 'empty',
                            prompt: addressValidationError.addLine1
                        }]
                    },
                    city: {
                        rules: [{
                            type: 'empty',
                            prompt: addressValidationError.city
                        }]
                    },
                    pinCode: {
                        rules: [{
                            type: 'regExp[^[0-9]*$]',
                            prompt: addressValidationError.pin_code
                        }]
                    }

                },
                onSuccess: function() {
                    return true;
                },
                onFailure: function() {
                    return false;
                }
            });
        };
        profile.BasicInfoFormValidation = function() {
            $('.basicInfoForm').form({
                fields: {
                    firstName: {
                        rules: [{
                            type: 'regExp[^[a-zA-Z -]+$]',
                            prompt: basicProfileValidationError.firstName
                        }]
                    },
                    phone: {
                        rules: [{
                            type: 'regExp[^(?:(?:\\+|0{0,2})91(\\s*[\\-]\\s*)?|[0]?)?[789]\\d{9}$]',
                            prompt: basicProfileValidationError.phone
                        }]
                    },
                    email: {
                        rules: [{
                            type: 'email',
                            prompt: basicProfileValidationError.email
                        }]
                    },
                    language: {
                        rules: [{
                            type: 'empty',
                             prompt: basicProfileValidationError.language
                        }]
                    }
                },
                onSuccess: function() {
                    return true;
                },
                onFailure: function() {
                    return false;
                }
            });
        };

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
                    profile.user.avatar = e.target.result;
                    $scope.$apply();
                    profile.uploadOrUpdateAppIcon();
                };
                reader.readAsDataURL(files[0]);
                profile.icon = fd;
                profile.iconUpdate = true;
            }
        };

        profile.uploadOrUpdateAppIcon = function() {
            contentService.uploadMedia(profile.icon).then(function(res) {
                if (res && res.responseCode === 'OK') {
                    profile.basicProfile.avatar = res.result.url;
                    console.log('user pic', profile.basicProfile.avatar);
                    profile.EditAvatar();
                } else {
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, apiMessages.ERROR.update, errorMessageType.ERROR);
                }
            }).catch(function(error) {
                profile.loader.showLoader = false;
                profile.error = showErrorMessage(true, apiMessages.ERROR.update, errorMessageType.ERROR);
            });
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

                profile.fullName = profileData['firstName'] +" "+ profileData['lastName'];
                profile.email = profileData["email"]
                profile.user = profileData;


                profile.basicProfile = profile.user;
                profile.address = profileData.address;
                if (profileData.jobProfile.length) {
                    profileData.jobProfile.forEach(function(element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                    profile.currentJobLocation = profileData.jobProfile.find(function(userJob) {
                        return (userJob.isCurrentJob === true);
                    });
                }

                if (profileData.address.length) {
                    profileData.address.forEach(function(element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                    profile.currentAddressLocation = profileData.address.find(function(userAddress) {
                        return (userAddress.addType === 'current');
                    });
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
                profile.loader.showLoader = false;
                profile.error = showErrorMessage(true, apiMessages.ERROR.get, errorMessageType.ERROR);
            }
        };
        // Get user profile
        profile.getProfile = function() {
            profile.loader = showLoaderWithMessage('', apiMessages.SUCCESS.loadingProfile);
                userService.getUserProfile(profile.userId)
                .then(function(successResponse) {
                    profile.userProfile(successResponse);
                }).catch(function(error) {
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, apiMessages.ERROR.get, errorMessageType.ERROR);
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
        
            profile.loader = showLoaderWithMessage('', apiMessages.SUCCESS.editingProfile);
              
            userService.updateUserProfile(profile.updateProfileRequest, profile.fullName, profile.email)
                .then(function(successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        profile.experienceForm = false;
                        profile.basicProfileForm = false;
                        profile.addressForm = false;
                        profile.educationForm = false;
                        profile.loader.showLoader = false;
                        profile.error = showErrorMessage(true, apiMessages.SUCCESS.profileEdited, errorMessageType.SUCCESS);
                        profile.getProfile();
                        $timeout(function() {
                            profile.error.showError = false;
                        }, 2000);
                    } else {
                        profile.loader.showLoader = false;
                        profile.error = showErrorMessage(true, apiMessages.ERROR.update, errorMessageType.ERROR);
                       
                    }
                }).catch(function(error) {
                    profile.experienceForm = false;
                    profile.basicProfileForm = false;
                    profile.loader.showLoader = false;
                    profile.error = showErrorMessage(true, apiMessages.ERROR.update, errorMessageType.ERROR);
                    
                });
        };
        //profile newAddress
        // update basic info
        profile.EditAvatar = function() {
            delete profile.basicProfile.education;
            delete profile.basicProfile.jobProfile;
            delete profile.basicProfile.address;
            delete profile.basicProfile.userName;
            delete profile.basicProfile.status;
            delete profile.basicProfile.identifier;
            profile.updateProfile(profile.basicProfile);
        };
        profile.EditBasicProfile = function() {
            profile.BasicInfoFormValidation();
            var isValid = $('.basicInfoForm').form('validate form');
            console.log('isvalif in basic', isValid);
            if (isValid === true) {
                delete profile.basicProfile.education;
                delete profile.basicProfile.jobProfile;
                delete profile.basicProfile.address;
                delete profile.basicProfile.userName;
                delete profile.basicProfile.status;
                delete profile.basicProfile.identifier;
                var dob = $('#editDob').calendar('get date');
                profile.basicProfile.profileSummary = profile.profileSummary;
                profile.basicProfile.dob = dob instanceof Date ? $filter('date')(dob, 'yyyy-MM-dd') : null;
                console.log(' profile.basicProfile.dob ', profile.basicProfile.dob);
                profile.updateProfile(profile.basicProfile);
            } else {
                return false;
            }
        };
        // edit address
        profile.addAddress = function(newAddress) {
            profile.formValidation();
            var isValid = $('.addressEditForm').form('validate form');
            console.log('isValidForm', isValid);
            if (isValid === true) {
                profile.address.push(newAddress);
                profile.editAddress(profile.address);
            } else {
                return false;
            }
        };
        profile.editAddress = function(address) {
            profile.formValidation();
            var isValid = $('.addressEditForm').form('validate form');

            if (isValid === true || !isValid.includes(false)) {
                var req = { address: address };
                req.userId = $rootScope.userId;
                profile.updateProfile(req);
            } else {
                return false;
            }
        };
        // edit education
        profile.addEducation = function(newEducation) {
            newEducation.percentage = newEducation.percentage ? parseFloat(newEducation.percentage) : 0;
            newEducation.yearOfPassing = newEducation.yearOfPassing ? parseInt(newEducation.yearOfPassing) : 0;
            profile.education.push(newEducation);
            profile.editEducation(profile.education);
        };
        profile.editEducation = function(education) {
            var req = { education: education };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        // edit experience
        profile.addExperience = function(newExperience) {
            var startDate = $('#rangestartAdd').calendar('get date');
            var endDate = $('#rangestartAdd').calendar('get date');
            newExperience.isCurrentJob = newExperience.isCurrentJob ? newExperience.isCurrentJob === 'true' : null;
            newExperience.endDate = startDate instanceof Date ? $filter('date')(endDate, 'yyyy-MM-dd') : null;
            newExperience.joiningDate = endDate instanceof Date ? $filter('date')(startDate, 'yyyy-MM-dd') : null;
            newExperience.userId = $rootScope.userId;
            profile.experience.push(newExperience);
            var req = { jobProfile: profile.experience };
            req.userId = $rootScope.userId;
            req.email = profile.user.email;
            profile.updateProfile(req);
        };
        profile.editExperience = function(experiences) {
            if (experiences.length) {
                experiences.forEach(function(element) {
                    var startDate = $('.rangeStart').calendar('get date');
                    var endDate = $('.rangeEnd').calendar('get date');
                    console.log('startDate', startDate instanceof Array);
                    element.joiningDate = startDate ? $filter('date')(startDate, 'yyyy-MM-dd') : element.joiningDate;
                    element.endDate = endDate ? $filter('date')(endDate, 'yyyy-MM-dd') : element.startDate;
                }, this);
            }
            var req = { jobProfile: experiences };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };

        profile.setEditStart = function(date) {
            $('.rangeStart').calendar('set date', date);
        };
        profile.setEditEnd = function(date) {
            $('.rangeEnd').calendar('set date', date);
        };
        profile.setDob = function() {
            $('#editDob').calendar('set date', profile.user.dob);
        };

        $timeout(function() {
            $('.ui.radio.checkbox')
                .checkbox('attach events', '.toggle.button').checkbox({
                    onChange: function() {}
                });
        }, 1000);
        profile.setDropdownValue = function() {
            $timeout(function() {
                $('#languageSelect').dropdown();
                $('#languageSelect').dropdown('refresh');
                $('#languageSelect').dropdown('set selected', profile.basicProfile.language);
            }, 100);
        };
        profile.setSubject = function() {
            $timeout(function() {
                $('#setSubjects').dropdown();
                $('#setSubjects').dropdown('refresh');
                $('#setSubjects').dropdown('set selected', profile.basicProfile.subjects);
            }, 100);
        };
        profile.setEditSubject = function(subjects) {
            $timeout(function() {
                $('.editSubjects').dropdown();
                $('.editSubjects').dropdown('refresh');
                $('.editSubjects').dropdown('set selected', subjects);
            }, 100);
        };
        profile.deleteAddress = function(address) {
            var req = { address: address };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        profile.deleteExperience = function(experiences) {
            var req = { jobProfile: experiences };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        profile.deleteEducation = function(education) {
            var req = { education: education };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        profile.checkCurrentJob = function(experience) {
            if (profile.currentJobLocation) {
                profile.isCurrentJobExist = profile.currentJobLocation.id !== experience.id && profile.currentJobLocation.isCurrentJob === true && experience.isCurrentJob === 'true' ? true : false;

                console.log('profile.isCurrentJobExist', profile.isCurrentJobExist, profile.currentJobLocation.isCurrentJob, experience.isCurrentJob);
            }
        };
        profile.setJobProfileCheckbox = function(experience, value) {
            console.log('value', value);
            experience.isCurrentJob = value;
        };
    });