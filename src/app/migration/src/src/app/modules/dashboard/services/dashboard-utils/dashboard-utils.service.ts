import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

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
    numericData.value = +numericData.value;
    if (numericData.value < 60) {
      numericData.value = moment.duration(numericData.value, 'seconds').format('s [Second]');
    } else if (numericData.value >= 60 && numericData.value <= 3600) {
      numericData.value = moment.duration(numericData.value, 'seconds').format('m [minute]');
    } else if (numericData.value >= 3600) {
      numericData.value = moment.duration(numericData.value, 'seconds').format('h [Hour]');
    } else {
      return numericData;
    }

    return numericData;
  }
}
