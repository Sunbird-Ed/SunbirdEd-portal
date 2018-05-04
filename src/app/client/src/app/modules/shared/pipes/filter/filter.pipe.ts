import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      if (it.userName) { return it.userName.toLowerCase().includes(searchText); } else {
        return it.note.toLowerCase().includes(searchText) || it.title.toLowerCase().includes(searchText);
      }
    });
  }
}
