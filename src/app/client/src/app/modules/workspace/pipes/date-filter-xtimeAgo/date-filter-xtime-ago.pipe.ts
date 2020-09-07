import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';
import * as relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

/**
 * Pipe for date format
 */
@Pipe({
  name: 'fromNow'
})
export class DateFilterXtimeAgoPipe implements PipeTransform {
  /**
   * To create date format pipe
   * @param {Date} value current Date, string or number
   * @param {string} format format of Date
   */
  transform(value: Date | string | number, format: string): string {
      const local = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      if (dayjs(local).isValid()) {
        return dayjs(local).fromNow();
      } else {
        return 'Invalid date';
      }
  }
}
