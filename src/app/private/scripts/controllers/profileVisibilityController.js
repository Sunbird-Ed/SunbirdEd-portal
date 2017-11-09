'use strict';

angular.module('playerApp')
        .controller('profileVisibilityController', ['$timeout', '$rootScope', '$scope', function ($timeout, $rootScope, $scope) {
            var profVisCtrl = this;
            profVisCtrl.options = [{
                text: 'Hide this from everyone',
                value: 'private'
            },
            {
                text: 'Show this to all',
                value: 'public'
            }
            ];
            $scope.visibility = ($rootScope.privateProfileFields.indexOf($scope.field) >= 0) ? 'private' : 'public';
            profVisCtrl.initDropdown = function () {
                $timeout(function () {
                    $('.ui.inline.dropdown').dropdown();
                }, 100);
            };
            profVisCtrl.setProfileFieldLbl = function (visibility) {
                $scope.visibility = visibility;
                $rootScope.$broadcast('profileVisibilityChange', {
                    field: $scope.field,
                    visibility: $scope.visibility,
                    update: $scope.update
                });
            };
        }]);
