import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

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
  transform(value: Date | moment.Moment | string | number, format: string): string {
    if (value) {
      const date = new Date(value.toString()).setHours(0, 0, 0, 0);
      return momentConstructor(value).format(format || 'Do MMMM YYYY');
    } else {
      return momentConstructor(value).format(format || 'Do MMMM YYYY');
    }
  }

}
