import { Component, OnInit } from '@angular/core';
import { UsageService } from './../../services';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

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
  constructor(private usageService: UsageService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.usageService.getData('/reports/meta.json').subscribe(data => {
      this.reportMetaData = data;
      if (data[0]) { this.renderReport(data[0]); }
    });
  }
  renderReport(report: any) {
    this.currentReport = report;
    this.isTableDataLoaded = false;
    const url = report.dataSource;
    this.usageService.getData(url).subscribe((data) => {
      this.table = {};
      this.chartData = [];
      if (_.get(report, 'chart')) { this.createChartData(_.get(report, 'chart'), data); }
      if (_.get(report, 'table')) { this.createTableData(_.get(report, 'table'), data); }
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

  createTableData(table, data) {
    this.table.header = _.get(table, 'columns') || _.get(data, _.get(table, 'columnsExpr'));
    this.table.data = _.get(table, 'values') || _.get(data, _.get(table, 'valuesExpr'));
    this.isTableDataLoaded = true;
  }

  downloadCSV(url) {
    window.open(url, '_blank');
  }

  transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }
}
