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
  selectedTime;
  timeLineRangeoptions = [{ label: 'Last Seven Days', value: 7 }, { label: 'Last 15 Days', value: 15 },
  { label: 'Last 30 Days', value: 30 }];
  timeLineRange;
  constructor() { }

  ngOnInit() {
    this.chart = _.cloneDeep(this.chartData);
    this.chartFilters = new FormGroup({
      timeLineRange: new FormControl(''),
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
    combineLatest(this.onLabelsChange(), this.onTimeLineChange(), this.onDataSetChange(), this.onTimeLineRangeChange())
      .subscribe(value => {
        if (this.chartInfo) {
          this.chartInfo.update();
        }
      });
  }

  onTimeLineChange = () => {
    return this.chartFilters.get('timeLine').valueChanges
      .pipe(
        startWith(null),
        tap((time) => {
          if (!_.isNull(time)) {
            if (!this.timeLineRange) {
              this.chartFilters.get('timeLineRange').setValue(this.timeLineRangeoptions[0].value);
            }
            this.selectedTime = time;
            const newDate = moment(time, 'YYYY-MM-DD').format('DD-MM-YYYY');
            const endIndex = _.findIndex(this.chartData.labels, (date) => date === newDate) + 1;
            const startIndex = (endIndex - this.timeLineRange < 0) ? 0 : endIndex - this.timeLineRange;
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

  onTimeLineRangeChange = () => {
    return this.chartFilters.get('timeLineRange').valueChanges
      .pipe(
        startWith(null),
        tap(range => {
          if (!_.isNull(range)) {
            this.timeLineRange = range;
            if (this.selectedTime) {
              this.chartFilters.get('timeLine').setValue(this.selectedTime);
            } else {
              this.chartFilters.get('timeLine').setValue(this.endDate);
            }
          }
        })
      );
  }

  resetFilter() {
    this.selectedTime = null;
    this.timeLineRange = null;
    this.chartFilters.reset();
    this.chart.labels = this.chartData.labels;
    _.forEach(this.chartData.datasets, (dataset, i) => {
      this.chartInfo.datasets[i].hidden = false;
      this.chartInfo.datasets[i].label = dataset.label;
      this.chartInfo.datasets[i].data = dataset.data;
    });
    if (this.chartInfo) {
      this.chartInfo.update();
    }
  }
}
