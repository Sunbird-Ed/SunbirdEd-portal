'use strict';

angular.module('loginApp')
    .filter('dateFilterWithMDY', function () {
        return function (date) {
            return moment(date).format('MMMM Do YYYY');
        };
    })
    .filter('dateFilterXTimeAgo', function () {
        return function (date) {
            var local = moment(date).local().format('YYYY-MM-DD HH:mm:ss');
            return moment(local).fromNow();
        };
    });
