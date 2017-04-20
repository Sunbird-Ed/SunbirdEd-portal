var studioApp = angular.module('studioApp', ['ngRoute', 'appServices', 'ui']);

studioApp.factory('contentService', function($http) {
    return {
        getMediaContent: function(courseId, callback) {
            $http.get('/private/v1/content/media/' + encodeURIComponent(courseId)).success(function(data) {
                callback(data);
            });
        }
    };
});

studioApp.filter("transformId", function() {
    return function(identifier) {
        identifier = identifier.replace('info:fedora/', '');
        identifier = identifier.replace(':', '-');
        return identifier;
    }
});

studioApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/viewCourse', {
            templateUrl: '/templates/course/viewCourse.html',
            controller: 'ViewCourseCtrl'
        }).
        when('/courseStructure', {
            templateUrl: '/templates/course/courseStructure.html',
            controller: 'CourseStructureCtrl'
        }).
        when('/learningObjects', {
            templateUrl: '/templates/course/learningObjects.html',
            controller: 'LearningObjectCtrl'
        });
    }
]);

angular.module('appServices', [])
.factory('page', function($rootScope){
    var pageTitle = "";
    var editor = false;
    return {
        courseTitle:function(){
            return pageTitle;
        },
        setCourseTitle:function(newTitle){
            pageTitle = newTitle;
        },
        editor:function(){
            return editor;
        },
        setEditor:function(value){
            editor = value;
        }
    }
})
.factory('action', function($rootScope){
    var selectedAction = "";
    var addEnabled = false, describeEnabled = false, enhanceEnabled = false, enrichEnabled = false, sequenceEnabled = false;
    return {
        selectedAction:function(){
            return selectedAction;
        },
        setSelectedAction:function(actionText){
            selectedAction = actionText;
        },
        addEnabled: false,
        describeEnabled: false,
        enhanceEnabled: false,
        enrichEnabled: false,
        sequenceEnabled: false
    }
})

studioApp.controller('MainController', function($scope, page) {
    $scope.page=page;
});