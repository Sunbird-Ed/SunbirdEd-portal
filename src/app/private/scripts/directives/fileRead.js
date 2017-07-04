angular.module('playerApp')
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "=",
            fileresult: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        //scope.fileresult = loadEvent.target.result;
                        scope.fileread = changeEvent.target.files[0];
                    });
                }
                if (changeEvent.target.files.length) {
                    reader.readAsDataURL(changeEvent.target.files[0]);
                }
            });
        }
    }
}]);