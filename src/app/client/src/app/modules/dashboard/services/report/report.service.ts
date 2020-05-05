import { IListReportsFilter, IReportsApiResponse, IDataSource } from './../../interfaces';
import { ConfigService, IUserData } from '@sunbird/shared';
import { UserService, BaseReportService, PermissionService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UsageService } from '../usage/usage.service';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Observable, of, forkJoin } from 'rxjs';

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
        }
      })
    );
  }

  public downloadMultipleDataSources(dataSources: IDataSource[]) {
    const apiCalls = _.map(dataSources, (source: IDataSource) => {
      return this.fetchDataSource(_.get(source, 'path'), _.get(source, 'id'));
    });
    return forkJoin(...apiCalls);
  }

  public overlayMultipleDataSources() {
    //todo
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

  public prepareChartData(chartsArray: Array<any>, data: any, downloadUrl: IDataSource[], reportLevelDataSourceId: string): Array<{}> {
    return _.map(chartsArray, chart => {
      const chartObj: any = {};
      chartObj.chartConfig = chart;
      chartObj.downloadUrl = downloadUrl;
      chartObj.chartData = _.get(this.getDataSourceById(data, _.head(_.get(chart, 'dataSource.ids')) || reportLevelDataSourceId || 'default'), 'data');
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
      tableData.header = _.get(table, 'columns') || _.get(this.getDataSourceById(data, reportLevelDataSourceId || 'default'), _.get(table, 'columnsExpr'));
      tableData.data = _.get(table, 'values') || _.get(this.getDataSourceById(data, reportLevelDataSourceId || 'default'), _.get(table, 'valuesExpr'));
      tableData.downloadUrl = _.get(table, 'downloadUrl') || downloadUrl;
      return tableData;
    });
  }

  private getDataSourceById(dataSources: { result: any, id: string }[], id: string = 'default') {
    return _.get(_.find(dataSources, ['id', id]), 'result');
  }

  public downloadReport(filePathSource) {
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
    return this.permissionService.permissionAvailable$.pipe(
      map(permissionAvailable => {
        if (permissionAvailable && permissionAvailable === 'success') {
          const userRoles = this.configService.rolesConfig.ROLES[roles];
          if (roles && userRoles) {
            if (this.permissionService.checkRolesPermissions(userRoles)) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
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

  addReportSummary({ reportId, summaryDetails }): Observable<any> {
    const type = _.get(summaryDetails, 'type');
    const reqBody = {
      reportid: reportId,
      createdby: this.userService.userid,
      summary: summaryDetails.summary,
      ...(type === 'chart' && { chartid: summaryDetails.chartId })
    }
    return this.addSummary(reqBody);
  }

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
