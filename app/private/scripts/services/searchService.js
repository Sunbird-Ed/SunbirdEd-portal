'use strict';

angular.module('playerApp')
    .service('searchService', ['httpService', 'config', '$q', function (httpService, config, $q) {
        this.contentSearch = function (req) {
            return httpService.post(config.URL.CONTENT.SEARCH, req);
        };

        this.courseSearch = function (req) {
            return httpService.post(config.URL.COURSE.SEARCH, req);
        };

        this.search = function (req) {
            return httpService.post(config.URL.COMPOSITE.SEARCH, req);
        };
        this.setPublicUserProfile = function (user) {
            this.publicUser = { responseCode: 'OK',
                result: {
                    response: user }
            };
            return true;
        };
        this.getPublicUserProfile = function (identifier) {
            if (this.publicUser) {
                var deferred = $q.defer();
                deferred.resolve(this.publicUser);
                return deferred.promise;
            }
            return httpService.get(config.URL.USER.GET_PROFILE + '/' + identifier);
        };
    }]);
