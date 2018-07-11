import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ServerResponse, ConfigService } from '@sunbird/shared';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
import { DashboardParams } from './../../interfaces';
import { Observable } from 'rxjs';

/**
 * Service to download dashboard report
 *
 * It responsible to make http call
 */
@Injectable()

/**
 * @class DownloadService
 */
export class DownloadService {

  /**
   * Contains learner service reference
   */
  public learner: LearnerService;

  /**
   * Contains dashboard utils service reference
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
   * Default method of DownloadService class
   *
   * @param {LearnerService} learner learner service reference
   * @param {DashboardUtilsService} dashboardUtil dashboard utils service reference
   * @param {ConfigService} config To get api urls
   */
  constructor(learner: LearnerService, dashboardUtil: DashboardUtilsService, config: ConfigService) {
    this.learner = learner;
    this.dashboardUtil = dashboardUtil;
    this.config = config;
    this.datasetType = {
      'ORG_CREATION': config.urlConFig.URLS.DASHBOARD.ORG_CREATION,
      'ORG_CONSUMPTION': config.urlConFig.URLS.DASHBOARD.ORG_CONSUMPTION
    };
   }

  /**
   * Download dashboard report
   *
   * @param {DashboardParams} param download params - identifier and time period
   */
  getReport(param: DashboardParams): Observable<ServerResponse> {
    const requestBody = {
      url: this.datasetType[param.dataset] + '/' + param.data.identifier + '/export',
      param: {
        period: param.data.timePeriod,
        format: 'csv'
      }
    };
    return this.learner.get(requestBody);
  }
}
