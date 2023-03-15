import { ProfileService } from '@sunbird/profile';
import { CourseProgressService } from './../course-progress/course-progress.service';
import { IListReportsFilter, IReportsApiResponse, IDataSource } from './../../interfaces';
import { ConfigService, IUserData } from '@sunbird/shared';
import { UserService, BaseReportService, PermissionService, SearchService, FrameworkService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UsageService } from '../usage/usage.service';
import { map, catchError, pluck, mergeMap, shareReplay } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Observable, of, forkJoin } from 'rxjs';
import  dayjs from 'dayjs';
import { v4 as UUID } from 'uuid';

const PRE_DEFINED_PARAMETERS = ['$slug', '$board', '$state', '$channel'];


@Injectable({
  providedIn:'root'
})
export class ReportService  {

  private _superAdminSlug: string;

  private cachedMapping = {};

  constructor(private sanitizer: DomSanitizer, private usageService: UsageService, private userService: UserService,
    private configService: ConfigService, private baseReportService: BaseReportService, private permissionService: PermissionService,
    private courseProgressService: CourseProgressService, private searchService: SearchService,
    private frameworkService: FrameworkService, private profileService: ProfileService ) {
    try {
      this._superAdminSlug = (<HTMLInputElement>document.getElementById('superAdminSlug')).value;
    } catch (error) {
      this._superAdminSlug = 'sunbird';
    }
  }

  public fetchDataSource(filePath: string, id?: string | number): Observable<any> {
    return this.usageService.getData(filePath).pipe(
      map(configData => {
        return {
          loaded: true,
          result: _.get(configData, 'result'),
          ...(id && { id })
        };
      })
      , catchError(error => of({ loaded: false }))

    );
  }

  public downloadMultipleDataSources(dataSources: IDataSource[]) {
    if (!dataSources.length) {
      // for India heat map scenario.
      return of([]);
    }
    const apiCalls = _.map(dataSources, (source: IDataSource) => {
      return this.fetchDataSource(_.get(source, 'path'), _.get(source, 'id'));
    });
    return forkJoin(...apiCalls).pipe(
      mergeMap(response => {

        response = response.filter(function(item) { if (item ) { return item.loaded = true; } });
        return this.getFileMetaData(dataSources).pipe(
          map(metadata => {
            return _.map(response, res => {
              res.lastModifiedOn = _.get(metadata[res.id], 'lastModified');
              return res;
            });
          })
        );
      })
    );
  }

  public fetchReportById(id, hash?: string): Observable<IReportsApiResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.REPORT.READ}/${id}`
    };
    if (hash) {
      req.url = `${this.configService.urlConFig.URLS.REPORT.READ}/${id}/${hash}`;
    }
    return this.baseReportService.get(req).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
  }

  /**
   * @description publishes a report as live
   * @param {string} reportId
   * @returns
   * @memberof ReportService
   */
  public publishReport(reportId: string, hash?: string) {
    const req = {
      url: `${this.configService.urlConFig.URLS.REPORT.PUBLISH}/${reportId}`
    };
    if (hash) {
      req.url = `${this.configService.urlConFig.URLS.REPORT.PUBLISH}/${reportId}/${hash}`;
    }
    return this.baseReportService.get(req).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
  }

  /**
   * @description retires a report and deactivates all jobs associated with this report. 
   * @param {string} reportId
   * @returns
   * @memberof ReportService
   */
  public retireReport(reportId: string, hash?: string) {
    const req = {
      url: `${this.configService.urlConFig.URLS.REPORT.RETIRE}/${reportId}`
    };
    if (hash) {
      req.url = `${this.configService.urlConFig.URLS.REPORT.RETIRE}/${reportId}/${hash}`;
    }
    return this.baseReportService.get(req).pipe(
      map(apiResponse => _.get(apiResponse, 'result'))
    );
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
   * @description adds a report and chart level summary to an existing report
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

  public prepareChartData(chartsArray: Array<any>, data: { result: any, id: string, lastModifiedOn: undefined | string }[],
    downloadUrl: IDataSource[], reportLevelDataSourceId: string): Array<{}> {
    return _.map(chartsArray, chart => {
      const { chartType, dataSource = null, mapData = {} } = chart;
      const chartObj: any = {};
      chartObj.chartConfig = chart;
      if (!chartObj.chartConfig['id']) {
        chartObj.chartConfig['id']  = UUID();
      }
      chartObj.downloadUrl = downloadUrl;
      chartObj.chartData = dataSource ? this.getChartData(data, chart) :
        _.get(this.getDataSourceById(data, reportLevelDataSourceId || 'default'), 'data');
        if(chartObj.chartConfig.id === 'Big_Number' && chartObj.chartData  === undefined){
          chartObj.chartData = [0];
        }
      chartObj.lastUpdatedOn = _.get(data, 'metadata.lastUpdatedOn') ||
        this.getLatestLastModifiedOnDate(data, dataSource || { ids: [reportLevelDataSourceId || 'default'] });
      if (chartType && _.toLower(chartType) === 'map') {
        chartObj.mapData = {
          ...mapData,
          reportData: chartObj.chartData
        };
      }
      if (chartObj && chartObj.chartData && chartObj.chartData.length > 0) {
        return chartObj;
      }
    }).filter(function(chartData) {
       if (chartData ) {
          return (chartData['chartData'] != null || chartData['chartData'] != undefined);
        }
      });
  }

  public prepareTableData(tablesArray: any, data: any, downloadUrl: string, hash?: string): Array<{}> {
    tablesArray = _.isArray(tablesArray) ? tablesArray : [tablesArray];
    return _.map(tablesArray, table => {
      const tableId = _.get(table, 'id') || `table-${_.random(1000)}`;
      const dataset = this.getTableData(data, _.get(table, 'id'));
      const tableData: any = {};
      tableData.id = tableId;
      tableData.name = _.get(table, 'name') || 'Table';
      tableData.config = _.get(table, 'config') ||  false;
      if (!tableData.config) {
        tableData.data = _.get(table, 'values') || _.get(dataset, _.get(table, 'valuesExpr'));
      } else {
        tableData.data = dataset.data;
      }
      tableData.header = _.get(table, 'columns') || _.get(dataset, _.get(table, 'columnsExpr'));
      tableData.downloadUrl = this.resolveParameterizedPath(_.get(table, 'downloadUrl') || downloadUrl,
        hash ? this.getParameterFromHash(hash) : null);
      return tableData;

    });
  }

  public getParameterizedFiles(files: { downloadUrl: string }[], hash?: string) {
    return files.map(file => ({
      ...file,
      downloadUrl: this.resolveParameterizedPath(file.downloadUrl, hash ? this.getParameterFromHash(hash) : null)
    }));
  }

  private getTableData(data: { result: any, id: string }[], tableId) {
    if (data.length === 1) {
      const [dataSource] = data;
      if (dataSource.id === 'default') {
        return dataSource.result;
      }
    }
    return this.getDataSourceById(data, tableId) || {};
  }

  getChartData = (data: { result: any, id: string }[], chart: any) => {
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

  public getLatestLastModifiedOnDate(data: { result: any, id: string, lastModifiedOn: undefined | string }[],
    dataSourceIds?: { ids: string[] }) {
    let queryObj = data;
    if (dataSourceIds) {
      queryObj = _.filter(data, obj => _.includes(dataSourceIds.ids, obj.id));
    }
    return Date.parse(_.get(_.maxBy(queryObj, val => Date.parse(val.lastModifiedOn)), 'lastModifiedOn'));
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
    return _.flatten(dataSources);
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

  public isUserSuperAdmin(): boolean {
    if (!this.isUserReportAdmin()) { return false; }
    return _.get(this.userService, 'userProfile.rootOrg.slug') === this._superAdminSlug;
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
      ...(summaryDetails.hash && { param_hash: summaryDetails.hash }),
      ...(type === 'chart' && { chartid: summaryDetails.chartId })
    };
    return this.addSummary(reqBody);
  }

  /**
 * @description - fetches the report metadata from the blob
 * to enable backward compatibilty taking filenames from the last
 * @example because some reports use /reports/:slug/:filename
 * @example while some other reports use /reports/fetch/:slug/:filename
 * @param {IDataSource[]} dataSources
 * @returns
 * @memberof ReportService
 */
  public getFileMetaData(dataSources: IDataSource[]): Observable<any> {

    const mappedfileIdWithPath = _.mapValues(_.keyBy(dataSources, 'id'), 'path');
    _.forIn(mappedfileIdWithPath, (val, key, object) => {
      object[key] = _.join(_.slice(_.split(val, '/'), -2), '/');
    });

    const requestParams = {
      params: {
        fileNames: JSON.stringify(mappedfileIdWithPath)
      }
    };

    return this.courseProgressService.getReportsMetaData(requestParams)
      .pipe(
        pluck('result'),
        catchError(err => of({}))
      );
  }

  public getFormattedDate(dateString) {
    return dayjs(dateString).format('DD-MMMM-YYYY');
  }

  /**
   * @description calls the API to fetch latest report and chart level summary
   */
  public getLatestSummary({ reportId, chartId = null, hash = null }): Observable<any> {
    const url = `${this.configService.urlConFig.URLS.REPORT.SUMMARY.PREFIX}/${reportId}`;
    const req = {
      url: chartId ? `${url}/${chartId}` : url
    };
    if (hash) { req.url = `${req.url}?hash=${hash}`; }
    return this.baseReportService.get(req).pipe(
      map(apiResponse => _.get(apiResponse, 'result.summaries')),
      catchError(err => of([]))
    );
  }


  public getParameterValues(parameter: string): { value: string, masterData: () => Observable<string[]> } {
    const parameterMappings = {
      $slug: {
        value: _.get(this.userService, 'userProfile.rootOrg.slug'),
        masterData: () => {
          if (!this.cachedMapping.hasOwnProperty('$slug')) {
            const req = {
              filters: { isRootOrg: true, status: 1 },
              fields: ['id', 'channel', 'slug', 'orgName'],
              pageNumber: 1,
              limit: 10000
            };
            this.cachedMapping['$slug'] = this.searchService.orgSearch(req).pipe(
              map(res => _.map(_.get(res, 'result.response.content'), 'slug')),
              shareReplay(1)
            );
          }
          return this.cachedMapping['$slug'];
        }
      },
      $board: {
        value: _.get(this.userService, 'userProfile.framework.board[0]'),
        masterData: () => {
          if (!this.cachedMapping.hasOwnProperty('$board')) {
            this.cachedMapping['$board'] = this.frameworkService.getChannel(_.get(this.userService, 'hashTagId'))
              .pipe(
                mergeMap(channel => this.frameworkService.getFrameworkCategories(_.get(channel, 'result.channel.defaultFramework'))
                  .pipe(
                    map(framework => {
                      const frameworkData = _.get(framework, 'result.framework');
                      const boardCategory = _.find(frameworkData.categories, ['code', 'board']);
                      if (!boardCategory) { return of([]); }
                      return _.map(boardCategory.terms, 'name');
                    }),
                    shareReplay(1),
                  )),
                catchError(err => of([]))
              );
          }
          return this.cachedMapping['$board'];
        }
      },
      $state: {
        value: _.get(_.find(_.get(this.userService, 'userProfile.userLocations'), ['type', 'state']), 'name'),
        masterData: () => {
          if (!this.cachedMapping.hasOwnProperty('$state')) {
            const requestData = { 'filters': { 'type': 'state' } };
            this.cachedMapping['$state'] = this.profileService.getUserLocation(requestData).pipe(
              map(apiResponse => _.map(_.get(apiResponse, 'result.response'), state => _.get(state, 'name'))),
              shareReplay(1),
              catchError(err => of([]))
            );
          }
          return this.cachedMapping['$state'];
        }
      },
      $channel: {
        value: _.get(this.userService, 'userProfile.rootOrg.hashTagId'),
        masterData: () => {
          if (!this.cachedMapping.hasOwnProperty('$channel')) {
            const req = {
              filters: { isRootOrg: true, status: 1 },
              fields: ['id', 'channel', 'slug', 'orgName'],
              pageNumber: 1,
              limit: 10000
            };
            this.cachedMapping['$channel'] = this.searchService.orgSearch(req).pipe(
              map(res => _.map(_.get(res, 'result.response.content'), 'id')),
              shareReplay(1)
            );
          }
          return this.cachedMapping['$channel'];
        }
      }
    };

    return parameterMappings[parameter];
  }

  public convertToBase64 = (value) => btoa(value);

  public getParametersHash = (report: { parameters: string[] }) => {
    const parameters = _.get(report, 'parameters');
    return this.convertToBase64(_.join(_.map(parameters, param => {
      return _.replace(param, _.toLower(param), this.getParameterValues(param).value);
    }), '__'));
  }

  public getParameterFromHash = (hash: string) => {
    return _.split(atob(hash), '__');
  }

  public isReportParameterized = report => _.get(report, 'parameters.length') > 0 && _.isArray(report.parameters) && _.get(report, 'isParameterized');

  public resolveParameterizedPath(path: string, explicitValue?: string): string {
    return _.reduce(PRE_DEFINED_PARAMETERS, (result: string, parameter: string) => {
      if (_.includes(result, parameter) && this.getParameterValues(parameter)) {
        result = _.replace(result, parameter, explicitValue || this.getParameterValues(parameter).value);
      }
      return result;
    }, path);
  }

  public getUpdatedParameterizedPath(dataSources: IDataSource[], hash?: string) {
    const explicitValue = hash ? this.getParameterFromHash(hash) : null;
    return _.map(dataSources, (dataSource: IDataSource) => ({
      id: dataSource.id,
      path: this.resolveParameterizedPath(dataSource.path, explicitValue)
    }));
  }

  public getMaterializedChildRows(reports: any[]) {
    const apiCall = _.map(reports, report => {
      const isParameterized = _.get(report, 'isParameterized') || false;
      if (!isParameterized) { return of(report); }
      const parameters = _.get(report, 'parameters');
      if (!parameters.length) { return of(report); }
      const paramObj: { masterData: () => Observable<any> } = this.getParameterValues(_.toLower(parameters[0]));
      if (!paramObj) { return of(report); }
      return paramObj.masterData()
        .pipe(
          map(results => {
            report.children = _.uniqBy(_.concat(_.map(report.children, child => ({
              ...child,
              label: this.getParameterFromHash(child.hashed_val)
            })),
              _.map(results, res => ({
                label: res,
                hashed_val: this.convertToBase64(_.split(res, '__')),
                status: 'draft',
                reportid: _.get(report, 'reportid'),
                materialize: true
              }))), 'hashed_val');
            return report;
          }),
          catchError(err => {
            // console.error(err);
            return of(report);
          }));
    });
    return forkJoin(apiCall);
  }

  public getFlattenedReports(reports: any[]) {
    return _.reduce(reports, (result, report) => {
      const isParameterized = _.get(report, 'isParameterized') || false;
      if (isParameterized && _.get(report, 'children.length')) {
        for (const childReport of report.children) {
          const flattenedReport = _.assign({ ...report }, _.omit(childReport, 'id'));
          delete flattenedReport.children;
          result.push(flattenedReport);
        }
        return result;
      }
      result.push(report);
      return result;
    }, []);
  }

}
