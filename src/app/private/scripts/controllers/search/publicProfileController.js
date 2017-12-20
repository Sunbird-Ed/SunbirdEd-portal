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
      var currentUserId = $rootScope.userId
      /**
         * @method profile
         * @desc Get user profile
         * @memberOf Controllers.PublicProfileController
         * @inner
         */
      publicProfile.profile = function (endorsement) {
        publicProfile.loader = toasterService
          .loader('', $rootScope.messages.stmsg.m0005)

        searchService.getPublicUserProfile(userIdentifier, endorsement).then(function (res) {
          publicProfile.loader.showLoader = false
          if (res.responseCode === 'OK') {
            publicProfile.user = res.result.response
            publicProfile.user.dob = publicProfile.user.dob
              ? new Date(publicProfile.user.dob)
              : publicProfile.user.dob
            var userSkills = publicProfile.user.skills !== undefined ? publicProfile.user.skills : []
            if (userSkills.length) {
              userSkills.forEach(function (skill) {
                skill.endorsersUserId = []
                if (skill.endorsersList) {
                  var userIds = _.map(skill.endorsersList, 'userId')
                  userIds.forEach(function (userId) {
                    skill.endorsersUserId.push(userId)
                  })
                }
              })
              userSkills.forEach(function (skill) {
                skill.isEndorsable = !skill.endorsersUserId
                  .includes(currentUserId)
              })
            }

            publicProfile.userSkills = userSkills
          } else {
            toasterService.error($rootScope.messages.fmsg.m0005)
          }
        }).catch(function () {
          publicProfile.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0005)
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
        userService.addSkills({
          request: { skillName: [skill], endorsedUserId: userIdentifier }
        }).then(function (response) {
          if (response && response.responseCode === 'OK') {
            publicProfile.profile('endorsement')
          } else {
            toasterService.error($rootScope.messages.fmsg.m0063)
          }
        })
      }
      publicProfile.profile()
    }])
