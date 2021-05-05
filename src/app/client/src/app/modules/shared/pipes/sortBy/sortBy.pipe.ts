/**
 * @file
 * Generic sort pipe for `Array` and `Array of objects`
 * @since release-2.10.0
 * @version 1.0
 */

import { Pipe, PipeTransform } from '@angular/core';
import { orderBy, get, toLower, trim } from 'lodash-es';

@Pipe({
  name: 'sortBy'
})

export class SortByPipe implements PipeTransform {
  /**
   * @param  {Array} data       - Array to be sorted
   * @param  {String} sortField - Object key to apply sort (Required only for array of objects)
   * @param  {String} sortOrder - Accepts `asc` ascending / `desc` descending
   * @returns Sorted array
   * @description Function to sort array based on sorting order and sorting field
   */
  transform(data: any[], sortField: string, sortOrder: string): any[] {
    if (!data || !data.length || sortOrder === '' || !sortOrder) { return data; }
    if (!sortField || sortField === '') {
      data = data.map(e => e.trim());
      if (sortOrder === 'asc') {
        return data.sort();
      } else {
        return data.sort().reverse();
      }
    }
    return orderBy(data, val => toLower(trim(get(val, [sortField]))), [sortOrder]);
  }
}
