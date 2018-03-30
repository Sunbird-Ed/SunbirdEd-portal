import * as _ from 'lodash';
import { Injectable } from '@angular/core';

/**
 * Service for pagination
 *
 */
@Injectable()

/**
 * PaginationService excepts 3 parameters which
 * helps to create the pager object.
 */
export class PaginationService {

  /**
  * Method to make api call to get inbox data.
  * It calls the post method from data service class
  *
  * @param {number} totalItems Total number of items
  * @param {number} currentPage Current page number which needs to be displayed
  * @param {number} pageSize Number of items to be displayed in a page
  * @param {number} pageStrip Number of page strip displayed in a page
  */
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10, pageStrip: number = 5) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // set start page and end page
    let startPage: number, endPage: number;
    if (totalPages <= pageStrip) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // when pagination is on the first section
      if (currentPage <= 1) {
        startPage = 1;
        endPage = pageStrip;
        // when pagination is on the last section
      } else if (currentPage + (pageStrip - 1) >= totalPages) {
        startPage = totalPages - (pageStrip - 1);
        endPage = totalPages;
        // when pagination is not on the first/last section
      } else {
        startPage = currentPage;
        endPage = currentPage + (pageStrip - 1);
      }
    }
    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to *nFort in the pager control
    const pages = _.range(startPage, endPage + 1);

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
}
