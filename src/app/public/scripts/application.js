'use strict'

angular.module('loginApp', [
  'ngRoute',
  'ui.router',
  'loginApp.labels',
  'loginApp.errorMessages',
  'loginApp.config',
  'uuid4',
  'ngSanitize'
])
  .controller('loginCtrl', ['labels', '$rootScope', 'errorMessages',
    function (labels, $rootScope, errorMessages) {
      $rootScope.errorMessages = errorMessages
      $rootScope.labels = labels
      $rootScope.cdnUrl = $('#cdnUrl').attr('value') || ''
      $rootScope.theme = $('#theme').attr('value') || 'default'
      $rootScope.getQueryStringValue = function (key) {
        return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' +
              encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1')); //eslint-disable-line
      }
      var error = $rootScope.getQueryStringValue('error')

      if (error && atob(error) !== 'undefined') {
        alert(atob(error))
      }

          /**
           * Delete redirect url if user direct close the window
           */
      $(window).on('onunload', function () {
        delete window.localStorage.redirectUrl
      })
    }])
