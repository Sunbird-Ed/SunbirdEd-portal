import {Pipe, PipeTransform} from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'sbDataTable'
})
export class SbDataTablePipe implements PipeTransform {

  constructor() {

  }

  /**
   * @param value - cell value
   * @param type - optional format type ('date'|'dateTime')
   * @param fallback - optional fallback string to display when value is null/empty
   */
  transform(value: any, type?: string, fallback: string = '') {
    // Treat empty strings, null and undefined as missing values
    if (value === null || value === undefined || value === '') {
      return fallback;
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
