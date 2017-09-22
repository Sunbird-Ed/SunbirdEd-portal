'use strict';

angular.module('playerApp')
    .service('searchService', ['httpService', 'config', '$q', 'httpServiceJava',
        function (httpService, config, $q, httpServiceJava) {
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
            this.getOrgTypes = function () {
                var url = config.URL.ORG_TYPE.GET;
                return httpServiceJava.get(url);
            };
            this.setOrgTypes = function (orgTypes) {
                this.orgTypes = orgTypes;
            };

            this.getOrgTypeS = function () {
                if (this.orgTypes) {
                    var deferred = $q.defer();
                    deferred.resolve(this.orgTypes);
                    return deferred.promise;
                }
                return this.getOrgTypes().then(function (res) {
                    if (res.responseCode === 'OK') {
                        return res.result.response;
                    }
                });
            };
        }]);
