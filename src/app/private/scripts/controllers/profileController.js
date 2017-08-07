'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ProfileController', function (
      $scope, $rootScope, contentService, userService, ToasterService,
      config, $timeout, $filter, uuid4) {
        var profile = this;
        var addressValidationError
        = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.ADDRESS;
        var educationValidationError
        = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.EDUCATION;
        var JobProfileValidationError
        = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.JOB_PROFILE;
        var basicProfileValidationError
        = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.BASIC_PROFILE;
        var apiMessages = $rootScope.errorMessages.PROFILE.API;
        profile.userId = $rootScope.userId;
        profile.experienceForm = false;
        profile.currentJobLocation = null;
        profile.isCurrentJobExist = false;
        profile.profileSummary = '';
        profile.languages = config.DROPDOWN.COMMON.languages;
        profile.subjects = config.DROPDOWN.COMMON.subjects;

        // forms validation
        profile.formValidation = function () {
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
                onSuccess: function () {
                    return true;
                },
                onFailure: function () {
                    return false;
                }
            });
            $('.educationForm').form({
                fields: {
                    degree: {
                        rules: [{
                            type: 'empty',
                            prompt: educationValidationError.degree
                        }]
                    },
                    institute: {
                        rules: [{
                            type: 'empty',
                            prompt: educationValidationError.institute
                        }]
                    }

                },
                onSuccess: function () {
                    return true;
                },
                onFailure: function () {
                    return false;
                }
            });
            $('.EditJobProfileForm').form({
                fields: {
                    jobName: {
                        rules: [{
                            type: 'empty',
                            prompt: JobProfileValidationError.jobName
                        }]
                    },
                    org: {
                        rules: [{
                            type: 'empty',
                            prompt: JobProfileValidationError.org
                        }]
                    }

                },
                onSuccess: function () {
                    return true;
                },
                onFailure: function () {
                    return false;
                }
            });
        };
        profile.BasicInfoFormValidation = function () {
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
                            type: 'regExp[^(?:(?:\\+|0{0,2})91(\\s*[\\-]\\s*)?|[0]?)?[789]\\d{9}$]', // eslint-disable-line max-len
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
                    },
                    aadhar: {
                        rules: [{
                            type: 'regExp[^[0-9]*$]',
                            prompt: basicProfileValidationError.addhar
                        }]
                    }
                },
                onSuccess: function () {
                    return true;
                },
                onFailure: function () {
                    return false;
                }
            });
        };

        profile.openImageBrowser = function () {
            $('#iconImageInput').click();
        };

        profile.updateIcon = function (files) {
            var fd = new FormData();
            var reader = new FileReader();
            if (files[0] && files[0].name.match(/.(jpg|jpeg|png)$/i)
                && files[0].size < 4000000) {
                fd.append('file', files[0]);
                reader.onload = function () {
                    profile.uploadOrUpdateAppIcon();
                };
                reader.readAsDataURL(files[0]);
                profile.icon = fd;
                profile.iconUpdate = true;
            } else {
                ToasterService.warning(
                    $rootScope.errorMessages.COMMON.INVAILID_IMAGE);
            }
        };

        profile.uploadOrUpdateAppIcon = function () {
            contentService.uploadMedia(profile.icon).then(function (res) {
                if (res && res.responseCode === 'OK') {
                    profile.basicProfile.avatar = res.result.url;
                    profile.EditAvatar();
                } else {
                    profile.loader.showLoader = false;
                    profile.error = ToasterService
                    .error(apiMessages.ERROR.update);
                }
            }).catch(function () {
                profile.loader.showLoader = false;
                profile.error = ToasterService.error(apiMessages.ERROR.update);
            });
        };

        profile.userProfile = function (userProfile) {
            profile.loader.showLoader = false;
            if (userProfile && userProfile.responseCode === 'OK') {
                var profileData = angular.copy(userProfile.result.response);
                profile.user = profileData;
                profile.basicProfile = angular.copy(profile.user);
                profile.address = profileData.address;
                if (profileData.jobProfile.length) {
                    profileData.jobProfile.forEach(function (element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                    profile.currentJobLocation = profileData.jobProfile
                    .find(function (userJob) {
                        return (userJob.isCurrentJob === true);
                    });
                }

                if (profileData.address.length) {
                    profileData.address.forEach(function (element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                    profile.currentAddressLocation = profileData.address
            .find(function (userAddress) {
                return (userAddress.addType === 'current');
            });
                }
                if (profileData.education.length) {
                    profileData.education.forEach(function (element) {
                        if (element.updatedDate) {
                            element.updatedDate = new Date(element.updatedDate);
                        }
                    }, this);
                }
                profile.education = profileData.education;
                profile.experience = profileData.jobProfile;
            } else {
                profile.loader.showLoader = false;
                ToasterService.error(apiMessages.ERROR.get);
            }
        };
        // Get user profile
        profile.getProfile = function () {
            profile.loader = ToasterService
            .loader('', apiMessages.SUCCESS.loadingProfile);
            userService.getUserProfile(profile.userId)
                .then(function (successResponse) {
                    profile.userProfile(successResponse);
                }).catch(function () {
                    profile.loader.showLoader = false;
                    ToasterService.error(apiMessages.ERROR.get);
                });
        };
        profile.getProfile();
        // update user profile
        profile.updateProfile = function (updateReq) {
            updateReq.userId = $rootScope.userId;
            profile.updateProfileRequest = {
                id: uuid4.generate(),
                ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                params: {

                },
                request: updateReq
            };
            profile.disableSave = true;
            profile.loader = ToasterService
            .loader('', apiMessages.SUCCESS.editingProfile);
            userService.updateUserProfile(
                profile.updateProfileRequest,
                profile.fullName,
                profile.email
            ).then(function (successResponse) {
                profile.disableSave = false;
                if (successResponse
                        && successResponse.responseCode === 'OK') {
                    profile.experienceForm = false;
                    profile.basicProfileForm = false;
                    profile.addressForm = false;
                    profile.educationForm = false;
                    profile.loader.showLoader = false;
                    ToasterService
                        .success(apiMessages.SUCCESS.profileEdited);
                    profile.getProfile();
                } else {
                    profile.loader.showLoader = false;
                    ToasterService.error(apiMessages.ERROR.update);
                }
            }).catch(function () {
                profile.experienceForm = false;
                profile.basicProfileForm = false;
                profile.loader.showLoader = false;
                ToasterService.error(apiMessages.ERROR.update);
            });
        };
        // profile newAddress
        // update basic info
        profile.EditAvatar = function () {
            delete profile.basicProfile.education;
            delete profile.basicProfile.jobProfile;
            delete profile.basicProfile.address;
            delete profile.basicProfile.userName;
            delete profile.basicProfile.status;
            delete profile.basicProfile.identifier;
            profile.updateProfile(profile.basicProfile);
        };
        profile.EditBasicProfile = function () {
            profile.BasicInfoFormValidation();
            var isValid = $('.basicInfoForm')
            .form('validate form');

            if (isValid === true) {
                var dob = $('#editDob')
                .calendar('get date');
                delete profile.basicProfile.education;
                delete profile.basicProfile.jobProfile;
                delete profile.basicProfile.address;
                delete profile.basicProfile.userName;
                delete profile.basicProfile.status;
                delete profile.basicProfile.identifier;
                profile.basicProfile.profileSummary = profile.profileSummary;
                profile.basicProfile.dob
          = dob instanceof Date
          ? $filter('date')(dob, 'yyyy-MM-dd')
          : null;
                profile.basicProfile.language = [profile.basicProfile.language];
                profile.updateProfile(profile.basicProfile);
            } else {
                return false;
            }
        };
        // edit address
        profile.addAddress = function (newAddress) {
            profile.formValidation();
            var isValid = $('.addressEditForm').form('validate form');
            if (isValid === true) {
                profile.address.push(newAddress);
                var req = { address: profile.address };
                profile.updateProfile(req);
            } else {
                return false;
            }
        };
        profile.editAddress = function (address) {
            profile.formValidation();
            var isValid = $('.addressEditForm').form('validate form');
            if (isValid === true || !isValid.includes(false)) {
                var req = { address: address };
                profile.updateProfile(req);
            } else {
                return false;
            }
        };
        // edit education
        profile.addEducation = function (newEducation) {
            profile.formValidation();
            var isValid = $('.educationForm').form('validate form');
            if (isValid === true) {
                newEducation.percentage
           = newEducation.percentage
           ? parseFloat(newEducation.percentage)
           : 0;
                newEducation.yearOfPassing
          = newEducation.yearOfPassing
          ? parseInt(newEducation.yearOfPassing, 10)
          : 0;
                profile.education.push(newEducation);
                var req = { education: profile.education };
                profile.updateProfile(req);
            } else { return false; }
        };
        profile.editEducation = function (education) {
            profile.formValidation();
            var isValid = $('.educationForm').form('validate form');
            if (isValid === true || !isValid.includes(false)) {
                var req = { education: education };
                profile.updateProfile(req);
            } else { return false; }
        };
        // edit experience
        profile.addExperience = function (newExperience) {
            profile.formValidation();
            var isValid = $('.EditJobProfileForm').form('validate form');
            if (isValid === true) {
                var startDate = $('#rangestartAdd').calendar('get date');
                var endDate = $('#rangeendAdd').calendar('get date');

                newExperience.isCurrentJob
          = newExperience.isCurrentJob
          ? newExperience.isCurrentJob === 'true'
          : null;

                endDate = newExperience.isCurrentJob ? null : endDate;

                newExperience.joiningDate
          = startDate instanceof Date
          ? $filter('date')(startDate, 'yyyy-MM-dd')
          : null;

                newExperience.endDate
          = endDate instanceof Date
          ? $filter('date')(endDate, 'yyyy-MM-dd')
          : null;
                newExperience.userId = $rootScope.userId;
                profile.experience.push(newExperience);
                var req = { jobProfile: profile.experience };
                req.email = profile.user.email;
                profile.updateProfile(req);
            } else { return false; }
        };
        profile.editExperience = function (experiences) {
            profile.formValidation();
            var isValid = $('.EditJobProfileForm').form('validate form');
            if (isValid === true || !isValid.includes(false)) {
                if (experiences.length) {
                    experiences.forEach(function (element, index) {
                        var startDate = $('.rangeStart').calendar('get date');
                        var endDate = $('.rangeEnd').calendar('get date');
                        if (startDate instanceof Array
                            && endDate instanceof Array) {
                            element.joiningDate = startDate
                ? $filter('date')(startDate[index], 'yyyy-MM-dd')
                : element.joiningDate;

                            element.endDate = endDate
                ? $filter('date')(endDate[index], 'yyyy-MM-dd')
                : element.endDate;
                        } else {
                            element.joiningDate = startDate
                ? $filter('date')(startDate, 'yyyy-MM-dd')
                : element.joiningDate;
                            element.endDate = endDate
                ? $filter('date')(endDate, 'yyyy-MM-dd')
                : element.endDate;
                        }
                    }, this);
                }
                var req = { jobProfile: experiences };
                profile.updateProfile(req);
            } else { return false; }
        };

        profile.setEditStart = function (id, index, joinDate) {
            $timeout(function () {
                $('#' + id + index).calendar('set date', joinDate);
            }, 500);
        };
        profile.setEditEnd = function (id, index, endDate) {
            $timeout(function () {
                $('#' + id + index).calendar('set date', endDate);
            }, 500);
        };
        profile.setDob = function () {
            $('#editDob').calendar('set date', profile.user.dob);
        };

        $timeout(function () {
            $('.ui.radio.checkbox')
                .checkbox('attach events', '.toggle.button').checkbox({
                    onChange: function () {}
                });
        }, 1000);
        profile.setDropdownValue = function () {
            $timeout(function () {
                $('#languageSelect').dropdown();
                $('#languageSelect').dropdown('refresh');
                $('#languageSelect')
          .dropdown('set selected', profile.basicProfile.language);
            }, 100);
        };
        profile.setSubject = function () {
            $timeout(function () {
                $('#setSubjects').dropdown();
                $('#setSubjects').dropdown('refresh');
                $('#setSubjects')
          .dropdown('set selected', profile.basicProfile.subjects);
            }, 100);
        };
        profile.setEditSubject = function (subjects) {
            $timeout(function () {
                $('.editSubjects').dropdown();
                $('.editSubjects').dropdown('refresh');
                $('.editSubjects').dropdown('set selected', subjects);
            }, 100);
        };
        profile.deleteAddress = function (address) {
            var req = { address: address };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        profile.deleteExperience = function (experiences) {
            var req = { jobProfile: experiences };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        profile.deleteEducation = function (education) {
            var req = { education: education };
            req.userId = $rootScope.userId;
            profile.updateProfile(req);
        };
        profile.checkCurrentJob = function (experience) {
            if (profile.currentJobLocation) {
                profile.isCurrentJobExist =
          !(profile.currentJobLocation.id !== experience.id
            && profile.currentJobLocation.isCurrentJob === true
             && experience.isCurrentJob === 'true');
            }
        };
        profile.setJobProfileCheckbox = function (experience, value) {
            experience.isCurrentJob = value;
        };
    });
