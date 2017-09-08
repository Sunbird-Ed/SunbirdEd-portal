'use strict';

/**
 * @ngdoc service
 * @name playerApp.workSpaceUtilsService
 * @description
 * @author Anuj Gupta
 * # workSpaceUtilsService
 * Service in the playerApp.
 */

angular.module('playerApp')
    .service('workSpaceUtilsService', [function () {
        this.reduceObjectIntoArray = function (items, key) {
            return items.reduce(function (validation, item, index) {
                validation[index] = item[key];
                return validation;
            }, []);
        };

        this.removeContentLocal = function (contentList, requestData) {
            return contentList.filter(function (content) {
                return requestData.indexOf(content.identifier) === -1;
            });
        };

        this.getDeletedContentIds = function (requestedIds, failedIds) {
            return requestedIds.filter(function (contentId) {
                return failedIds.indexOf(contentId) === -1;
            });
        };
    }]);
