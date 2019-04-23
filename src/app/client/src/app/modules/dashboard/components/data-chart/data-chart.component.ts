import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { startWith, switchMap, tap, map } from 'rxjs/operators';
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

  constructor() { }

  ngOnInit() {
    this.chart = _.cloneDeep(this.chartData);
    this.chartFilters = new FormGroup({
      timeLine: new FormControl(''),
      userRoles: new FormControl(''),
      region: new FormControl('')
    });
  }

  ngAfterViewInit() {
    this.applyFilters();
  }

  onTimeLineChange = () => {
    return this.chartFilters.get('timeLine').valueChanges.pipe(
      startWith(0),
    );
  }

  onRegionChange = () => {
    return this.chartFilters.get('region').valueChanges.pipe(startWith(0));
  }

  onUserRolesChange = () => {
    return this.chartFilters.get('userRoles').valueChanges.pipe(startWith(0));
  }

  applyFilters() {
    combineLatest(this.onRegionChange(), this.onTimeLineChange(), this.onUserRolesChange())
      .pipe(
        switchMap((value) => {
          return this.applyFiltersToGraph(value);
        }))
      .subscribe(({ dataSets, labels }) => {
        this.chart.labels = labels;
        _.forEach(dataSets, (dataset, i) => {
          this.chartInfo.datasets[i].data = dataSets[i].data;
        });
        this.chartInfo.update();
      });
  }

  resetFilter() {
    this.chartFilters.reset();
    this.chart.labels = this.chartData.labels;
    _.forEach(this.chartData.datasets, (dataset, i) => {
      this.chartInfo.datasets[i].label = dataset.label;
      this.chartInfo.datasets[i].data = dataset.data;
    });
    this.chartInfo.update();
  }

  // public chartClicked(e:any): void {
  //   if (e.active.length > 0) {
  //     let datasetIndex = e.active[0]._datasetIndex
  //     let dataIndex = e.active[0]._index
  //     this.chartFilters.get('timeLine').setValue(this.chartInfo.labels[dataIndex]);
  //   }
  // }
  applyFiltersToGraph([region, timeLine, userRoles]) {
    let endIndex = this.chartData.labels.length;
    let startIndex = 0;
    if (timeLine) {
      const newDate = moment(timeLine, 'YYYY-MM-DD').format('DD-MM-YYYY');
      endIndex = _.findIndex(this.chartData.labels, (date) => date === newDate) + 1;
      startIndex = (endIndex - 30 < 0) ? 0 : endIndex - 30;
    }
    const labels = _.slice(this.chartData.labels, startIndex, endIndex);
    const dataSets = [];
    _.forEach(this.chartData.datasets, (dataset, i) => {
      dataSets.push({
        label: _.get(dataset, 'label'),
        data: _.slice(dataset.data, startIndex, endIndex)
      });
    });
    return of({ labels, dataSets });
  }
}

