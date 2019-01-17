import { Component, OnInit } from '@angular/core';
import { UsageService } from './../../services';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '@sunbird/core';
import { first, map } from 'rxjs/operators';
import { ToasterService, IUserData } from '@sunbird/@sunbird/shared';

@Component({
  selector: 'app-usage-reports',
  templateUrl: './usage-reports.component.html',
  styleUrls: ['./usage-reports.component.scss']
})
export class UsageReportsComponent implements OnInit {

  reportMetaData: any;
  chartData: Array<object> = [];
  table: any;
  isTableDataLoaded = false;
  currentReport: any;
  slug: string;
  constructor(private usageService: UsageService, private sanitizer: DomSanitizer,
    public userService: UserService, public toasterService: ToasterService) { }

  ngOnInit() {
    this.userService.userData$.pipe(first(),
      map((user: IUserData) => {
        if (user.err || !_.get(user, 'userProfile.rootOrg.slug')) {
          this.toasterService.error('Unable fetch data for dashboards');
        } else {
          this.slug = _.get(user, 'userProfile.rootOrg.slug');
          this.usageService.getData(`/reports/${this.slug}/meta.json`).subscribe(data => {
            this.reportMetaData = data;
            if (data[0]) { this.renderReport(data[0]); }
          });
        }

      }));

  }
  renderReport(report: any) {
    this.currentReport = report;
    this.isTableDataLoaded = false;
    const url = report.dataSource;
    this.usageService.getData(url).subscribe((data) => {
      this.table = {};
      this.chartData = [];
      if (_.get(report, 'chart')) { this.createChartData(_.get(report, 'chart'), data); }
      if (_.get(report, 'table')) { this.renderTable(_.get(report, 'table'), data); }
    });
  }

  createChartData(charts, data) {
    _.forEach(charts, chart => {
      const chartObj: any = {};
      chartObj.options = _.get(chart, 'options') || { responsive: true };
      chartObj.colors = _.get(chart, 'colors') || ['#024F9D'];
      chartObj.chartType = _.get(chart, 'chartType') || 'line';
      chartObj.labels = _.get(chart, 'labels') || _.get(data, _.get(chart, 'labelsExpr'));
      chartObj.legend = (_.get(chart, 'legend') === false) ? false : true;
      chartObj.datasets = [];
      _.forEach(chart.datasets, dataset => {
        chartObj.datasets.push({
          label: dataset.label,
          data: _.get(dataset, 'data') || _.get(data, _.get(dataset, 'dataExpr'))
        });
      });
      this.chartData.push(chartObj);
    });

  }

  renderTable(table, data) {
    this.table.header = _.get(table, 'columns') || _.get(data, _.get(table, 'columnsExpr'));
    this.table.data = _.get(table, 'values') || _.get(data, _.get(table, 'valuesExpr'));
    this.isTableDataLoaded = true;
    $('#' + this.currentReport.id).DataTable({
      'data': this.table.data,
      'scrollX': true,
      'searching': false,
    });
  }

  downloadCSV(url) {
    window.open(url, '_blank');
  }

  transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }
}
