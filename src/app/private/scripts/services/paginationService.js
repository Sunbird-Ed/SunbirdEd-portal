'use strict'

angular.module('playerApp')
    .service('PaginationService', [function () {
    /**
    * @class PaginationService
     * @desc Service to manages pagination.
     * @memberOf Services
     */

     /**
             * @method GetPager
             * @desc Manage pagination
             * @memberOf Services.PaginationService
             * @param {number}  totalItems - Total count of result
             * @param {number}  currentPage - Current page
             * @param {number}  pageSize - Number of items per page
             * @returns {Object} response - Pagination response object contains -totalPage,startPage,
             * endPage,pageIndex
             * @instance
             */
      this.GetPager = function (totalItems, currentPage, pageSize) {
        currentPage = currentPage || 1

        pageSize = pageSize || 10

        var totalPages = Math.ceil(totalItems / pageSize)

        var startPage
        var endPage
        if (totalPages <= 5) {
          startPage = 1
          endPage = totalPages
        } else if (currentPage <= 1) {
          startPage = 1
          endPage = 5
        } else if (currentPage + 4 >= totalPages) {
          startPage = totalPages - 4
          endPage = totalPages
        } else {
          startPage = currentPage
          endPage = currentPage + 4
        }
        var startIndex = (currentPage - 1) * pageSize
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

        var pages = _.range(startPage, endPage + 1)
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
        }
      }
    }])
