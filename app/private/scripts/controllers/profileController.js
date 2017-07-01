'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:profileController
 * @description
 * # profileController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ProfileController', function($rootScope, profileService) {
        var profile = this;
        profile.userId = $rootScope.userId;

        profile.userProfile = function(userProfile) {
            if (userProfile && userProfile.responseCode === 'OK') {
                var profileData = userProfile.result.profile;
                profile.profilePic = profileData.avatar;
                profile.firstName = profileData.firstName;
                profile.lastName = profileData.lastName;
                profile.summary = profileData.summary;
                profile.preferredLanguage = profileData.language;
                profile.organizationName = profileData.organisations[0].name;
                profile.city = profileData.address[0].city;
            }
        };
        profile.getProfile = function() {
            profileService.getUserProfile(profile.userId)
                .then(function(successResponse) {
                    profile.userProfile(successResponse);
                }).catch(function() {

                });
        };
        profile.getProfile();
    });