import { UserService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UsageService } from '../usage/usage.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Observable } from 'rxjs';

@Injectable()
export class ReportService {

  constructor(private sanitizer: DomSanitizer, private usageService: UsageService, private userService: UserService) { }

  public fetchDataSource(filePath: string): Observable<any> {
    return this.usageService.getData(filePath).pipe(
      map(configData => {
        return _.get(configData, 'result');
      })
    );
  }

  public prepareChartData(chartsArray: Array<any>, data: any, downloadUrl: string): Array<{}> {
    return _.map(chartsArray, chart => {
      const chartObj: any = {};
      chartObj.chartConfig = chart;
      chartObj.downloadUrl = downloadUrl;
      chartObj.chartData = _.get(data, 'data');
      chartObj.lastUpdatedOn = _.get(data, 'metadata.lastUpdatedOn');
      return chartObj;
    });
  }

  public prepareTableData(tablesArray: any, data: any, downloadUrl: string): Array<{}> {
    tablesArray = _.isArray(tablesArray) ? tablesArray : [tablesArray];
    return _.map(tablesArray, table => {
      const tableData: any = {};
      tableData.id = _.get(table, 'id') || `table-${_.random(1000)}`;
      tableData.name = _.get(table, 'name') || 'Table';
      tableData.header = _.get(table, 'columns') || _.get(data, _.get(table, 'columnsExpr'));
      tableData.data = _.get(table, 'values') || _.get(data, _.get(table, 'valuesExpr'));
      tableData.downloadUrl = _.get(table, 'downloadUrl') || downloadUrl;
      return tableData;
    });
  }

  public downloadReport(filePathSource) {
    return this.fetchDataSource(filePathSource).pipe(
      map(response => _.get(response, 'signedUrl'))
    );
  }

  public isAuthenticated() {
  }

  public transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }

}
