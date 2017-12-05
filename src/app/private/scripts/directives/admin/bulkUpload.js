'use strict'

angular.module('playerApp').directive('bulkUpload', function () {
  return {
    templateUrl: 'views/admin/uploadFile.html',
    restrict: 'E',
    scope: {
      type: '='
    },
    link: function (scope, element, attrs) {
    },
    controller: 'bulkUploadController as admin'
  }
})
