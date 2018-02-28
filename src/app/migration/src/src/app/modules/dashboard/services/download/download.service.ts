import { Injectable } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { DashboardUtilsService } from './../dashboard-utils.service';
import { Dashboard } from './../../index';

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
   * Default method of DownloadService class
   *
   * @param learnerService
   * @param dashboardUtil
   */
  constructor(private learnerService: LearnerService, private dashboardUtil: DashboardUtilsService) { }

  /**
   * Download dashboard report
   *
   * @param {object} requestParam identifier and time period
   */
  getReport(requestParam: Dashboard) {
    const requestBody = {
      url: this.dashboardUtil.constructDownloadReportApiUrl(requestParam.data, requestParam.dataset)
    };

    return this.learnerService.get(requestBody);
  }
}
