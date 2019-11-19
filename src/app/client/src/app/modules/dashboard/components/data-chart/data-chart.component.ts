/**
 * Component to render & apply filter on admin chart
 * @author Ravinder Kumar
 */

import { UsageService } from './../../services';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import * as _ from 'lodash-es';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Subject, timer } from 'rxjs';
import { distinctUntilChanged, map, debounceTime, takeUntil, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { IInteractEventObject } from '@sunbird/telemetry';
import { IBigNumberChart } from '../../interfaces/chartData';
@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit, OnDestroy {

  @Input() chartInfo: any;
  @Input() telemetryInteractObject: IInteractEventObject;
  public unsubscribe = new Subject<void>();
  // contains the chart configuration
  chartConfig;
  chartData;
  showStats: Boolean = false;
  chartType;
  chartColors;
  legend;
  chartOptions;
  loadash = _;
  datasets;
  chartLabels = [];
  filters: Array<{}>;
  filtersFormGroup: FormGroup;
  showFilters: Boolean = false;
  filtersSubscription: Subscription;
  noResultsFound: Boolean;

  availableChartTypeOptions = ['Bar', 'Line'];

  pickerMinDate; // min date that can be selected in the datepicker
  pickerMaxDate; // max date that can be selected in datepicker

  selectedStartDate;
  selectedEndDate;

  datePickerConfig = { applyLabel: 'Set Date', format: 'DD-MM-YYYY' };
  alwaysShowCalendars: boolean;

  resultStatistics = {};
  selectedFilters: {};
  dateFilterReferenceName;
  telemetryCdata: Array<{}>;
  showGraphStats: Boolean = false;
  bigNumberCharts: Array<{}> = [];

  iframeDetails: any;
  lastUpdatedOn: any;
  showLastUpdatedOn: Boolean = false;
  showChart: Boolean = false;

  @ViewChild('datePickerForFilters') datepicker: ElementRef;

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };

  @ViewChild(BaseChartDirective) chartDirective: BaseChartDirective;
  constructor(public resourceService: ResourceService, private fb: FormBuilder,
    private toasterService: ToasterService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer,
    private usageService: UsageService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.chartConfig = _.get(this.chartInfo, 'chartConfig');
    this.chartData = _.get(this.chartInfo, 'chartData');
    if (_.get(this.chartInfo, 'lastUpdatedOn')) {
      this.lastUpdatedOn = moment(_.get(this.chartInfo, 'lastUpdatedOn')).format('DD-MMMM-YYYY');
    }
    this.prepareChart();
    this.setTelemetryCdata();
    if (this.filters) {
      this.showFilters = false;
      this.buildFiltersForm();
    }
  }

  buildFiltersForm() {
    this.filtersFormGroup = this.fb.group({});
    if (_.get(this.chartConfig, 'labelsExpr')) {
      _.forEach(this.filters, filter => {
        if (filter.controlType === 'date' || /date/i.test(_.get(filter, 'reference'))) {
          const dateRange = _.uniq(_.map(this.chartData, _.get(filter, 'reference')));
          this.pickerMinDate = moment(dateRange[0], 'DD-MM-YYYY');
          this.pickerMaxDate = moment(dateRange[dateRange.length - 1], 'DD-MM-YYYY');
          this.dateFilterReferenceName = filter.reference;
        }
        this.filtersFormGroup.addControl(_.get(filter, 'reference'), this.fb.control(''));
        filter.options = _.uniq(_.map(this.chartData, data => data[filter.reference].toLowerCase()));
      });
      if (this.filters.length > 0) {
        this.showFilters = true;
      }
      this.filtersSubscription = this.filtersFormGroup.valueChanges
        .pipe(
          takeUntil(this.unsubscribe),
          map(filters => {
            return _.omitBy(filters, _.isEmpty);
          }),
          debounceTime(100),
          distinctUntilChanged()
        )
        .subscribe((filters) => {
          this.selectedFilters = _.omit(filters, this.dateFilterReferenceName); // to omit date inside labels
          const res: Array<{}> = _.filter(this.chartData, data => {
            return _.every(filters, (value, key) => {
              return _.includes(value, data[key].toLowerCase());
            });
          });
          this.noResultsFound = (res.length > 0) ? false : true;
          if (this.noResultsFound) {
            this.toasterService.error(this.resourceService.messages.stmsg.m0008);
          }
          this.getDataSetValue(res);

        }, (err) => {
          console.log(err);
        });
    }
  }

  private calculateBigNumber() {
    const bigNumbersConfig = _.get(this.chartConfig, 'bigNumbers');
    this.bigNumberCharts = [];
    if (bigNumbersConfig.length) {
      _.forEach(bigNumbersConfig, (config: IBigNumberChart) => {
        const bigNumberChartObj = {};
        if (_.get(config, 'dataExpr')) {
          bigNumberChartObj['header'] = _.get(config, 'header') || '';
          bigNumberChartObj['footer'] = _.get(config, 'footer') || _.get(config, 'dataExpr');
          bigNumberChartObj['data'] =
            (_.round(_.sumBy(this.chartData, data => _.toNumber(data[_.get(config, 'dataExpr')])))).toLocaleString('hi-IN');
          this.bigNumberCharts.push(bigNumberChartObj);
        }
      });
    }
  }

  private checkForExternalChart() {
    const iframeConfig = _.get(this.chartConfig, 'iframeConfig');
    if (iframeConfig) {
      if (_.get(iframeConfig, 'sourceUrl')) {
        return true;
      }
    }
    return false;
  }

  getIframeURL() {
    const url = `${_.get(this.iframeDetails, 'sourceUrl')}?qs=${Math.round(Math.random() * 10000000)}`; // to prevent browser caching
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  prepareChart() {
    if (!this.checkForExternalChart()) {
      this.chartOptions = _.get(this.chartConfig, 'options') || { responsive: true };
      this.chartColors = _.get(this.chartConfig, 'colors') || ['#024F9D'];
      this.chartType = _.get(this.chartConfig, 'chartType') || 'line';
      this.legend = (_.get(this.chartConfig, 'legend') === false) ? false : true;
      this.showLastUpdatedOn = false;
      this.showChart = false;
      if (_.get(this.chartConfig, 'options.showLastUpdatedOn') && this.lastUpdatedOn) {
        this.showLastUpdatedOn = true;
      }
      if ((_.get(this.chartConfig, 'labelsExpr') || _.get(this.chartConfig, 'labels')) && _.get(this.chartConfig, 'datasets')) {
        this.showChart = true;
      }
      this.showGraphStats = _.get(this.chartOptions, 'showGraphStats') || false;
      this.getDataSetValue();
    } else {
      this.iframeDetails = _.get(this.chartConfig, 'iframeConfig');
    }
    if (_.get(this.chartConfig, 'bigNumbers')) {
      this.calculateBigNumber();
    }
    const refreshInterval = _.get(this.chartConfig, 'options.refreshInterval');
    if (refreshInterval) { this.refreshChartDataAfterInterval(refreshInterval); }
    this.filters = _.get(this.chartConfig, 'filters') || [];
  }

  refreshChartDataAfterInterval(interval) {
    timer(interval, interval).pipe(
      switchMap(val => {
        return this.usageService.getData(_.get(this.chartInfo, 'downloadUrl'));
      }),
      takeUntil(this.unsubscribe)
    ).subscribe(apiResponse => {
      if (_.get(apiResponse, 'responseCode') === 'OK') {
        const chartData = _.get(apiResponse, 'result.data');
        this.getDataSetValue(chartData);
        // to apply current filters to new updated chart data;
        const currentFilterValue = _.get(this.filtersFormGroup, 'value');
        this.filtersFormGroup.patchValue(currentFilterValue);
      }
    }, err => {
      console.log('failed to update chart data', err);
    });
  }

  getDataSetValue(chartData = this.chartData) {
    let labels = [];
    let groupedDataBasedOnLabels;
    if (_.get(this.chartConfig, 'labelsExpr')) {
      groupedDataBasedOnLabels = _.groupBy(chartData, (data) => _.trim(data[_.get(this.chartConfig, 'labelsExpr')].toLowerCase()));
      labels = _.keys(groupedDataBasedOnLabels);
    }
    if (_.get(this.chartConfig, 'labels')) {
      labels = _.get(this.chartConfig, 'labels');
    }
    this.chartLabels = labels;
    this.datasets = [];
    _.forEach(this.chartConfig.datasets, dataset => {
      this.datasets.push({
        label: dataset.label,
        data: _.get(dataset, 'data') || this.getData(groupedDataBasedOnLabels, dataset['dataExpr']),
        hidden: _.get(dataset, 'hidden') || false
      });
    });

    if (this.showGraphStats) {
      _.forEach(this.datasets, dataset => {
        this.resultStatistics[dataset.label] = {
          sum: _.sumBy(dataset.data, (val) => _.toNumber(val)).toFixed(2),
          min: _.minBy(dataset.data, (val) => _.toNumber(val)),
          max: _.maxBy(dataset.data, (val) => _.toNumber(val)),
          avg: dataset.data.length > 0 ? (_.sumBy(dataset.data, (val) => _.toNumber(val)) / dataset.data.length).toFixed(2) : 0
        };
      });
    }
  }

  getData(groupedDataBasedOnLabels, dataExpr) {
    const data = _.mapValues(groupedDataBasedOnLabels, value => {
      return _.sumBy(value, (o) => +o[dataExpr]);
    });
    return _.values(data);
  }


  getDateRange({ startDate, endDate }, columnRef) {
    this.selectedStartDate = moment(startDate).subtract(1, 'day');
    this.selectedEndDate = moment(endDate).add(1, 'day');
    const dateRange = [];
    const currDate = moment(this.selectedStartDate).startOf('day');
    const lastDate = moment(this.selectedEndDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dateRange.push(currDate.clone().format('DD-MM-YYYY'));
    }
    this.filtersFormGroup.get(columnRef).setValue(dateRange);
  }

  changeChartType(chartType) {
    this.chartType = _.lowerCase(chartType);
  }

  resetFilter() {
    this.filtersFormGroup.reset();
    if (this.datepicker) {
      this.datepicker.nativeElement.value = '';
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setTelemetryCdata() {
    this.telemetryCdata = [
      {
        id: 'dashboard:filter',
        type: 'Feature'
      }
      , {
        id: 'SB-13051',
        type: 'Task'
      }];
  }

  setTelemetryInteractEdata(val) {
    return {
      id: _.join(_.split(val, ' '), '-').toLowerCase(),
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

}


