import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'autocomplete'
})
export class AutocompletePipe implements PipeTransform {
  transform(dropdownList: any[], filterObj: {}): any {
    if (dropdownList.length > 0 && filterObj) {
      const searchKey = filterObj['filterKey'].toLowerCase();
      return dropdownList.filter(x => {
        let returnVal = x.toLowerCase().includes(searchKey);

        return returnVal;
      });

    }
    return dropdownList;
  }
}