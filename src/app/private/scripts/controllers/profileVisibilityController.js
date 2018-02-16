'use strict'

angular.module('playerApp')
  .controller('profileVisibilityController',
    ['$timeout', '$rootScope', '$scope', 'toasterService', 'userService', 'telemetryService',
      function ($timeout, $rootScope, $scope, toasterService, userService, telemetryService) {
        var profVisCtrl = this
        profVisCtrl.options = [{
          text: 'Hide this from everyone',
          value: 'private'
        },
        {
          text: 'Show this to all',
          value: 'public'
        }
        ]
        profVisCtrl.loader = {}
        profVisCtrl.privateProfileFields = []
        profVisCtrl.publicProfileFields = []
        $scope.visibility = ($rootScope.privateProfileFields.indexOf($scope.field) >= 0) ? 'private' : 'public'
        profVisCtrl.initDropdown = function () {
          $timeout(function () {
            $('.profile-privacy-drpdwn').dropdown()
          }, 100)
        }
        profVisCtrl.setProfileFieldLbl = function (visibility) {
          if ($scope.visibility !== visibility) {
            var profVisInfo = {
              field: $scope.field,
              visibility: visibility,
              update: $scope.update
            }
            profVisCtrl.updateProfVisFields(profVisInfo, function (err, success) {
              if (err) {
                toasterService.error($rootScope.messages.fmsg.m0048)
              } else {
                $scope.visibility = visibility
                toasterService.success($rootScope.messages.smsg.m0040)
              }
              profVisCtrl.loader[profVisInfo.field] = false
              profVisCtrl.privateProfileFields = []
              profVisCtrl.publicProfileFields = []
            })
          }
        }

        profVisCtrl.updateProfVisFields = function (profVisInfo, cb) {
          profVisCtrl.loader[profVisInfo.field] = true
          var req = {
            request: {
              userId: $rootScope.userId

            }
          }
          if (profVisInfo.visibility === 'private') {
            if (profVisCtrl.privateProfileFields.indexOf(profVisInfo.field) === -1) {
              profVisCtrl.privateProfileFields.push(profVisInfo.field)
            }
            _.remove(profVisCtrl.publicProfileFields, function (v) { return v === profVisInfo.field })
          } else if (profVisInfo.visibility === 'public') {
            if (profVisCtrl.publicProfileFields.indexOf(profVisInfo.field) === -1) {
              profVisCtrl.publicProfileFields.push(profVisInfo.field)
            }
            _.remove(profVisCtrl.privateProfileFields, function (v) { return v === profVisInfo.field })
          }
          if (profVisCtrl.privateProfileFields.length > 0) {
            req.request.private = profVisCtrl.privateProfileFields
          }
          if (profVisCtrl.publicProfileFields.length > 0) {
            req.request.public = profVisCtrl.publicProfileFields
          }
          userService.updateProfileFieldVisibility(req).then(function (response) {
            if (response && response.responseCode === 'OK') {
              cb(null, response)
            } else {
              cb(response, null)
            }
          })
        }

        // Telemetry interact event
        profVisCtrl.generateInteractEvent = function (pageId, objVer) {
          var edataId = telemetryService.ProfileLockConfig[$scope.field]
          telemetryService.interactTelemetryData('profile', $rootScope.userId, $scope.field, objVer, edataId, pageId)
        }
      }])
