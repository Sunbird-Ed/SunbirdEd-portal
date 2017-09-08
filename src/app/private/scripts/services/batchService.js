'use strict';

/**
 * @ngdoc service
 * @name playerApp.batchService
 * @description
 * # batchService
 * Service in the playerApp.
 */

angular.module('playerApp')
    .service('batchService', ['httpServiceJava', 'config', function(httpServiceJava, config){
        var batchDetails = '';
        this.create = function (req) {
            return httpServiceJava.post(config.URL.BATCH.CREATE, req);
        };

        this.update = function (req) {
            return httpServiceJava.patch(config.URL.BATCH.UPDATE, req);
        };

        this.addUsers = function (req, batchId) {
            return httpServiceJava.post(config.URL.BATCH.ADD_USERS + '/' + batchId, req);
        };

        this.removeUsers = function (req) {
            return httpServiceJava.remove(config.URL.BATCH.DELETE + '/' + req.batchId, req);
        };

        this.getBatchDetails = function (req) {
            return httpServiceJava.get(config.URL.BATCH.GET_DETAILS + '/' + req.batchId, req);
        };

        this.getAllBatchs = function (req) {
            return httpServiceJava.post(config.URL.BATCH.GET_BATCHS, req);
        };

        this.getUserList = function(req){
            return httpServiceJava.post(config.URL.ADMIN.USER_SEARCH, req);
        }

        this.setBatchData = function (batchData) {
            this.batchDetails = batchData;
        };

        this.getBatchData = function(){
            return this.batchDetails;
        };
    }]);