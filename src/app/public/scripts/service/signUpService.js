'use strict'

angular.module('loginApp')
  .service('signUpService', ['httpService', 'config', function (httpService, config) {
    this.signUp = function (req) {
      var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.USER.SIGNUP
      return httpService.post(url, req)
    }
  }])
