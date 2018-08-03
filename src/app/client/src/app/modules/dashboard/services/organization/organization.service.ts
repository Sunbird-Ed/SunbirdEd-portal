
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ServerResponse, ConfigService } from '@sunbird/shared';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
import { DashboardParams, DashboardData } from './../../interfaces';


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
   * To get api urls
   */
  public config: ConfigService;

  /**
   * Dataset types to hold course and organization api urls
   */
  datasetType: object = {};

  /**
   * Default method of OrganisationService class
   *
   * @param {LearnerService}        learnerService learner service
   * @param {DashboardUtilsService} dashboardUtil  contains dashboard helper function
   * @param {ConfigService} config To get api urls
   */
  constructor(learner: LearnerService, dashboardUtil: DashboardUtilsService, config: ConfigService) {
    this.learner = learner;
    this.dashboardUtil = dashboardUtil;
    this.contentStatus = {
      'org.creation.content[@status=published].count': ' LIVE',
      'org.creation.content[@status=draft].count': ' Created',
      'org.creation.content[@status=review].count': ' IN REVIEW'
    };
    this.datasetType = {
      'ORG_CREATION': config.urlConFig.URLS.DASHBOARD.ORG_CREATION,
      'ORG_CONSUMPTION': config.urlConFig.URLS.DASHBOARD.ORG_CONSUMPTION
    };
  }

  /**
   * To get organization creation and consumption data by making api call
   *
   * @param {DashboardParams} param identifier, time period, and dataset type
   *
   * @return {object} api response
   */
  getDashboardData(param: DashboardParams): Observable<DashboardData> {
    const paramOptions = {
      url: this.datasetType[param.dataset] + '/' + param.data.identifier,
      param: {
        period: param.data.timePeriod
      }
    };

    return this.learner.get(paramOptions).pipe(
      map((data: ServerResponse) => {
        return this.parseApiResponse(data, param.dataset);
      }),
      catchError((err) => {
        return observableThrowError(err);
      }), );
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
