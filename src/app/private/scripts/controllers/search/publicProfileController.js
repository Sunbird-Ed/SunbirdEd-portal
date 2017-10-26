/**
  * @namespace Controllers
 */

'use strict'

angular.module('playerApp') // add those all values
  .controller('PublicProfileController', ['$scope',
      '$rootScope',
      '$stateParams',
      'searchService',
      'toasterService',
      '$timeout',
      '$state',
      'userService',
      function (
        $scope,
        $rootScope,
        $stateParams,
        searchService,
        toasterService,
        $timeout,
        $state,
        userService) {
    /**
     * @class PublicProfileController
     * @desc to display users public profile
     * @memberOf Controllers
     */
          var publicProfile = this
          var userIdentifier = window.atob($stateParams.userId)
           /**
         * @method profile
         * @desc Get user profile
         * @memberOf Controllers.PublicProfileController
         * @inner
         */
          publicProfile.profile = function () {
              publicProfile.loader = toasterService
                                    .loader('', $rootScope.errorMessages.SEARCH.DATA.START)

              searchService.getPublicUserProfile(userIdentifier).then(function (res) {
                  publicProfile.loader.showLoader = false
                  if (res.responseCode === 'OK') {
                      publicProfile.user = res.result.response
                      publicProfile.user.dob = publicProfile.user.dob
                                                ? new Date(publicProfile.user.dob)
                                                : publicProfile.user.dob
                  } else {
                      toasterService.error($rootScope.errorMessages.SEARCH.USER.PROFILE_FAILED)
                  }
              }).catch(function () {
                  publicProfile.loader.showLoader = false
                  toasterService.error($rootScope.errorMessages.SEARCH.USER.PROFILE_FAILED)
              })
          }
          publicProfile.close = function () {
              if ($rootScope.search.searchKeyword !== '') {
                  $timeout(function () {
                      $rootScope.$broadcast('initSearch', {})
                  }, 500)
              } else {
                  $state.go('Profile')
              }
          }

          publicProfile.defaultLimit = 4
          publicProfile.limit = publicProfile.defaultLimit
          publicProfile.resetLimit = 0
          publicProfile.setLimit = function (lim) {
              publicProfile.limit = (lim <= 0) ? publicProfile.userSkills.length : lim
          }
          publicProfile.endorsement = function (skill) {
              userService.addSkills({ request: { skillName: skill } }).then(function (response) {
                  if (response && response.responseCode === 'OK') {
                      publicProfile.getUserSkills()
                  }
              })
          }
          publicProfile.getUserSkills = function () {
              userService.getUserSkills({
                  request: {
                      endorsedUserId: userIdentifier
                  }
              }).then(function (response) {
                  if (response.responseCode === 'OK') {
                      var userSkills = response.result.response[0].skills
                      if (userSkills.length) {
                          userSkills.forEach(function (skill) {
                              skill.endorsersUserId = []
                              Object.keys(skill.endorsers).forEach(function (key) {
                                  skill.endorsersUserId.push(key)
                              })
                          })
                          userSkills.forEach(function (skill) {
                              skill.isEndorsable = !skill.endorsersUserId
                                                        .includes(userIdentifier)
                          })
                      }
                      publicProfile.userSkills = userSkills
                  }
              })
          }
          publicProfile.profile()
          publicProfile.getUserSkills()
      }])
