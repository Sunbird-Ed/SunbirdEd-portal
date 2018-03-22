/**
 * @author: Anuj Gupta
 * @description: This controller useful to handle badge releated operation for content
 */

'use strict'

angular.module('playerApp')
  .controller('contentBadgeController', ['$timeout', '$state', '$rootScope', '$scope',
    'workSpaceUtilsService', 'telemetryService', 'badgeService', 'permissionsService', '$q', 'toasterService',
    function ($timeout, $state, $rootScope, $scope, workSpaceUtilsService, telemetryService, badgeService,
      permissionsService, $q, toasterService) {
      var contentBadge = this
      contentBadge.showBadgeAssingModel = false
      contentBadge.selectedBadgeList = ($scope.data && $scope.data.badgeAssertions) || []
      contentBadge.type = 'content'
      contentBadge.contentId = $scope.contentid

      contentBadge.getAllBadges = function () {
        var req = {
          request: {
            filters: {
              'issuerList': [],
              'rootOrgId': $rootScope.rootOrgId,
              'type': contentBadge.type,
              'roles': permissionsService.getCurrentUserRoles()
            }
          }
        }
        badgeService.getAllBadgesList(req).then(function (response) {
          if (response && response.responseCode === 'OK') {
            contentBadge.allBadgeList =
              _.differenceBy(response.result.badges, contentBadge.selectedBadgeList, 'badgeId')
          } else {
            toasterService.error('Unable to get badges, Please try again later')
          }
        }).catch(function (error) {
          toasterService.error(error.message)
        })
      }

      contentBadge.hideContentBadgeModal = function () {
        if (contentBadge.showBadgeAssingModel) {
          contentBadge.showBadgeAssingModel = false
          contentBadge.selectedBadge = undefined
          $timeout(function () {
            $('#badgeAssignModel').modal('hide')
            $('#badgeAssignModel').modal('hide others')
            $('#badgeAssignModel').modal('hide all')
            $('#badgeAssignModel').modal('hide dimmer')
          }, 0)
        } else {
        }
      }

      contentBadge.initializeModal = function (badge) {
        contentBadge.selectedBadge = badge
        contentBadge.showBadgeAssingModel = true
        $timeout(function () {
          $('#badgeAssignModel').modal({
            onHide: function () {
              contentBadge.hideContentBadgeModal()
            }
          }).modal('show')
        }, 10)
      }

      contentBadge.assignBadge = function (selectedBadge) {
        var req = {
          'issuerId': selectedBadge.issuerId,
          'badgeId': selectedBadge.badgeId,
          'recipientId': contentBadge.contentId,
          'recipientType': contentBadge.type
        }

        badgeService.addBadges({ request: req }).then(function (response) {
          if (response && response.responseCode === 'OK') {
            contentBadge.hideContentBadgeModal()
            toasterService.success('Badge assigned successfully')
            contentBadge.selectedBadgeList.push(selectedBadge)
            contentBadge.allBadgeList = contentBadge.allBadgeList.filter(function (badge) {
              return badge.badgeId !== selectedBadge.badgeId
            })
          } else {
            toasterService.error('Unable to assign badges, Please try again later')
          }
        }).catch(function () {
          toasterService.error('Unable to assign badges, Please try again later')
        })
      }
    }])
