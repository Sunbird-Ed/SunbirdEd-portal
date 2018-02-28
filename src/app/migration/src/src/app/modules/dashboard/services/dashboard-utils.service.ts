import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';
import { ConfigService } from '@sunbird/core';

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
   * Dataset types to hold course and organization api urls
   */
  datasetType: object = {};

  /**
   * Default method of DashboardUtilsService class
   */
  constructor(config: ConfigService) {
    this.datasetType = {
      'ORG_CREATION': config.urlConFig.URLS.DASHBOARD.ORG_CREATION,
      'ORG_CONSUMPTION': config.urlConFig.URLS.DASHBOARD.ORG_CONSUMPTION,
      'COURSE_PROGRESS': config.urlConFig.URLS.DASHBOARD.COURSE_PROGRESS,
      'COURSE_CONSUMPTION': config.urlConFig.URLS.DASHBOARD.COURSE_CONSUMPTION
    };
  }

  /**
   * Construct download report api url
   *
   * @param {object} data    content identifier and time period
   * @param {string} dataset dashboard type creation and consumption
   *
   * @return {string} constructed download report url
   */
  constructDownloadReportApiUrl(data, dataset: string) {
    return this.datasetType[dataset] + '/' + data.identifier + '/export?period=' +
      data.timePeriod + '&format=csv';
  }

  /**
   * Construct dashboard api url
   *
   * @param {object} data    identifier and time period
   * @param {string} dataset dashboard type creation and consumption
   *
   * @return {string} constructed dashboard api url
   */
  constructDashboardApiUrl(data, dataset: string) {
    return this.datasetType[dataset] + '/' + data.identifier + '?period=' + data.timePeriod;
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
