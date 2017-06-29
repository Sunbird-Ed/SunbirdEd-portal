'use strict';

angular.module('playerApp')
    .service('storeService', function() {
        var searchRequest = {};
        var event = null;
        this.saveSearchReq = function(request) {
            searchRequest = request;
        };
        this.saveSearchEvent = function(reqEvent) {
            event = reqEvent;
        };

        this.getSearchRequest = function() {
            return searchRequest;
        };
        this.getSearchEvent = function() {
            return event;
        };
    });