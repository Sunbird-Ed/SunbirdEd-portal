'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular.module('loginApp', ['loginApp.labels', 'loginApp.errorMessages'])
  .controller('loginCtrl', function(labels, $rootScope, errorMessages) {
    $rootScope.errorMessages = errorMessages;
    $rootScope.labels = labels;
    $rootScope.getQueryStringValue = function(key) {
      return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    };
    var error = $rootScope.getQueryStringValue('error')
    if (error && atob(error) !== "undefined") {
      iziToast.error({
        'title': 'Error',
        'message': atob(error),
        'position': 'topCenter',
        'progressBar': false,
        'timeout': false
      });
    }
  });
