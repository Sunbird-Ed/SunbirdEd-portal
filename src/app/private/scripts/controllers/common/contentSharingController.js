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
        telemetryService.interactTelemetryData($scope.type, contentShare.id, contentShare.type, $rootScope.version,
          $scope.type + '-read', 'share-' + $scope.type)
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
        telemetryService.shareTelemetryData($scope.type, contentShare.id, contentShare.type,
          $rootScope.version)
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
    }])
