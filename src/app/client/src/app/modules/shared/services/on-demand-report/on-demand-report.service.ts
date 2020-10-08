import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from '../config/config.service';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OnDemandReportService {
  constructor(public http: HttpClient, public config: ConfigService) {
    this.http = http;
  }

  /**
   * function to fetch report list from data set server
   * @param tag combination of collection and batch id
   */
  getReportList(tag: string) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.get(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.DATASET_LIST + '/' + tag, options);
  }

  /**
   * function to get report details based on tag and request id
   * @param tag combination of collection and batch id
   * @param requestId id of dataset to get report
   */
  getReport(tag: string, requestId: string) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.get(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.DATASET_REQUEST_READ + '/' + `${tag}?requestId=${requestId}`, options);
  }

  /**
   * function to submit request for generation of report
   * @param request
   */
  submitRequest(request: any) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.post(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.DATASET_SUBMIT_REQUEST, request, options);
  }

  /**
   * function to get summary reports data
   * @param request
   */
  getSummeryReports(request: any) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.post(this.config.urlConFig.URLS.REPORT_PREFIX + '/v1' + this.config.urlConFig.URLS.REPORT.COLLECTION + this.config.urlConFig.URLS.REPORT.SUMMARY.PREFIX, request, options);
  }

  /**
   * check if report is in progress on not
   * @param reportListData
   * @param reportStatus
   */
  isInProgress(reportListData: any, reportStatus: any) {
    const reportListDataStatus = _.toLower(reportListData['status']);
    const reportSubmitted = _.toLower(reportStatus.submitted)
    const reportProcessing = _.toLower(reportStatus.processing)
    if ((reportListDataStatus === reportSubmitted) || (reportListDataStatus === reportProcessing)) {
      return true;
    }
    return false;
  }

  /**
   * checks if user can request for generation of reports
   * @param submittedDate
   * @param batchEndDate
   */
  canRequestReport(submittedDate: any, batchEndDate: any) {
    if (batchEndDate && (submittedDate > batchEndDate)) {
      return false;
    }
    return true;
  }
}

