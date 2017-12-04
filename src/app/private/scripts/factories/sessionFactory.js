'use strict'

angular.module('playerApp')
.factory('sessionService', ['$window', function ($window) {
    var sessionData = sessionData || // eslint-disable-line
    JSON.parse($window.sessionStorage.getItem('sbConfig') || '{}')
  return {

    getSessionData: function (key) {
      return sessionData[key]
    },
    setSessionData: function (key, value) {
      sessionData[key] = value
      $window.sessionStorage
            .setItem('sbConfig', JSON.stringify(sessionData))
    }

  }
}])
