import { Injectable } from '@angular/core';
import { ServerResponse } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { DashboardParams, DashboardData } from './../../interfaces';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

/**
 * Service to get course consumption dashboard
 *
 * It responsible to make http call
 */
@Injectable()

/**
 * @class CourseConsumptionService
 */
export class CourseConsumptionService {

  /**
   * Contains parsed snapshot data like authors and reviewers count
   */
  blockData: string[];

  /**
   * Constructor - default method of CourseConsumptionService class
   *
   * @param learnerService
   * @param dashboardUtil
   */
  constructor(private learnerService: LearnerService, private dashboardUtil: DashboardUtilsService) {
  }

  /**
   * To get course consumption data by making api call
   *
   * @param {requestParam} requestParam identifier and time period
   *
   * @return {object} api response
   */
  getDashboardData(requestParam: DashboardParams) {
    const paramOptions = {
      url: this.dashboardUtil.constructDashboardApiUrl(requestParam.data, 'COURSE_CONSUMPTION')
    };

    return this.learnerService.get(paramOptions)
      .map((data: ServerResponse) => {
        return this.parseApiResponse(data);
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  /**
   * Converts course consumption time spent count and completion count from second to min(s) or hr(s)
   *
   * @param {any} data api response
   *
   * @return {object} parsed api response
   */
  parseApiResponse(data: ServerResponse): DashboardData {
    this.blockData = [];
    _.forEach(data.result.snapshot, (numericData, key) => {
      switch (key) {
        case 'course.consumption.time_spent.count':
        case 'course.consumption.time_spent_completion_count':
          this.blockData.push(this.dashboardUtil.secondToMinConversion(numericData));
          break;
        default:
          this.blockData.push(numericData);
      }
    });

    return {
      bucketData: data.result.series,
      numericData: this.blockData,
      series: ''
    };
  }
}
