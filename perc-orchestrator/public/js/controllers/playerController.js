var app = angular.module('playerControllers', []);

app.controller('PlayLOBCtrl', ['$scope', '$routeParams', '$http',

	function ($scope, $routeParams, $http) {
		console.log('route - ' + $routeParams.lobId);
    	$scope.lobId = $routeParams.lobId;
	}
]);
 
app.controller('PlayElementCtrl', ['$scope', '$routeParams',
	function($scope, $routeParams) {
		console.log('route2 - ' + $routeParams.lobId);
    	$scope.lobId = $routeParams.lobId;
    	$scope.elementId = $routeParams.elementId;
  	}
]);