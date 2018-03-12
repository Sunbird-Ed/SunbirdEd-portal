/**
 * @author: Anuj Gupta
 * @description: This controller useful to handle badge releated operation for content
 */

'use strict'

angular.module('playerApp')
  .controller('contentBadgeController', ['$timeout', '$state', '$rootScope', '$scope',
    'workSpaceUtilsService', 'telemetryService', 'badgeService',
    function ($timeout, $state, $rootScope, $scope, workSpaceUtilsService, telemetryService, badgeService) {
      var contentBadge = this
      contentBadge.showBadgeAssingModel = false
      contentBadge.selectedBadgeList = []
      contentBadge.type = 'content'
      contentBadge.contentId = $scope.contentid
      contentBadge.recipientEmail = 'dummy_content_email@gmail.com'

      contentBadge.getAllBadges = function () {
        var req = {
          'rootOrgId': $rootScope.rootOrgId,
          'type': contentBadge.type
        }
        badgeService.getBadgesList(req).then(function (response) {
          console.log('res:', response)
        }).catch(function (error) {
          console.log(error)
        })
        contentBadge.allBadgeList = [{
          'issuerId': 'islug123',
          'badgeClassId': 'bslug123',
          'badgeClassName': 'OFFICIAL',
          'badgeClassImage': '/common/images/pdf.png',
          'assertionId': 'aslug123',
          'createdTS': 1520586333
        },
        {
          'issuerId': 'islug123',
          'badgeClassId': 'bslug1234',
          'badgeClassName': 'EDITOR\'S PICK',
          'badgeClassImage': '/common/images/mp4.png',
          'assertionId': 'aslug123',
          'createdTS': 1520586333
        }, {
          'issuerId': 'islug123',
          'badgeClassId': 'bslug1235',
          'badgeClassName': 'OFFICIAL2',
          'badgeClassImage': '/common/images/pdf.png',
          'assertionId': 'aslug125',
          'createdTS': 1520586333
        },
        {
          'issuerId': 'islug123',
          'badgeClassId': 'bslug12346',
          'badgeClassName': 'EDITOR\'S PICK 2',
          'badgeClassImage': '/common/images/mp4.png',
          'assertionId': 'aslug1236',
          'createdTS': 1520586333
        }]
      }

      contentBadge.hideContentBadgeModal = function () {
        $timeout(function () {
          contentBadge.showBadgeAssingModel = false
          $('#badgeAssignModel').modal('hide')
          $('#badgeAssignModel').modal('hide others')
          $('#badgeAssignModel').modal('hide all')
          $('#badgeAssignModel').modal('hide dimmer')
        }, 0)
      }

      contentBadge.initializeModal = function (badge) {
        contentBadge.selectedBadge = badge
        contentBadge.showBadgeAssingModel = true
        $timeout(function () {
          $('#badgeAssignModel').modal({
            onHide: function () {
              if (contentBadge.showBadgeAssingModel) {
                contentBadge.hideContentBadgeModal()
              }
            }
          }).modal('show')
        }, 10)
      }

      contentBadge.assignBadge = function (selectedBadge) {
        var req = {
          'issuerId': selectedBadge.issuerId,
          'badgeId': selectedBadge.badgeClassId,
          'recipientEmail': contentBadge.recipientEmail,
          'recipientId': contentBadge.contentId,
          'recipientType': contentBadge.type
        }
        console.log('Assign batch req:', req)

        contentBadge.selectedBadgeList.push(selectedBadge)
        contentBadge.allBadgeList = contentBadge.allBadgeList.filter(function (badge) {
          return badge.badgeClassId !== selectedBadge.badgeClassId
        })
        contentBadge.hideContentBadgeModal()
      }
    }])
