'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:bulkUpload
 * @author:Poonam sharma
 * @description
 * # bulkUpload
 */
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
    };
});
