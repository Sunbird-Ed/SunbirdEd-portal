import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
// import 'moment-duration-format';
import 'dayjs/plugin/duration';
declare var require: any
/**
 * Dashboard utils service
 *
 * It contains all dashboard related common function
 */
@Injectable()

/**
 * @class DashboardUtilsService
 */
export class DashboardUtilsService {

  /**
   * Default method of DashboardUtilsService class
   */
  constructor() {
  }


  /**
   * Convert second(s) into min(s) or hr(s)
   *
   * @param {any} numericData dashboard snapshot numeric data
   */
  secondToMinConversion(numericData: any) {
    var duration = require('dayjs/plugin/duration');
    console.log('duration', duration);
    dayjs.extend(duration);    
    numericData.value = +numericData.value;
    console.log('numericData.value', numericData.value );
    const dayjsFormat: any = dayjs.duration(numericData.value, 'seconds');
    console.log('Duration_dayjsFormat', dayjsFormat );
    if (numericData.value < 60) {
      numericData.value = dayjsFormat.format('s [Second]');
      console.log('numericData.values', numericData.value );
    } else if (numericData.value >= 60 && numericData.value <= 3600) {
      numericData.value = dayjsFormat.format('m [minute]');
      console.log('numericData.valuem', numericData.value );
    } else if (numericData.value >= 3600) {
      numericData.value = dayjsFormat.format('h [Hour]');
      console.log('numericData.valueh', numericData.value );
    } else {
      return numericData;
    }
    console.log('numericData.value_else', numericData.value );
    return numericData;
  }
}
