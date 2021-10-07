import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'autocomplete'
})
export class AutocompletePipe implements PipeTransform {
  transform(dropdownList: any[], filterObj: any): any {
    if (dropdownList.length > 0 && filterObj) {
      const filterStringLower = filterObj.filterKey.toLowerCase();
      return dropdownList.filter(x => {
        let returnVal = x.toLowerCase().includes(filterStringLower);

        return returnVal;
      });

    }
    return dropdownList;
  }
}