'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description lifecycle of profile update, add
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')// add those all values
    .controller('ProfileController',
    ['$scope', '$rootScope', 'contentService', 'userService', 'toasterService', 'config',
        '$timeout', '$filter', 'uuid4', 'formValidation', 'searchService', '$state',
        function ($scope, $rootScope, contentService, userService, toasterService, config,
            $timeout, $filter, uuid4, formValidation, searchService, $state) {
            var profile = this;
            var apiMessages = $rootScope.errorMessages.PROFILE.API;
            profile.userId = $rootScope.userId;
            profile.experienceForm = false;
            profile.currentJobLocation = null;
            profile.isCurrentJobExist = false;
            profile.profileSummary = '';
            profile.languages = config.DROPDOWN.COMMON.languages;
            profile.subjects = config.DROPDOWN.COMMON.subjects;
            profile.isError = false;
            profile.contentSortBy = 'desc';
            profile.quantityOfContent = 4;

             // Get user profile
            profile.processProfileData = function (userProfile) { // setProfileData
                profile.loader.showLoader = false;
                if (userProfile && userProfile.responseCode === 'OK') {
                    var profileData = angular.copy(userProfile.result.response);
                    profile.fullName = profileData.firstName + ' ' + profileData.lastName;
                    profile.email = profileData.email;
                    profile.user = profileData;

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
                                                             return (
                                                                 userAddress.addType === 'current');
                                                         });
                    }
                    if (profileData.education.length) {
                        profileData.education.forEach(function (element) {
                            if (element.updatedDate) {
                                element.updatedDate = new Date(element.updatedDate);
                            }
                        }, this);
                    }
                    profile.address = angular.copy(profileData.address);
                    profile.basicProfile = angular.copy(profile.user);
                    profile.education = angular.copy(profileData.education);
                    profile.experience = angular.copy(profileData.jobProfile);
                } else {
                    profile.loader.showLoader = false;
                    profile.isError = true;
                    toasterService.error(apiMessages.ERROR.get);
                }
            };

            profile.getProfile = function () {
                profile.loader = toasterService.loader('', apiMessages.SUCCESS.loadingProfile);
                userService.getUserProfile(profile.userId).then(function (successResponse) {
                    profile.processProfileData(successResponse);
                }).catch(function () {
                    profile.loader.showLoader = false;
                    profile.isError = true;
                    toasterService.error(apiMessages.ERROR.get);
                });
            };

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
                profile.loader = toasterService.loader('', apiMessages.SUCCESS.editingProfile);
                userService.updateUserProfile(
                profile.updateProfileRequest,
                profile.fullName,
                profile.email).then(function (successResponse) {
                    profile.disableSave = false;
                    if (successResponse
                        && successResponse.responseCode === 'OK') {
                        profile.experienceForm = false;
                        profile.basicProfileForm = false;
                        profile.addressForm = false;
                        profile.educationForm = false;
                        profile.loader.showLoader = false;
                        toasterService.success(apiMessages.SUCCESS.profileEdited);
                        profile.getProfile();
                    } else {
                        profile.loader.showLoader = false;
                        toasterService.error(apiMessages.ERROR.update);
                    }
                }).catch(function () {
                    profile.experienceForm = false;
                    profile.basicProfileForm = false;
                    profile.loader.showLoader = false;
                    toasterService.error(apiMessages.ERROR.update);
                });
            };

            // update avatar
            profile.openImageBrowser = function () {
                $('#iconImageInput').click();
            };

            profile.validateAvatar = function (files) {
                var fd = new FormData();
                var reader = new FileReader();
                if (files[0] && files[0].name.match(/.(jpg|jpeg|png)$/i)
                    && files[0].size < 4000000) {
                    fd.append('file', files[0]);
                    reader.onload = function () {
                        profile.uploadAvatar();
                    };
                    reader.readAsDataURL(files[0]);
                    profile.icon = fd;
                    profile.iconUpdate = true;
                } else {
                    toasterService.warning($rootScope.errorMessages.COMMON.INVALID_IMAGE);
                }
            };

            profile.uploadAvatar = function () {
                profile.loader = toasterService.loader('', apiMessages.SUCCESS.editingProfile);
                contentService.uploadMedia(profile.icon).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        profile.updateProfile({ avatar: res.result.url });
                    } else {
                        profile.loader.showLoader = false;
                        profile.error = toasterService
                    .error(apiMessages.ERROR.update);
                    }
                }).catch(function () {
                    profile.loader.showLoader = false;
                    profile.error = toasterService.error(apiMessages.ERROR.update);
                });
            };

            // update basic Info
            profile.EditBasicProfile = function () {
                var isValid = formValidation.validate('#basicInfoForm');
                if (isValid === true) {
                    var dob = $('#editDob').calendar('get date');
                    var updateReq = {
                        firstName: profile.basicProfile.firstName,
                        lastName: profile.basicProfile.lastName,
                        phone: profile.basicProfile.phone,
                        email: profile.basicProfile.email,
                        gender: profile.basicProfile.gender,
                        dob: dob instanceof Date ? $filter('date')(dob, 'yyyy-MM-dd') : null,
                        aadhaarNo: profile.basicProfile.aadhaarNo,
                        language: [profile.basicProfile.language],
                        profileSummary: profile.profileSummary,
                        subjects: profile.basicProfile.subjects
                    };
                    profile.updateProfile(updateReq);
                } else return false;
            };

        // edit address
            profile.addAddress = function (newAddress) {
                var isValid = formValidation.validate('#addressForm');
                if (isValid === true) {
                    profile.address.push(newAddress);
                    var req = { address: profile.address };
                    profile.updateProfile(req);
                } else return false;
            };

            profile.editAddress = function (address) {
                var isValid = formValidation.validate('.addressForm');
                if (isValid === true || !isValid.includes(false)) {
                    var req = { address: address };
                    profile.updateProfile(req);
                } else {
                    return false;
                }
            };

            profile.deleteAddress = function (address) {
                var req = { address: address };
                req.userId = $rootScope.userId;
                profile.updateProfile(req);
            };

        // edit education
            profile.addEducation = function (newEducation) {
                var isValid = formValidation.validate('.educationForm');
                if (isValid === true) {
                    newEducation.percentage = newEducation.percentage
                                            ? parseFloat(newEducation.percentage)
                                            : 0;
                    newEducation.yearOfPassing = newEducation.yearOfPassing
                                               ? parseInt(newEducation.yearOfPassing)
                                               : 0;
                    profile.education.push(newEducation);
                    var req = { education: profile.education };
                    profile.updateProfile(req);
                } else return false;
            };

            profile.editEducation = function (education) {
                var isValid = formValidation.validate('.educationForm');

                if (isValid === true || !isValid.includes(false)) {
                    var req = { education: education };
                    profile.updateProfile(req);
                } else return false;
            };

            profile.deleteEducation = function (education) {
                var req = { education: education };
                req.userId = $rootScope.userId;
                profile.updateProfile(req);
            };

        // edit experience
            profile.addExperience = function (newExperience) {
                // class because multiple form validation required for same form
                var isValid = formValidation.validate('.jobProfileForm');
                if (isValid === true) {
                    var startDate = $('#rangestartAdd').calendar('get date');
                    var endDate = $('#rangeendAdd').calendar('get date');
                    newExperience.isCurrentJob = newExperience.isCurrentJob
                                               ? newExperience.isCurrentJob === 'true'
                                               : null;
                    endDate = newExperience.isCurrentJob ? null : endDate;
                    newExperience.joiningDate = startDate instanceof Date
                                              ? $filter('date')(startDate, 'yyyy-MM-dd')
                                              : null;

                    newExperience.endDate = endDate instanceof Date
                                          ? $filter('date')(endDate, 'yyyy-MM-dd')
                                          : null;
                    newExperience.userId = $rootScope.userId;
                    profile.experience.push(newExperience);
                    var req = { jobProfile: profile.experience };
                    req.email = profile.user.email;
                    profile.updateProfile(req);
                } else return false;
            };

            profile.editExperience = function (experiences) {
                var isValid = formValidation.validate('.jobProfileForm');
                if (isValid === true || !isValid.includes(false)) {
                    if (experiences.length) {
                        experiences.forEach(function (element, index) {
                            var startDate = $('.rangeStart').calendar('get date');
                            var endDate = $('.rangeEnd').calendar('get date');
                            if (startDate instanceof Array && endDate instanceof Array) {
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
                } else return false;
            };

            profile.deleteExperience = function (experiences) {
                var req = { jobProfile: experiences };
                req.userId = $rootScope.userId;
                profile.updateProfile(req);
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
                    $('#languageSelect').dropdown('set selected', profile.basicProfile.language[0]);
                }, 100);
            };

            profile.setSubject = function () {
                $timeout(function () {
                    $('#setSubjects').dropdown();
                    $('#setSubjects').dropdown('refresh');
                    $('#setSubjects').dropdown('set selected', profile.basicProfile.subjects);
                }, 100);
            };

            profile.setEditSubject = function (subjects) {
                $timeout(function () {
                    $('.editSubjects').dropdown();
                    $('.editSubjects').dropdown('refresh');
                    $('.editSubjects').dropdown('set selected', subjects);
                }, 100);
            };

            profile.checkCurrentJob = function (experience) {
                if (profile.currentJobLocation) {
                    profile.isCurrentJobExist = !(profile.currentJobLocation.id !== experience.id
                                                && profile.currentJobLocation.isCurrentJob === true
                                                && experience.isCurrentJob === 'true');
                }
            };

            profile.setJobProfileCheckbox = function (experience, value) {
                experience.isCurrentJob = value;
            };

            profile.getProfile();

            profile.getCreatedContentList = function () {
                var request = {
                    filters: {
                        createdBy: profile.userId,
                        status: ['Live'],
                        contentType: config.contributeContentType
                    },
                    sort_by: {
                        lastUpdatedOn: profile.contentSortBy
                    }
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        profile.contentList = res.result.content || [];
                    } else {
                        // toasterService.error(profile.message.DRAFT.FAILED);
                    }
                }).catch(function () {
                    // toasterService.error(profile.message.DRAFT.FAILED);
                });
            };

            profile.getContentLogo = function (content) {
                var contentIcon = content.appIcon;
                var mimeType = content.mimeType;
                if (contentIcon) {
                    return content.appIcon;
                }
                switch (mimeType) {
                case 'application/pdf':
                    return '/images/pdf.png';
                case 'video/mp4':
                    return '/images/mp4.png';
                case 'video/youtube':
                    return '/images/youtubeFileIcon.jpg';
                default:
                    return '/images/zipFileIcon.png';
                }
            };

            profile.openContentPlayer = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('PreviewCollection', {
                        Id: item.identifier,
                        name: item.name,
                        backState: $state.current.name
                    });
                } else {
                    var params = {
                        contentId: item.identifier,
                        backState: $state.current.name
                    };
                    $state.go('PreviewContent', params);
                }
            };
            profile.openBulkUploadModal = function () {
                $('#bulkUpload').modal('show');
            };
        }]);
