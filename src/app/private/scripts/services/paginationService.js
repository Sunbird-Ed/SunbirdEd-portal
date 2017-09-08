'use strict';

angular.module('playerApp')
    .service('PaginationService', [function () {
    // service definition
        var service = {};

    // service implementation
        function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
            currentPage = currentPage || 1;

        // default page size is 10
            pageSize = pageSize || 10;

        // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage;
            var endPage;
            if (totalPages <= 5) {
                // less than 5 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 5 total pages so calculate start and end pages
                if (currentPage <= 1) {
                    startPage = 1;
                    endPage = 5;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 4;
                    endPage = totalPages;
                } else {
                    startPage = currentPage;
                    endPage = currentPage + 4;
                }
            }

        // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }

        service.GetPager = GetPager;

        return service;
    }]);
