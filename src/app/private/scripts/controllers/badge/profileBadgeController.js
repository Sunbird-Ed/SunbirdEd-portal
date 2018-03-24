/**
 * @author: Anuj Gupta
 * @description: This controller useful to handle badge releated operation for user profile
 */

'use strict'

angular.module('playerApp')
  .controller('profileBadgeController', ['$rootScope', '$scope', 'badgeService', 'toasterService',
    function ($rootScope, $scope, badgeService, toasterService) {
      var profileBadge = this
      profileBadge.badges = $scope.badgelist || []
      profileBadge.type = 'user'

      profileBadge.getAllBadges = function () {
        var badgeIds = _.map(profileBadge.badges, 'badgeId')
        var req = {
          request: {
            filters: {
              'badgeList': badgeIds,
              'type': profileBadge.type,
              'rootOrgId': $rootScope.rootOrgId
            }
          }
        }
        badgeService.getAllBadgesList(req).then(function (response) {
          if (response && response.responseCode === 'OK') {
            profileBadge.badges = (response.result && response.result.badges) || []
          } else {
          }
        }).catch(function () {
        })
      }
    }])
