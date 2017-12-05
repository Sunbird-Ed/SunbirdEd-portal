'use strict'

angular.module('playerApp')
    .controller('playerCtrl', ['$stateParams', '$log', '$scope', '$rootScope', '$sessionStorage',
      '$timeout', '$location', '$anchorScroll', function ($stateParams, $log, $scope, $rootScope,
        $sessionStorage, $timeout, $location, $anchorScroll) {
        var player = this
        player.contentPlayer = {
          isContentPlayerEnabled: false
        }
        player.ngInit = function () {
          if ($stateParams.content) {
            player.contentPlayer.isContentPlayerEnabled = true
            player.contentPlayer.contentData = $stateParams.content
            player.hashId = 'content/' + $stateParams.content.identifier
          } else if ($location.hash() !== '') {
            player.contentPlayer.isContentPlayerEnabled = true
            player.hashId = $location.hash()
            player.contentPlayer.contentId =
                player.hashId.replace('content/', '')
          } else if ($stateParams.contentId) {
            player.contentPlayer.isContentPlayerEnabled = true
            player.contentPlayer.contentId = $stateParams.contentId
            player.hashId = 'content/' + $stateParams.contentId
          }
          player.scrollToPlayer()
        }
        player.scrollToPlayer = function () {
          $location.hash(player.hashId)
          $timeout(function () {
            $anchorScroll()
          }, 500)
        }
      }])
