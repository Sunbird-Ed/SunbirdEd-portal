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
            toasterService.error($rootScope.messages.fmsg.m0078)
          }
        }).catch(function () {
          toasterService.error($rootScope.messages.fmsg.m0078)
        })
      }

      contentBadge.hideContentBadgeModal = function () {
        $('#badgeAssignModel').modal('hide')
        $('#badgeAssignModel').modal('hide all')
        $('#badgeAssignModel').modal('hide dimmer')
      }

      contentBadge.initializeModal = function (badge) {
        contentBadge.showBadgeAssingModel = true
        $timeout(function () {
          $('#badgeAssignModel').modal({
            onHide: function () {
              contentBadge.showBadgeAssingModel = false
              contentBadge.selectedBadge = {}
            },
            onShow: function () {
              contentBadge.selectedBadge = badge
            }
          }).modal('show')
        }, 0)
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
            toasterService.success($rootScope.messages.smsg.moo42)
            contentBadge.selectedBadgeList.push(selectedBadge)
            contentBadge.allBadgeList = contentBadge.allBadgeList.filter(function (badge) {
              return badge.badgeId !== selectedBadge.badgeId
            })
          } else {
            toasterService.error($rootScope.messages.fmsg.m0079)
          }
        }).catch(function () {
          toasterService.error($rootScope.messages.fmsg.m0079)
        })
      }
    }])
