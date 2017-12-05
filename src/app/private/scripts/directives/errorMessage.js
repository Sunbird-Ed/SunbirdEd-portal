'use strict'

angular.module('playerApp')
    .directive('errorMessage', function () {
      return {
            templateUrl: 'views/common/errorPage.html', // eslint-disable-line
        restrict: 'E',
        scope: {
          visibility: '='
        },
        link: function postLink (scope, element, attrs) {
          attrs.data = attrs.data ? JSON.parse(attrs.data) : undefined
          scope.isClose = attrs.data && attrs.data.isClose ? attrs.data.isClose : false
          if (attrs.data && attrs.data.messageType === 'info') {
            scope.message = attrs.data.message
                        ? attrs.data.message
                        : 'Something wrong try in sometime.'
            scope.errorClass = 'info'
          } else if (attrs.data && attrs.data.messageType === 'warning') {
            scope.message = attrs.data.message
                        ? attrs.data.message
                        : 'Something wrong try in sometime.'
            scope.errorClass = 'warning'
          } else if (attrs.data && attrs.data.messageType === 'error') {
            scope.message = attrs.data.message
                        ? attrs.data.message
                        : 'Something wrong try in sometime.'
            scope.errorClass = 'error'
          } else if (attrs.data && attrs.data.messageType === 'success') {
            scope.message = attrs.data.message
                        ? attrs.data.message
                        : 'Success.'
            scope.errorClass = 'success'
          } else if (attrs.data && attrs.data.messageType === 'no-results') {
            scope.message = attrs.data.message ? attrs.data.message : ''
            scope.messageText = attrs.data.messageText
            scope.errorClass = 'no-results'
          }

          scope.closeErrorMessage = function () {
            scope.visibility = false
          }
        }
      }
    })
