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
    .service('dashboardService', ['httpService', 'config','$http', function (httpService, config, $http) {
        this.getAdminDashboardData = function (req, datasetType) {
            //var url = datasetType === 'creation' ? creationUrl : consumption
            //var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.SEARCH; // TODO- change URL
            //return httpService.post(url, req);
            var mockUrl = 'http://52.172.36.121:9000/api/dashboard/v1/org/sunbird/creation?period=7d';

            return $http({
                method: 'GET',
                url: mockUrl
            })
        };

        // To get course dashboard data
        this.getCourseDashboardData = function(req, datasetType){
            //alert('In service');
            var mockUrl = 'https://dev.open-sunbird.org/api/dashboard/v1/progress/course/do_123?period=14d';
            return $http({
                method: 'GET',
                url: mockUrl,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Consumer-ID': 'X-Consumer-ID',
                    'ts': '2017-05-25 10:18:56:578+0530',
                    'X-msgid':'8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'X-Device-ID': 'X-Device-ID',
                    'X-Authenticated-Userid': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a',
                    'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMTc1MDIwNDdlODc0ODZjOTM0ZDQ1ODdlYTQ4MmM3MyJ9.7LWocwCn5rrCScFQYOne8_Op2EOo-xTCK5JCFarHKSs'
                }
            })
        };
    }]);
