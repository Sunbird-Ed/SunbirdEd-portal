import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { DashboardUtilsService } from './../dashboard-utils.service';
import { DashboardParams, DashboardData } from './../../interfaces';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

/**
 * Service to get organization admin dashboard data
 *
 * It responsible to make http call
 */
@Injectable()

/**
 * @class OrganisationService
 */
export class OrganisationService {

  /**
   * Contains content status
   *
   * Used to construct readable graph legend
   */
  contentStatus: object = {};

  /**
   * Contains graph series data
   */
  graphSeries: string[];

  /**
   * Contains parsed snapshot data
   *
   * Snapshot data - authors and reviewers count
   */
  blockData: string[];

  /**
   * Contains learner service reference
   */
  public learner: LearnerService;

  /**
   * Dashboard helper service reference
   */
  public dashboardUtil: DashboardUtilsService;

  /**
   * Default method of OrganisationService class
   *
   * @param {LearnerService}        learnerService learner service
   * @param {DashboardUtilsService} dashboardUtil  contains dashboard helper function
   */
  constructor(learner: LearnerService, dashboardUtil: DashboardUtilsService) {
    this.learner = learner;
    this.dashboardUtil = dashboardUtil;
    this.contentStatus = {
      'org.creation.content[@status=published].count': ' LIVE',
      'org.creation.content[@status=draft].count': ' Created',
      'org.creation.content[@status=review].count': ' IN REVIEW'
    };
  }

  /**
   * To get organization creation and consumption data by making api call
   *
   * @param {object} requestParam identifier, time period, and dataset type
   *
   * @return {object} api response
   */
  getDashboardData(requestParam: DashboardParams) {
    const paramOptions = {
      url: this.dashboardUtil.constructDashboardApiUrl(requestParam.data, requestParam.dataset)
    };

    return this.learner.get(paramOptions)
      .map((data: ServerResponse) => {
        if (data && data.responseCode === 'OK') {
          return this.parseApiResponse(data, requestParam.dataset);
        } else {
          return Observable.throw(data);
        }
      })
      .catch((err) => {
        return Observable.throw(err);
      });
  }

  /**
   * Converts org consumption time-spent count and completion count from second to min(s) or hr(s)
   *
   * @param {any}    data    identifier and time period
   * @param {string} dataset dataset type creation, consumption
   *
   * @return {object} api response
   */
  parseApiResponse(data: ServerResponse, dataset: string): DashboardData {
    this.graphSeries = [];
    this.blockData = [];

    _.forEach(data.result.snapshot, (numericData, key) => {
      switch (key) {
        case 'org.creation.authors.count':
        case 'org.creation.reviewers.count':
        case 'org.creation.content.count':
          this.blockData.push(numericData);
          break;
        case 'org.consumption.content.time_spent.sum':
        case 'org.consumption.content.time_spent.average':
          this.blockData.push(this.dashboardUtil.secondToMinConversion(numericData));
          break;
        default:
          if (dataset === 'ORG_CREATION') {
            this.graphSeries.push(numericData.value + this.contentStatus[key]);
          } else {
            this.blockData.push(numericData);
          }
      }
    });

    if (dataset === 'ORG_CREATION') {
      return {
        bucketData: data.result.series, numericData: this.blockData, series: this.graphSeries,
        name: data.result.period === '5w' ? 'Content created per week' : 'Content created per day',
      };
    } else {
      return { bucketData: data.result.series, numericData: this.blockData, series: '' };
    }
  }
}
