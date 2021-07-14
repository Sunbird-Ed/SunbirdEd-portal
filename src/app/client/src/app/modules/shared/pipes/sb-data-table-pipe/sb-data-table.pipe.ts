import {Pipe, PipeTransform} from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'sbDataTable'
})
export class SbDataTablePipe implements PipeTransform {

  constructor() {

  }

  transform(value, type) {
    if (!value) {
      return '';
    }
    if (!type) {
      return value;
    }
    if (type === 'date') {
      return dayjs(value).format('DD-MMM-YYYY');
    } else if (type === 'dateTime') {
      return dayjs(value).format('DD-MMM-YYYY HH:mm');
    } else {
      return '-';
    }
  }

}
