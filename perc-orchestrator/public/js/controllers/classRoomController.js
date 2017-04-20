app.service('classRoomService', ['$http', '$q', '$rootScope',  function($http, $q, $rootScope) {
	
}]);
app.controller('listClassRoomCtrl',['$scope', '$http', '$timeout', '$rootScope', 'classRoomService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', '$q', function($scope, $http, $timeout, $rootScope, service, $stateParams, $location, CourseBrowserService, $window, $state, $q) {

		$rootScope.showConceptMap = false;
		
	    $scope.getTheClassRooms = function(){
	    	$http.get('/private/v1/player/dashboard/user').success(function(user) {
            	$scope.userId = user.identifier;
            	var data = new Object();
		    	data.courseId = $rootScope.courseId;
		    	data.userId = $scope.userId;
		    	$http.post('/private/v1/player/getClassRooms',data).success(function(learningResource){
		    		$scope.currentClassRooms = learningResource.currentClassRooms;
		    		$scope.upcomingClassRooms = learningResource.upcomingClassRooms;
		    		$scope.completedClassRooms = learningResource.completedClassRooms ;
		    	});
        	});
	    }

	    $scope.setEventStatus = function(accepted, objectId) {
	        var data = {
	            objectId: objectId,
	            courseId: $rootScope.courseId
	        };
	        if (accepted) {
	            $http.post('/private/v1/coaching/event/accept', data).success(function(resp) {
	                if (resp.status) {
	                    $scope.updateSessionStatus(objectId, resp);
	                }
	            });
	        } else {
	            $http.post('/private/v1/coaching/event/decline', data).success(function(resp) {
	                if (resp.status) {
	                    $scope.updateSessionStatus(objectId, resp);
	                }
	            });   
	        }
	    };

	    $scope.updateSessionStatus = function(objectId, resp) {
	    	var classrooms = $scope.upcomingClassRooms;
	    	for (var i=0; i<classrooms.length; i++) {
	    		if (classrooms[i].identifier == objectId) {
	    			classrooms[i].event.action = resp.status;
	    			classrooms[i].event.lastUpdated = resp.lastUpdated;
	    			break;
	    		}
	    	}
	    }

	    $scope.getTheClassRooms();

	    $scope.getClassRoomUrl = function(lr){
	    	return encodeURIComponent(lr.courseId)+'#/lecture/'+CourseBrowserService.removeFedoraPrefix(lr.lobId)+'/'+CourseBrowserService.removeFedoraPrefix(lr.identifier);
	    }
}]);