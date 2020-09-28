import {Pipe, PipeTransform} from '@angular/core';
import * as dayjs from 'dayjs';
import {TitleCasePipe} from '@angular/common';

@Pipe({
  name: 'sbDataTable'
})
export class SbDataTablePipe implements PipeTransform {

  constructor(private titlecasePipe: TitleCasePipe) {

  }

  transform(value, type) {
    if (!value) {
      return ''
    }
    if (!type) {
      return value || '';
    }
    if (type === 'date') {
      return dayjs(value).format('DD-MMM-YYYY');
    } else {
      return '-';
    }
  }

}
