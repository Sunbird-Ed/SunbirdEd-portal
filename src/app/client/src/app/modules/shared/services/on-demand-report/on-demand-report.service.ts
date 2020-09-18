import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class OnDemandReportService {
  constructor(public http: HttpClient, public config: ConfigService) {
    this.http = http;
  }
  getReportList(tag: string) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.get(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.JOB_LIST + '/' + tag, options);
  }
  getReport(tag: string, requestId: string) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.get(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.JOB_REQUEST_READ + '/' + `${tag}/${requestId}`, options);
  }
  submitRequest(request: any) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.post(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.JOB_SUBMIT_REQUEST, request, options);
  }
  getSummeryReports(request: any) {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.http.post(this.config.urlConFig.URLS.REPORT_PREFIX + this.config.urlConFig.URLS.REPORT.COLLECTION + this.config.urlConFig.URLS.REPORT.SUMMARY.PREFIX, request, options);
  }

}