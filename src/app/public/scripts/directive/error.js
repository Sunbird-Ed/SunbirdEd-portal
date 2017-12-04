'use strict'

angular.module('loginApp')
    .directive('errorMessage', [function () {
      return {
        template: '<div class="ui huge {{errorClass}} message" ng-if="message"><i ng-if="isClose" class="close icon" ng-click="closeErrorMessage()"></i><span>{{message}}</span></div>',
        restrict: 'E',
        scope: {
          visibility: '='
        },
        link: function postLink (scope, element, attrs) {
          attrs.data = attrs.data ? JSON.parse(attrs.data) : undefined
          scope.isClose = attrs.data && attrs.data.isClose ? attrs.data.isClose : false
          if (attrs.data && attrs.data.messageType === 'info') {
            scope.message = attrs.data.message ? attrs.data.message : 'Something wrong try in sometime.'
            scope.errorClass = 'info'
          } else if (attrs.data && attrs.data.messageType === 'warning') {
            scope.message = attrs.data.message ? attrs.data.message : 'Something wrong try in sometime.'
            scope.errorClass = 'warning'
          } else if (attrs.data && attrs.data.messageType === 'error') {
            scope.message = attrs.data.message ? attrs.data.message : 'Something wrong try in sometime.'
            scope.errorClass = 'error'
          } else if (attrs.data && attrs.data.messageType === 'success') {
            scope.message = attrs.data.message ? attrs.data.message : 'Success.'
            scope.errorClass = 'success'
          }

          scope.closeErrorMessage = function () {
            scope.visibility = false
          }
        }
      }
    }])
