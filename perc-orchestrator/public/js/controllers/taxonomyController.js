studioApp.controller('TaxonomyController', function($scope, $http) {

    $scope.taxonomyClass = '';
    $scope.taxonomyName = '';
    $scope.metadata=[];
    $scope.addRowsSize = 5;
    $scope.lomCategories = ['LOM General','LOM Lifecycle','LOM Rights','LOM Annotation','LOM Technical','LOM Education','Perceptron Pedagogic','Perceptron Tutoring'];
    $scope.lomCategoryTypes = ['Informative', 'Descriptive'];
    $scope.dataTypes = ['Text', 'Number', 'Boolean', 'TextArea'];

    $scope.addRows = function() {
        for(var i=0; i < $scope.addRowsSize; i++) {
            $scope.metadata.push({lobCategoryType: 'Informative', dataType: 'Text', maxLength: 50, occurence: 1, editable: true});
        }
    }

    $scope.saveTaxonomy = function() {
        var nonEmptyMetadata = jQuery.grep(
                $scope.metadata,
                function (item,index) {
                  return (item.propertyName && item.propertyName !=  "");
                });
        var obj = new Object();
        obj.taxonomyClass = $scope.taxonomyClass;
        obj.taxonomyName = $scope.taxonomyName;
        obj.metadata = nonEmptyMetadata;
        $http.post("/private/v1/taxonomy/export/", obj).success(function(data) {
            console.log(data);
        });
    }

    $scope.getTaxonomy = function(fileName) {
        $http.get("/json/taxonomy/" + fileName).success(function(data) {
            $scope.taxonomyClass = data.taxonomyClass;
            $scope.taxonomyName = data.taxonomyName;
            $scope.metadata = data.metadata;
        });
    }

});
