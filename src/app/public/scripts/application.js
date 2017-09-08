'use strict';

/**
 * @ngdoc overview
 * @name loginApp
 * @description
 * # loginApp
 *
 * Main module of the application.
 */
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
          $rootScope.errorMessages = errorMessages;
          $rootScope.labels = labels;
          $rootScope.getQueryStringValue = function (key) {
              return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' +
              encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1')); //eslint-disable-line
          };
          var error = $rootScope.getQueryStringValue('error');

          if (error && atob(error) !== 'undefined') {
              alert(atob(error));
          }

          /**
           * Delete redirect url if user direct close the window
           */
          $(window).on('onunload', function () {
              delete window.localStorage.redirectUrl;
          });
      }]);
