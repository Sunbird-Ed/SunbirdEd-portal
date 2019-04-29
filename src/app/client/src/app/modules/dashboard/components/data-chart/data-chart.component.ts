import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { combineLatest, } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit, AfterViewInit {

  @Input() chartData: any;
  chart;
  chartFilters: FormGroup;
  @ViewChild(BaseChartDirective) chartInfo: BaseChartDirective;
  startDate;
  endDate;
  labelString;
  showTimeLine = false;
  constructor() { }

  ngOnInit() {
    this.chart = _.cloneDeep(this.chartData);
    this.chartFilters = new FormGroup({
      labels: new FormControl(''),
      dataSet: new FormControl(''),
      timeLine: new FormControl(''),
    });
    this.labelString = _.get(this.chartData, 'options.scales.xAxes[0].scaleLabel.labelString') || 'labels';
    if (_.get(this.chartData, 'chartType') === 'horizontalBar') {
      this.labelString = _.get(this.chartData, 'options.scales.yAxes[0].scaleLabel.labelString') || 'labels';
    }
    if (/date/i.test(this.labelString)) {
      this.showTimeLine = true;
      this.startDate = moment(this.chartData.labels[0], 'DD-MM-YYYY').toDate();
      this.endDate = moment(this.chartData.labels[this.chartData.labels.length - 1], 'DD-MM-YYYY').toDate();
    }
  }

  ngAfterViewInit() {
    this.applyFilters();
  }

  applyFilters() {
    combineLatest(this.onLabelsChange(), this.onTimeLineChange(), this.onDataSetChange())
      .subscribe(value => {
        this.chartInfo.update();
      });
  }

  onTimeLineChange = () => {
    return this.chartFilters.get('timeLine').valueChanges
      .pipe(
        startWith(null),
        tap((time) => {
          if (!_.isNull(time)) {
            let endIndex = this.chartData.labels.length;
            let startIndex = 0;
            const newDate = moment(time, 'YYYY-MM-DD').format('DD-MM-YYYY');
            endIndex = _.findIndex(this.chartData.labels, (date) => date === newDate) + 1;
            startIndex = (endIndex - 30 < 0) ? 0 : endIndex - 30;
            const labels = _.slice(this.chartData.labels, startIndex, endIndex);
            const dataSets = [];
            _.forEach(this.chartData.datasets, (dataset, i) => {
              dataSets.push({
                label: _.get(dataset, 'label'),
                data: _.slice(dataset.data, startIndex, endIndex)
              });
            });
            this.chart.labels = labels;
            _.forEach(dataSets, (dataset, i) => {
              this.chartInfo.datasets[i].data = dataSets[i].data;
            });
          }
        })
      );
  }

  onLabelsChange = () => {
    return this.chartFilters.get('labels').valueChanges.pipe(
      startWith(null),
      tap(labels => {
        if (!_.isNull(labels)) {
          const indices = _.map(labels, label => {
            return _.indexOf(this.chartData.labels, label);
          });
          const dataSets = [];
          _.forEach(this.chartData.datasets, (dataset, i) => {
            dataSets.push({
              label: _.get(dataset, 'label'),
              data: _.map(indices, index => dataset.data[index])
            });
          });
          this.chart.labels = labels;
          _.forEach(dataSets, (dataset, i) => {
            this.chartInfo.datasets[i].data = dataSets[i].data;
          });
        }
      })
    );

  }

  onDataSetChange = () => {
    return this.chartFilters.get('dataSet').valueChanges
      .pipe(
        startWith(null),
        tap(datasetsToShow => {
          if (!_.isNull(datasetsToShow)) {
            _.forEach(this.chartInfo.datasets, dataset => {
              if (_.includes(datasetsToShow, dataset)) {
                dataset.hidden = false;
              } else {
                dataset.hidden = true;
              }
            });
          }
        })
      );
  }

  resetFilter() {
    this.chartFilters.reset();
    this.chart.labels = this.chartData.labels;
    _.forEach(this.chartData.datasets, (dataset, i) => {
      this.chartInfo.datasets[i].hidden = false;
      this.chartInfo.datasets[i].label = dataset.label;
      this.chartInfo.datasets[i].data = dataset.data;
    });
    this.chartInfo.update();
  }
}

