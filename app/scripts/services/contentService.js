'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentService
 * @description
 * # contentService
 * Service in the playerApp.
 */
angular.module('playerApp')
        .service('contentService', function (httpService,config) {
            
            function search(req){
                var url = config.URL.BASE + config.URL.CONTENT.SEARCH;
                return httpService.postOperation(url, req);
            }
            
            return{
                search:search
            };

        });