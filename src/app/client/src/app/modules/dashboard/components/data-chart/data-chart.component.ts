import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { combineLatest, of, iif } from 'rxjs';
import { startWith, switchMap, tap, map, filter } from 'rxjs/operators';
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
  filterDetails = [{ type: 'timeLine' }];
  constructor() { }

  ngOnInit() {
    this.chart = _.cloneDeep(this.chartData);
    this.startDate = moment(this.chartData.labels[0], 'DD-MM-YYYY').toDate();
    this.endDate = moment(this.chartData.labels[this.chartData.labels.length - 1], 'DD-MM-YYYY').toDate();
    this.chartFilters = new FormGroup({
      dataSet: new FormControl(''),
      timeLine: new FormControl(''),
      context_did: new FormControl(''),
      context_pdata_id: new FormControl(''),
      user_type: new FormControl(''),
      user_roles: new FormControl(''),
      user_loc_district: new FormControl(''),
      device_loc_district: new FormControl(''),
      actor_type: new FormControl(''),
      context_channel: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.applyFilters();
  }

  applyFilters() {
    combineLatest(this.onUserDistrictChange(), this.onTimeLineChange(), this.onDeviceDistrictChange(),
      this.onActorTypeChange(), this.onUserRolesChange(), this.onUserTypeChange(), this.onDataSetChange())
      .subscribe(value => {
        // console.log(value);
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

  onUserDistrictChange = () => {
    return this.chartFilters.get('user_loc_district').valueChanges.pipe(startWith(null));
  }

  onDeviceDistrictChange = () => {
    return this.chartFilters.get('device_loc_district').valueChanges.pipe(startWith(null));
  }

  onActorTypeChange = () => {
    return this.chartFilters.get('actor_type').valueChanges.pipe(startWith(null));
  }

  onUserRolesChange = () => {
    return this.chartFilters.get('user_roles').valueChanges.pipe(startWith(null));
  }

  onUserTypeChange = () => {
    return this.chartFilters.get('user_type').valueChanges.pipe(startWith(null));
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

