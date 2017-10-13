'use strict';

angular.module('playerApp')
    .service('dataService', function () {
        var data = {};
        this.setData = function (key, value) {
            data[key] = value;
        };
        this.getData = function (key) {
            return data[key];
        };
    });

