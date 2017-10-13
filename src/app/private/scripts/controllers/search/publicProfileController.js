/**
  * @namespace Controllers
 */

'use strict';

angular.module('playerApp') // add those all values
  .controller('PublicProfileController', ['$scope',
      '$rootScope',
      '$stateParams',
      'searchService',
      'toasterService',
      '$timeout',
      '$state',
      function ($scope, $rootScope, $stateParams, searchService, toasterService, $timeout, $state) {
    /**
     * @class PublicProfileController
     * @desc to display users public profile
     * @memberOf Controllers
     */
          var publicProfile = this;
          var userIdentifier = window.atob($stateParams.userId);
           /**
         * @method profile
         * @desc Get user profile
         * @memberOf Controllers.PublicProfileController
         * @inner
         */
          publicProfile.profile = function () {
              publicProfile.loader = toasterService
                                    .loader('', $rootScope.errorMessages.SEARCH.DATA.START);

              searchService.getPublicUserProfile(userIdentifier).then(function (res) {
                  publicProfile.loader.showLoader = false;
                  if (res.responseCode === 'OK') {
                      publicProfile.user = res.result.response;
                      publicProfile.user.dob = publicProfile.user.dob
                                                ? new Date(publicProfile.user.dob)
                                                : publicProfile.user.dob;
                  } else {
                      toasterService.error($rootScope.errorMessages.SEARCH.USER.PROFILE_FAILED);
                  }
              }).catch(function () {
                  publicProfile.loader.showLoader = false;
                  toasterService.error($rootScope.errorMessages.SEARCH.USER.PROFILE_FAILED);
              });
          };
          publicProfile.close = function () {
              if ($rootScope.search.searchKeyword !== '') {
                  $timeout(function () {
                      $rootScope.$broadcast('initSearch', {});
                  }, 500);
              } else {
                  $state.go('Profile');
              }
          };
          publicProfile.profile();
      }]);
