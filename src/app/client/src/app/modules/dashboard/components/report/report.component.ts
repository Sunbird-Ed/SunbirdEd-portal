import { IImpressionEventInput } from '@sunbird/telemetry';
import { INoResultMessage, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services';
import * as _ from 'lodash-es';
import { Observable, throwError, of, empty } from 'rxjs';
import { mergeMap, tap, switchMap, map, retry, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public report: any;
  public report$;
  public noResultMessage: INoResultMessage;
  public noResult: boolean;
  private downloadUrl: string;
  telemetryImpression: IImpressionEventInput;

  constructor(private reportService: ReportService, private userService: UserService, private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService, private toasterService: ToasterService, private navigationhelperService: NavigationHelperService,
    private router: Router) { }

  ngOnInit() {
    this.report$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        this.noResult = false;
        return this.renderReport(_.get(params, 'reportId')).pipe(
          catchError(err => {
            this.noResultMessage = {
              'messageText': 'messages.stmsg.m0131'
            };
            this.noResult = true;
            return of({});
          })
        )
      })
    )
  }

  private fetchConfig(reportId): Observable<any> {
    const reportsLocationHtmlElement = (<HTMLInputElement>document.getElementById('reportsLocation'));
    const reportsLocation = reportsLocationHtmlElement ? _.get(reportsLocationHtmlElement, 'value') : 'reports';
    const slug = _.get(this.userService, 'userProfile.rootOrg.slug');
    return this.reportService.fetchDataSource(`/${reportsLocation}/${slug}/config.json`).pipe(
      mergeMap(config => {
        const report = _.find(config, ['id', reportId]);
        return report ? of(report) : throwError('No config found');
      })
    )
  }

  private renderReport(reportId) {
    return this.fetchConfig(reportId).pipe(
      switchMap(report => {
        this.report = report;
        this.setDownloadUrl(_.get(report, 'downloadUrl'));
        return this.reportService.fetchDataSource(_.get(report, 'dataSource')).pipe(
          retry(1),
          map(data => {
            const charts = _.get(report, 'charts'), tables = _.get(report, 'table');
            let result: any = {};
            result['charts'] = (charts && this.reportService.prepareChartData(charts, data, _.get(report, 'dataSource'))) || [];
            result['tables'] = (tables && this.reportService.prepareTableData(tables, data, _.get(report, 'downloadUrl'))) || [];
            result['reportMetaData'] = report;
            return result;
          })
        )
      })
    )
  }

  public downloadCSV(downloadUrl?: string) {
    this.reportService.downloadReport(this.downloadUrl).subscribe(
      result => {
        window.open(result, '_blank');
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0076);
      }
    )
  }

  public setDownloadUrl(url) {
    this.downloadUrl = url;
  }

  public setTelemetryInteractObject(val) {
    return {
      id: val,
      type: 'Report',
      ver: '1.0'
    };
  }

  public setTelemetryInteractEdata(val) {
    return {
      id: val,
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: {
          id: this.userService.userid,
          type: 'user',
          ver: '1.0'
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }
}
