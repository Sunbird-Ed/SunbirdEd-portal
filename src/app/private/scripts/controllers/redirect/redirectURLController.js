'use strict'

angular.module('playerApp')
  .controller('redirectURLController', ['$rootScope', '$scope',
    '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'QueryService', 'Visualizer',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService,
      adminService, QueryService, Visualizer) {
      init()
      function init () {
        $timeout(function () {
          window.open(window.redirectUrl, '_self')
        }, window.timetobethere)
      }
      $scope.goBack = function () {
        window.close()
      }
    } ])
