import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

/**
 * Pipe for date format
 *
 */
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  /**
   * To create date format pipe
   *
   * @param {Date} value current Date, string or number
   * @param {string} format format of Date
   *
   */
  transform(value: Date | string | number, format: string): string {
    if (value) {
      return dayjs(value).format(format || 'DD MMMM YYYY'); // TODO: NEED to be tested
    } else {
      return '-';
    }
  }

}
