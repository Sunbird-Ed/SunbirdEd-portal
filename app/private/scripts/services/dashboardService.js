'use strict';

/**
 * @ngdoc service
 * @name playerApp.dashboardService
 * @description
 * @author Nilesh More
 * # notesService
 * Service in the playerApp.
 */

angular.module('playerApp')
    .service('dashboardService', ['httpServiceJava', 'httpService', 'config','$http', function (httpServiceJava,
     httpService, config, $http) {
        // To get course dashboard data
        this.getCourseDashboardData = function(req, datasetType){
            var apiUrl = 'dashboard/v1/progress/course/' + req.courseId + '?period='+ req.timePeriod;
            return httpServiceJava.get(apiUrl);
        };
    }]);
