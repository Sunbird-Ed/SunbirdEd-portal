import { Component, OnInit } from '@angular/core';
import { UsageService } from './../../services';
import * as _ from 'lodash';

@Component({
  selector: 'app-usage-reports',
  templateUrl: './usage-reports.component.html',
  styleUrls: ['./usage-reports.component.scss']
})
export class UsageReportsComponent implements OnInit {

  reportMetaData: any;
  chartData: Array<object> = [];
  table: any;
  title: string;
  description: string;
  isTableDataLoaded = false;
  downloadUrl: string;
  constructor(private usageService: UsageService) {

  }
  ngOnInit() {
    this.usageService.getData('/reports/meta.json').subscribe(data => {
      this.reportMetaData = data;
      if (data[0]) { this.renderReport(data[0]); }
    });
  }
  renderReport(report: any) {
    this.isTableDataLoaded = false;
    this.downloadUrl = _.get(report, 'downloadUrl');
    const url = report.dataSource;
    this.title = _.get(report, 'title') || _.get(report, 'label');
    this.description = _.get(report, 'description');
    this.usageService.getData(url).subscribe((data) => {
      if (_.get(report, 'chart')) { this.createChartData(_.get(report, 'chart'), data); }
      if (_.get(report, 'table')) { this.createTableData(_.get(report, 'table'), data); }
    });
  }

  createChartData(charts, data) {
    this.chartData = [];
    _.forEach(charts, chart => {
      const chartObj: any = {};
      chartObj.options = _.get(chart, 'options') || { responsive: true };
      chartObj.colors = _.get(chart, 'colors') || ['#024F9D'];
      chartObj.chartType = _.get(chart, 'chartType') || 'line';
      chartObj.labels = _.get(chart, 'labels') || _.get(data, _.get(chart, 'labelsExpr'));
      chartObj.datasets = [];
      _.forEach(chart.datasets, dataset => {
        chartObj.datasets.push({
          label: dataset.label,
          data: _.get(data, _.get(dataset, 'dataExpr'))
        });
      });
      this.chartData.push(chartObj);
    });

  }

  createTableData(table, data) {
    this.table = {};
    this.table.header = _.get(data, _.get(table, 'columnsExpr'));
    this.table.data = _.get(data, _.get(table, 'valuesExpr'));
    this.isTableDataLoaded = true;
  }

  downloadCSV() {
    window.open(this.downloadUrl, '_blank');
  }

}
