'use strict'

angular.module('playerApp')
  .directive('sbPermissions', ['permissionsService', '$rootScope', function (permissionsService, $rootScope) {
    return {
      restrict: 'A',
      scope: {},
      link: function (scope, element, attrs) {
        if (attrs.permissionOnly) {
          if (!permissionsService.checkRolesPermissions(
            attrs.permissionOnly.split(','), true)) {
            element.remove()
            $rootScope.$broadcast('permissionOnlyViewUpdated', {'action': 'removed', 'element': element, 'attrs': attrs})
          } else {
            $rootScope.$broadcast('permissionOnlyViewUpdated', {'action': 'notRemoved', 'element': element, 'attrs': attrs})
          }
        }
        if (attrs.permissionExcept) {
          if (permissionsService.checkRolesPermissions(
            attrs.permissionExcept.split(','), false)) {
            element.remove()
          }
        }
      }
    }
  }])
