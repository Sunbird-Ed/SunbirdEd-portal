import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { DashboardUtilsService } from './../dashboard-utils.service';
import { DashboardParams } from './../../interfaces';
import { ServerResponse } from '@sunbird/shared';

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
   * Default method of DownloadService class
   *
   * @param {LearnerService} learner learner service reference
   * @param {DashboardUtilsService} dashboardUtil dashboard utils service reference
   */
  constructor(learner: LearnerService, dashboardUtil: DashboardUtilsService) {
    this.learner = learner;
    this.dashboardUtil = dashboardUtil;
   }

  /**
   * Download dashboard report
   *
   * @param {object} requestParam identifier and time period
   */
  getReport(requestParam: DashboardParams) {
    const requestBody = {
      url: this.dashboardUtil.constructDownloadReportApiUrl(requestParam.data, requestParam.dataset)
    };

    return this.learner.get(requestBody);
  }
}
