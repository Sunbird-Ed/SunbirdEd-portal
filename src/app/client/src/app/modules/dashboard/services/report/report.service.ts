import { IListReportsFilter, IReportsApiResponse, IDataSource } from './../../interfaces';
import { ConfigService, IUserData } from '@sunbird/shared';
import { UserService, BaseReportService, PermissionService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UsageService } from '../usage/usage.service';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Observable, of, forkJoin, throwError } from 'rxjs';

@Injectable()
export class ReportService {

  constructor(private sanitizer: DomSanitizer, private usageService: UsageService, private userService: UserService,
    private configService: ConfigService, private baseReportService: BaseReportService, private permissionService: PermissionService) { }

  public fetchDataSource(filePath: string, id?: string | number): Observable<any> {
    return this.usageService.getData(filePath).pipe(
      map(configData => {
        return {
          result: _.get(configData, 'result'),
          ...(id && { id })
        };
      })
    );
  }

  public downloadMultipleDataSources(dataSources: IDataSource[]) {
    const apiCalls = _.map(dataSources, (source: IDataSource) => {
      return this.fetchDataSource(_.get(source, 'path'), _.get(source, 'id'));
    });
    return forkJoin(...apiCalls).pipe(
      catchError(err => {
        if (err.status === 404) {
          return throwError({ messageText: 'messages.stmsg.reportNotReady' });
        }
        return throwError(err);
      })
    );
  }

  public fetchReportById(id): Observable<IReportsApiResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.REPORT.READ}/${id}`
    };
    return this.baseReportService.get(req).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
  }

  public publishReport(reportId: string) {
    return this.updateReport(reportId, { status: 'live' });
  }

  public listAllReports(filters: IListReportsFilter = {}): Observable<IReportsApiResponse> {
    const request = {
      url: this.configService.urlConFig.URLS.REPORT.LIST,
      data: {
        'request': {
          'filters': filters
        }
      }
    };
    return this.baseReportService.post(request).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
  }

  /**
   * @description api call to update an existing report
   * @param reportId
   * @param body
   */
  public updateReport(reportId: string, body: object): Observable<any> {
    const request = {
      url: `${this.configService.urlConFig.URLS.REPORT.UPDATE}/${reportId}`,
      data: {
        'request': {
          'report': body
        }
      }
    };
    return this.baseReportService.patch(request).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
  }

  /**
   * @description adds a report and chart level summary to add existing report
   * @param body
   */
  public addSummary(body: object): Observable<any> {
    const request = {
      url: `${this.configService.urlConFig.URLS.REPORT.SUMMARY.CREATE}`,
      data: {
        'request': {
          'summary': body
        }
      }
    };
    return this.baseReportService.post(request).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
  }

  public prepareChartData(chartsArray: Array<any>, data: { result: any, id: string }[], downloadUrl: IDataSource[],
    reportLevelDataSourceId: string): Array<{}> {
    return _.map(chartsArray, chart => {
      const chartObj: any = {};
      chartObj.chartConfig = chart;
      chartObj.downloadUrl = downloadUrl;
      chartObj.chartData = _.get(chart, 'dataSource') ? this.getChartData(data, chart) :
        _.get(this.getDataSourceById(data, reportLevelDataSourceId || 'default'), 'data');
      chartObj.lastUpdatedOn = _.get(data, 'metadata.lastUpdatedOn');
      return chartObj;
    });
  }

  public prepareTableData(tablesArray: any, data: any, downloadUrl: string, reportLevelDataSourceId: string): Array<{}> {
    tablesArray = _.isArray(tablesArray) ? tablesArray : [tablesArray];
    return _.map(tablesArray, table => {
      const tableData: any = {};
      tableData.id = _.get(table, 'id') || `table-${_.random(1000)}`;
      tableData.name = _.get(table, 'name') || 'Table';
      tableData.header = _.get(table, 'columns') || _.get(this.getDataSourceById(data, reportLevelDataSourceId || 'default'),
        _.get(table, 'columnsExpr'));
      tableData.data = _.get(table, 'values') || _.get(this.getDataSourceById(data, reportLevelDataSourceId || 'default'),
        _.get(table, 'valuesExpr'));
      tableData.downloadUrl = _.get(table, 'downloadUrl') || downloadUrl;
      return tableData;
    });
  }

  private getChartData = (data: { result: any, id: string }[], chart: any) => {
    const chartDataSource = _.get(chart, 'dataSource');

    if (chartDataSource.ids.length === 1) {
      return _.get(this.getDataSourceById(data, _.head(chartDataSource.ids)), 'data');
    }
    // overlay if multiple dataSources present
    const datasources = _.map(chartDataSource.ids, id => {
      return _.get(this.getDataSourceById(data, id), 'data');
    });

    const result = this.overlayMultipleDataSources(datasources as Array<any[]>, _.get(chartDataSource, 'commonDimension'));
    return result;
  }

  private getDataSourceById(dataSources: { result: any, id: string }[], id: string = 'default') {
    return _.get(_.find(dataSources, ['id', id]), 'result');
  }

  /**
   * @description Overlays multiple datasource with common dimension.
   * @template T
   * @template U
   * @param {(T[])[]} dataSources
   * @param {U} commonDimension
   * @returns
   * @memberof ReportService
   */
  public overlayMultipleDataSources<T, U extends keyof T>(dataSources: (T[])[], commonDimension: U) {
    return _.values(_.merge(..._.map(dataSources, dataSource => _.keyBy(dataSource, commonDimension))));
  }

  /**
   * @description downloads a csv file from blob storage
   * @param {string} filePathSource
   * @returns
   * @memberof ReportService
   */
  public downloadReport(filePathSource: string) {
    return this.fetchDataSource(filePathSource).pipe(
      map(response => _.get(response, 'result.signedUrl'))
    );
  }

  /**
   * @description returns true or false based on authentication of roles
   * @param {(string | undefined)} roles
   * @returns {Observable<boolean>}
   * @memberof ReportService
   */
  public isAuthenticated(roles: string | undefined): Observable<boolean> {

    return this.userService.userData$.pipe(
      map((user: IUserData) => {
        if (user && !user.err) {
          const allowedRoles = this.configService.rolesConfig.ROLES[roles];
          const userRoles = user.userProfile.userRoles;
          return _.intersection(allowedRoles, userRoles).length;
        } else {
          return false;
        }
      }),
      catchError(err => of(false))
    );
  }

  /**
 * @description checks whether user is an REPORT ADMIN or not
 */
  public isUserReportAdmin(): boolean {
    if (this.userService.userProfile) {
      return _.includes(_.get(this.userService, 'userProfile.userRoles'), 'REPORT_ADMIN');
    }
    return false;
  }

  public transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }

  /**
   * @description calls the api to add report and chart level summary
   */
  addReportSummary({ reportId, summaryDetails }): Observable<any> {
    const type = _.get(summaryDetails, 'type');
    const reqBody = {
      reportid: reportId,
      createdby: this.userService.userid,
      summary: summaryDetails.summary,
      ...(type === 'chart' && { chartid: summaryDetails.chartId })
    };
    return this.addSummary(reqBody);
  }

  /**
   * @description calls the API to fetch latest report and chart level summary
   */
  public getLatestSummary({ reportId, chartId = null }): Observable<any> {
    const url = `${this.configService.urlConFig.URLS.REPORT.SUMMARY.PREFIX}/${reportId}`;
    const req = {
      url: chartId ? `${url}/${chartId}` : url
    };
    return this.baseReportService.get(req).pipe(
      map(apiResponse => _.get(apiResponse, 'result.summaries')),
      catchError(err => of([]))
    );
  }

}
