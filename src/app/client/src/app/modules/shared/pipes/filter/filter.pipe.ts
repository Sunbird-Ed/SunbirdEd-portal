import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchKeys: Array<string>): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    const filterItem = [];
    _.forEach(items, (value, key) => {
      _.forEach(value, (subValue, subKey) => {
        if (searchKeys.includes(subKey)) {
          if (subValue && subValue.toLowerCase().includes(searchText)) {
            filterItem.push(value);
          }
        }
      });
    });
    return _.uniq(filterItem);
  }
}
