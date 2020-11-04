import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchKeys: Array<string>): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    if(searchKeys && searchKeys.length !== 0){
      const filterItem = [];
      _.forEach(items, (item) => {
        _.forEach(item, (subValue, subKey) => {
          if (searchKeys.includes(subKey) && subValue && subValue.toLowerCase().includes(searchText)) {
            filterItem.push(item);
          }
        });
      });
      return _.uniq(filterItem);
    }else{
      return items.filter(function(item){
        return JSON.stringify(item).toLowerCase().includes(searchText);
    });
    }

  }
}
