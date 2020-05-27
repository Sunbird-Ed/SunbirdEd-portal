import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

/**
 * Pipe for date format
 *
 */
@Pipe({
  name: 'fromNow'
})
export class DateFilterXtimeAgoPipe implements PipeTransform {
  /**
   * To create date format pipe
   *
   * @param {Date} value current Date, string or number
   * @param {string} format format of Date
   *
   */
  transform(value: Date | moment.Moment | string | number, format: string): string {
      const local = moment(value).local().format('YYYY-MM-DD HH:mm:ss');
      return moment(local).fromNow();
  }

}
