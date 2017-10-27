'use strict'

angular.module('playerApp')
    .filter('isValidObjectFilter', function () {
      return function (obj) {
        return !(obj === undefined || obj === null || Object.keys(obj).length === 0)
      }
    })
