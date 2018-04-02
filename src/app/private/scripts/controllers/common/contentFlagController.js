'use strict'

angular.module('playerApp')
  .controller('contentFlagController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', 'toasterService', '$scope', 'telemetryService',
    function (contentService, $timeout, $state,
      config, $rootScope, toasterService, $scope, telemetryService) {
      var contentFlag = this
      contentFlag.showContentFlagModal = false
      contentFlag.userId = $rootScope.userId
      contentFlag.userFullName = $rootScope.firstName + ' ' + $rootScope.lastName
      contentFlag.contentId = $scope.contentid
      contentFlag.contentName = $scope.contentname
      contentFlag.contentVersionKey = $scope.versionkey
      contentFlag.reasons = [{
        name: 'Inappropriate content',
        value: 'Inappropriate Content',
        description: 'Hateful, harmful or explicit lesson that is inappropriate for young learners'
      }, {
        name: 'Copyright violation',
        value: 'Copyright Violation',
        description: 'Uses copyrighted work without permission'
      }, {
        name: 'Privacy violation',
        value: 'Privacy Violation',
        description: 'Collects sensitive data or personal information about users, such as name' +
        '\n address, photo or other personally identifiable information'
      }, {
        name: 'Other',
        value: 'Other'
      }]

      contentFlag.reasonDescription = {

      }
      contentFlag.flagMessage = $scope.type === 'course' ? $rootScope.frmelmnts.instn.t0018
        : $rootScope.frmelmnts.instn.t0019

      contentFlag.hideContentFlagModal = function () {
        $('#contentFlagModal').modal('hide')
        $('#contentFlagModal').modal('hide others')
        $('#contentFlagModal').modal('hide dimmer')
      }

      contentFlag.initializeModal = function () {
        contentFlag.showContentFlagModal = true
        telemetryService.interactTelemetryData($scope.type, $scope.contentid, $scope.type,
          $rootScope.version, $scope.type + '-flag', $scope.type + '-read')
        $timeout(function () {
          $('#contentFlagModal').modal({
            onShow: function () {
              $('.helpPopup').popup({
                inline: true
              })
            },
            onHide: function () {
              contentFlag.showContentFlagModal = false
              contentFlag.data = {}
            }
          }).modal('show')
        }, 10)
      }

      contentFlag.createFlag = function (requestData) {
        contentFlag.loader = toasterService.loader('', $rootScope.messages.stmsg.m0077)
        contentService.flag(requestData, contentFlag.contentId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            $timeout(function () {
              contentFlag.loader.showLoader = false
              contentFlag.showContentFlagModal = false
              contentFlag.hideContentFlagModal()
              contentFlag.close()
            }, 2000)
          } else {
            contentFlag.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0050)
          }
        }).catch(function () {
          contentFlag.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0050)
        })
      }

      contentFlag.saveMetaData = function (data) {
        var requestData = {
          flaggedBy: contentFlag.userFullName,
          versionKey: contentFlag.contentVersionKey
        }
        if (data.flagReasons) {
          requestData.flagReasons = [data.flagReasons]
        }
        if (data.comment) {
          requestData.flags = [data.comment]
        }
        contentFlag.createFlag(requestData)
      }

      contentFlag.close = function () {
        contentFlag.hideContentFlagModal()
        if ($rootScope.search.searchKeyword !== '') {
          $timeout(function () {
            $rootScope.$emit('initSearch', {})
          }, 0)
        } else {
          $state.go($scope.redirect)
        }
      }
    }
  ])
