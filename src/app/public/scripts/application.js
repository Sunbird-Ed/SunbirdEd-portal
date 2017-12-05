'use strict'

angular.module('loginApp', [
  'ngRoute',
  'ui.router',
  'loginApp.labels',
  'playerApp.messages',
  'playerApp.frmelmnts',
  'loginApp.config',
  'loginApp.errorMessages',
  'uuid4',
  'ngSanitize'
])
  .controller('loginCtrl', ['labels', '$rootScope', 'messages', 'frmelmnts',
    function (labels, $rootScope, messages, frmelmnts) {
      $rootScope.language = window.localStorage.language || $('#defaultPortalLanguage').attr('value') || 'en'
      $rootScope.messages = messages[$rootScope.language]
      $rootScope.frmelmnts = frmelmnts[$rootScope.language]
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
