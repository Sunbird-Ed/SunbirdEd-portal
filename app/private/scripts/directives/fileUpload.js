angular.module('playerApp').directive('fineUploader', function() {
  return {
    templateUrl: 'views/common/fileUploader.html',
    restrict: 'A',
    require: '?ngModel',
    scope: {},
    link: function($scope, element, attributes, ngModel) {
      
    },
  };
});