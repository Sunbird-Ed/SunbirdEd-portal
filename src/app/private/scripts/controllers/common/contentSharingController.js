'use strict'

angular.module('playerApp')
  .controller('contentSharingController', ['$timeout', '$state', '$rootScope', '$scope',
    'workSpaceUtilsService', 'telemetryService',
    function ($timeout, $state, $rootScope, $scope, workSpaceUtilsService, telemetryService) {
      var contentShare = this
      contentShare.showContentShareModal = false
      contentShare.id = $scope.id
      contentShare.type = $scope.type
      contentShare.icon = $scope.icon
      if (contentShare.type) {
        contentShare.link = workSpaceUtilsService.getPublicShareUrl(contentShare.id, contentShare.type)
      }
      if ($scope.data) {
        contentShare.link = workSpaceUtilsService.getUnlistedShareUrl($scope.data)
      }

      contentShare.hideContentShareModal = function () {
        $timeout(function () {
          contentShare.showContentShareModal = false
          $('#contentShareModal').modal('hide')
          $('#contentShareModal').modal('hide others')
          $('#contentShareModal').modal('hide all')
          $('#contentShareModal').modal('hide dimmer')
        }, 0)
      }

      contentShare.initializeModal = function () {
        contentShare.showContentShareModal = true
        console.log('scope--', $scope)
        contentShare.generateInteractEvent('share-course', 'course-read', contentShare.id)
        $timeout(function () {
          $('#contentShareModal').modal({
            onHide: function () {
              contentShare.hideContentShareModal()
            }
          }).modal('show')
        }, 10)
        $timeout(function () {
          $('#copyLinkButton').trigger('click', function () {
            contentShare.copyLink()
          })
        }, 1000)
        contentShare.generateShareEvent(contentShare.id, contentShare.type)
      }

      contentShare.close = function () {
        contentShare.showContentShareModal = false
        contentShare.hideContentShareModal()
      }

      contentShare.copyLink = function () {
        $('#copyLinkData').select()
        document.execCommand('copy')
        $('#buttonPopUp')
          .popup({
            popup: $('#LinkCopiedToClipboard'),
            on: 'click',
            position: 'top center',
            color: '#4183c4'
          })
      }

      // telemetry event  for SHARE event
      contentShare.generateShareEvent = function (itemId, itemType) {
        var contextData = {
          env: $scope.type,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }
        var objRollup = ''
        if (itemId !== '') {
          objRollup = [itemId]
        }

        var objectData = {
          id: itemId,
          type: itemType,
          ver: '0.1',
          rollup: telemetryService.getRollUpData(objRollup)
        }

        var items = [telemetryService.getItemData(itemId, itemType, '0.1')]

        var data = {
          edata: telemetryService.shareEventData('Link', items, 'Out'),
          context: telemetryService.getContextData(contextData),
          object: telemetryService.getObjectData(objectData),
          tags: $rootScope.organisationIds
        }
        telemetryService.share(data)
      }

      /**
             * This function call to generate telemetry
             * on click of share icon.
             */
      contentShare.generateInteractEvent = function (edataId, pageId, itemId) {
        var contextData = {
          env: $scope.type,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }

        var objRollup = ''
        if (itemId !== '') {
          objRollup = [itemId]
        }

        var objectData = {
          id: itemId,
          type: edataId,
          ver: '0.1',
          rollup: telemetryService.getRollUpData(objRollup)
        }

        var data = {
          edata: telemetryService.interactEventData('CLICK', '', edataId, pageId),
          context: telemetryService.getContextData(contextData),
          object: telemetryService.getObjectData(objectData),
          tags: $rootScope.organisationIds
        }
        telemetryService.interact(data)
      }
    }])
