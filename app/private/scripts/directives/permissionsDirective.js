'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:permissionsDirective
 * @description
 * # permissionsDirective
 */
angular.module('playerApp')
.directive('sbPermissions', function (permissionsService) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            if (attrs.permissionOnly) {
                if (!permissionsService.checkRolesPermissions(
                    attrs.permissionOnly.split(','), true)) {
                    element.remove();
                }
            }
            if (attrs.permissionExcept) {
                if (permissionsService.checkRolesPermissions(
                    attrs.permissionExcept.split(','), false)) {
                    element.remove();
                }
            }
        }
    };
});
