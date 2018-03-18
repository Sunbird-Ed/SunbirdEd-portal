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
      contentBadge.selectedBadgeList = []
      contentBadge.type = 'content'
      contentBadge.contentId = $scope.contentid
      contentBadge.recipientEmail = 'dummy_content_email@gmail.com'

      contentBadge.getAllIssuerList = function () {
        var deferred = $q.defer()
        badgeService.getIssueList().then(function (response) {
          if (response && response.responseCode === 'OK') {
            deferred.resolve(response)
          } else {
            deferred.reject(new Error('Unable to get badges, Please try again later'))
          }
        }).catch(function () {
          deferred.reject(new Error('Unable to get badges, Please try again later'))
        })
        return deferred.promise
      }

      contentBadge.getAllBadges = function () {
        var req = {
          request: {
            'issuerList': [],
            'context': {
              'rootOrgId': $rootScope.rootOrgId,
              'type': contentBadge.type,
              'roles': permissionsService.getCurrentUserRoles()
            }
          }
        }

        contentBadge.getAllIssuerList().then(function (issueResp) {
          req.request.issuerList = _.map(issueResp.result.issuers, 'issuerId')
          badgeService.getAllBadgesList(req).then(function (response) {
            if (response && response.responseCode === 'OK') {
              contentBadge.allBadgeList = response.result.badges
            } else {
              toasterService.error('Unable to get badges, Please try again later')
            }
          }).catch(function (error) {
            toasterService.error(error)
          })
        }).catch(function (error) {
          toasterService.error(error)
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
          'recipientEmail': contentBadge.recipientEmail,
          'recipientId': contentBadge.contentId,
          'recipientType': contentBadge.type
        }
        console.log('Assign batch req:', req)

        badgeService.addBadges({request: req}).then(function (response) {
          if (response && response.responseCode === 'OK') {
            contentBadge.selectedBadgeList.push(selectedBadge)
            contentBadge.allBadgeList = contentBadge.allBadgeList.filter(function (badge) {
              return badge.badgeClassId !== selectedBadge.badgeClassId
            })
            contentBadge.hideContentBadgeModal()
          } else {
            toasterService.error('Unable to assing badges, Please try again later')
          }
        }).catch(function () {
          toasterService.error('Unable to assing badges, Please try again later')
        })
      }
    }])
