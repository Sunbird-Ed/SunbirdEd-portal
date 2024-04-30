/**
 * Component to render & apply filter on admin chart
 * @author Ravinder Kumar
 */
import { EventEmitter, Output } from '@angular/core';
import { UsageService, ReportService } from './../../services';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import * as _ from 'lodash-es';
import { FormBuilder } from '@angular/forms';
import { Subscription, Subject, timer, of } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import dayjs from 'dayjs';
import { IInteractEventObject } from '@sunbird/telemetry';
import { IBigNumberChart } from '../../interfaces/chartData';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit, OnDestroy {

  @Input() chartInfo: any;
  @Input() telemetryInteractObject: IInteractEventObject;
  @Input() hideElements = false;
  @Input() isUserReportAdmin = false;
  @Output() openAddSummaryModal = new EventEmitter();
  @Input() hash: string;

  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;


 public unsubscribe = new Subject<void>();
 // contains the chart configuration
  chartConfig: any;
  chartData: any;
  chartType: any;
  chartColors: any;
  legend: any;
  chartOptions: any;
  loadash = _;
  datasets: any;
  chartLabels: any = [];
  filters: Array<{}>;
  showFilters: Boolean = false;
  filtersSubscription: Subscription;
  noResultsFound: Boolean;
  showStats: Boolean = false;
  availableChartTypeOptions = ['Bar', 'Line'];
  pickerMinDate: any; // min date that can be selected in the datepicker
  pickerMaxDate: any; // max date that can be selected in datepicker

  selectedStartDate: any;
  selectedEndDate: any;

  datePickerConfig: any = { applyLabel: 'Set Date', format: 'DD-MM-YYYY' };
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
  chartSummary$: any;
  private _chartSummary: string;
  private _globalFilter; // private property _item
  resetFilters;
  filterPopup: Boolean = false;
  filterOpen: Boolean = false;
  chartSummarylabel: string;
  currentFilters: Array<{}>;
  @ViewChild('datePickerForFilters') datepicker: ElementRef;
  @ViewChild('chartRootElement') chartRootElement;
  @ViewChild('chartCanvas') chartCanvas;
  filterType = 'chart-filter';
  dateFilters: Array<string>;
  dialogRef: any;

  @ViewChild(BaseChartDirective) chartDirective: BaseChartDirective;
  constructor(public resourceService: ResourceService, private cdr: ChangeDetectorRef,
    private toasterService: ToasterService, public activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer,
    private usageService: UsageService, private reportService: ReportService, private dialog: MatDialog) {
    this.alwaysShowCalendars = true;
  }


  ngOnInit() {

    this.chartConfig = _.get(this.chartInfo, 'chartConfig');
    this.chartData = _.get(this.chartInfo, 'chartData');
    this.chartSummarylabel = 'Add ' + _.get(this.resourceService, 'frmelmnts.lbl.chartSummary');
    if (_.get(this.chartInfo, 'lastUpdatedOn')) {
      this.lastUpdatedOn = dayjs(_.get(this.chartInfo, 'lastUpdatedOn')).format('DD-MMMM-YYYY');
    }

    this.prepareChart();
    this.setTelemetryCdata();
    this.cdr.detectChanges();

  }



  private calculateBigNumber(chartData) {

    const bigNumbersConfig = _.get(this.chartConfig, 'bigNumbers');
    this.bigNumberCharts = [];
    if (bigNumbersConfig && bigNumbersConfig.length) {
      _.forEach(bigNumbersConfig, (config: IBigNumberChart) => {
        const bigNumberChartObj = {};
        if (_.get(config, 'dataExpr')) {
          bigNumberChartObj['header'] = _.get(config, 'header') || '';
          bigNumberChartObj['footer'] = _.get(config, 'footer') || _.get(config, 'dataExpr');
          bigNumberChartObj['data'] =
            (_.round(_.sumBy(chartData, data => _.toNumber( (data && data[_.get(config, 'dataExpr')]) ? data[_.get(config, 'dataExpr')] : 0  )))).toLocaleString('hi-IN');
          this.bigNumberCharts.push(bigNumberChartObj);
        }
      });
    }
  }

  private checkForExternalChart(): boolean {
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

  /**
   * @description show percentage in pie charts
   * @private
   * @memberof DataChartComponent
   */
  private showPercentageInCharts = () => {
    return {
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const total = dataset.data.reduce((previousValue, currentValue, currentIndex, array) => {
          return previousValue + currentValue;
        });
        const currentVal = dataset.data[tooltipItem.index];
        const percentage = Math.floor(((currentVal / total) * 100) + 0.5);
        return `${data.labels[tooltipItem.index]}: ${currentVal}  ( ${percentage} % )`;
      }
    };
  }

  prepareChart() {
    if (!this.checkForExternalChart()) {

      this.chartOptions = _.get(this.chartConfig, 'options') || { responsive: true };
      this.chartColors = _.get(this.chartConfig, 'colors') || [];
      this.chartType = _.get(this.chartConfig, 'chartType');

      // shows percentage in pie chart if showPercentage config is enabled.
      if (this.chartType === 'pie' && _.get(this.chartOptions, 'showPercentage')) {
        (this.chartOptions.tooltips || (this.chartOptions.tooltips = {})).callbacks = this.showPercentageInCharts();
      }

      this.legend = (_.get(this.chartConfig, 'legend') === false) ? false : true;
      this.showLastUpdatedOn = false;
      this.showChart = false;
      if (_.get(this.chartConfig, 'options.showLastUpdatedOn') || this.lastUpdatedOn) {
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
      this.calculateBigNumber(this.chartData);
    }
    const refreshInterval = _.get(this.chartConfig, 'options.refreshInterval');
    if (refreshInterval) {
       this.refreshChartDataAfterInterval(refreshInterval);
    }
    this.filters = _.get(this.chartConfig, 'filters') || [];
    this.chartSummary$ = this.getChartSummary();
  }

  refreshChartDataAfterInterval(interval) {
    timer(interval, interval).pipe(
      switchMap(val => {
        return this.usageService.getData(_.head(_.get(this.chartInfo, 'downloadUrl')).path);
      }),
      takeUntil(this.unsubscribe)
    ).subscribe(apiResponse => {
      if (_.get(apiResponse, 'responseCode') === 'OK') {
        const chartData = _.get(apiResponse, 'result.data');
        this.chartData = chartData;
        this.resetFilters = { data: chartData };

      }
    }, err => {
      console.log('failed to update chart data', err);
    });
  }

  private setChartLabels = (groupedDataBasedOnLabels) => {
    let labels = [];
    labels = _.keys(groupedDataBasedOnLabels);

    // if hard-codes labels are there use them.
    if (_.get(this.chartConfig, 'labels')) {
      labels = _.get(this.chartConfig, 'labels');
    }
    _.forEach(labels, (label, key) => {
      labels[key] = _.capitalize(label);
    });

    this.chartLabels = labels;
  }

  private sortData(chartData, labelsExpr) {
    return _.orderBy(chartData, data => {
      const date = dayjs(data[labelsExpr], 'DD-MM-YYYY');
      if (date.isValid()) { return date; }
      return data[labelsExpr];
    });
  }

  getDataSetValue(chartData = this.chartData) {

    let groupedDataBasedOnLabels;
    const labelsExpr = _.get(this.chartConfig, 'labelsExpr');
    if (labelsExpr) {
      const sortedData = this.sortData(chartData, labelsExpr);
      groupedDataBasedOnLabels = _.groupBy(sortedData, (data) =>  ( data[labelsExpr] ? (_.trim(data[labelsExpr].toLowerCase()) ) : ''  ));
    }
    this.setChartLabels(groupedDataBasedOnLabels);
    this.datasets = [];
    const isStackingEnabled = this.checkForStacking();
    _.forEach(this.chartConfig.datasets, dataset => {
      const hidden = _.get(dataset, 'hidden') || false;
      const fill = _.isBoolean(_.get(dataset, 'fill')) ? _.get(dataset, 'fill') : true;
      const type = _.get(dataset, 'type');
      const lineThickness = _.get(dataset, 'lineThickness');
      const goalValue = _.get(dataset, 'goal');
      this.datasets.push({
        label: dataset.label,
        data: (goalValue && this.getGoalsDataset(chartData, +goalValue)) || (_.get(dataset, 'data') ||
          this.getData(groupedDataBasedOnLabels, dataset['dataExpr'], +_.get(dataset, 'top'))),
        hidden,
        fill,
        ...(isStackingEnabled) && { stack: _.get(dataset, 'stack') || 'default' },
        ...(type && { type }),
        ...(lineThickness) && { borderWidth: lineThickness }
      });
    });
    if (this.showGraphStats) {
      this.calculateGraphStats();
    }
  }

  private getGoalsDataset(chartData, goalValue: number) {
    return _.fill(chartData, goalValue);
  }

  private calculateGraphStats() {
    _.forEach(this.datasets, dataset => {
      this.resultStatistics[dataset.label] = {
        sum: _.sumBy(dataset.data, (val) => _.toNumber(val)).toFixed(2),
        min: _.minBy(dataset.data, (val) => _.toNumber(val)),
        max: _.maxBy(dataset.data, (val) => _.toNumber(val)),
        avg: dataset.data.length > 0 ? (_.sumBy(dataset.data, (val) => _.toNumber(val)) / dataset.data.length).toFixed(2) : 0
      };
    });
  }

  private getData(groupedDataBasedOnLabels, dataExpr, pickTopNElements: number) {

    const data = _.mapValues(groupedDataBasedOnLabels, value => {
      value = value.filter(element => {
        if (element[dataExpr]) {
          return element;
        }
      });
      return _.sumBy(value, (o) => +o[dataExpr]);
    });

    // Currently enabled for only pie charts
    if (this.chartType === 'pie' && pickTopNElements) {
      const sortedDataInDescOrder = _.orderBy(_.map(data, (val, key) => ({ key, val })), 'val', 'desc');
      const topNData = _.slice(sortedDataInDescOrder, 0, pickTopNElements);
      const restOfTheData = _.slice(sortedDataInDescOrder, pickTopNElements);
      const result = _.mapValues(_.keyBy(topNData, 'key'), 'val');
      result['others'] = _.sumBy(restOfTheData, 'val');
      this.setChartLabels(result); // set the labels as per the new dataset.
      return _.values(result);
    }
    return _.values(data);
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

  checkForStacking(): boolean {
    if (_.includes(['bar', 'horizontalbar'], _.toLower(this.chartType))) {
      // in case of bar chart check both the axes
      return _.get(this.chartOptions, 'scales.yAxes') && _.get(this.chartOptions, 'scales.xAxes') &&
        _.every(this.chartOptions.scales.yAxes, 'stacked') && _.every(this.chartOptions.scales.xAxes, 'stacked');
    } else if (_.toLower(this.chartType) === 'line') {
      // check for y axis only in case of line area chart
      return _.get(this.chartOptions, 'scales.yAxes') && _.every(this.chartOptions.scales.yAxes, 'stacked');
    }
    return false;
  }

  public addChartSummary(): void {
    const chartId = _.get(this.chartConfig, 'id');
    if (chartId) {
      this.openAddSummaryModal.emit({
        title: this.chartSummarylabel,
        type: 'chart',
        chartId,
        ...(this._chartSummary && { summary: this._chartSummary })
      });
    } else {
      this.toasterService.error('Chart id is not present');
    }
  }

  public getChartSummary() {
    const chartId = _.get(this.chartConfig, 'id');
    if (_.get(this.chartConfig, 'id')) {
      return this.reportService.getLatestSummary({
        reportId: this.activatedRoute.snapshot.params.reportId, chartId,
        ...(this.hash && { hash: this.hash })
      }).pipe(
        map(chartSummary => {
          this._chartSummary = '';
          return _.map(chartSummary, summaryObj => {
            const summary = _.get(summaryObj, 'summary');
            this._chartSummary = summary;

            if (summary) {
              this.chartSummarylabel = _.get(this.resourceService, 'frmelmnts.lbl.updateChartSummary');
            }

            return {
              label: _.get(this.resourceService, 'frmelmnts.lbl.chartSummary'),
              text: [summary],
              createdOn: _.get(summaryObj, 'createdon')
            };
          });
        })
      );
    } else {
      return of([]);
    }
  }

   // use getter setter to define the property
   get globalFilter(): any {
    return this._globalFilter;
  }

  @Input()
  set globalFilter(val: any) {
    if (val && val.chartData) {
      const updatedChartData = val.chartData.filter(chart => {
        if (chart && chart.id) {
          if (this.chartConfig['id'] == chart.id) {
            return chart.data;
          }
        }
      });

      if (updatedChartData && updatedChartData[0] &&  updatedChartData[0].data) {
        delete updatedChartData[0].data['selectedFilters'];
        this.chartData = updatedChartData[0].data;
        this.cdr.detectChanges();
        this.getDataSetValue(updatedChartData[0].data);
        this.calculateBigNumber(updatedChartData[0].data);
        this.resetForm();

      }

    }
  }

  public filterChanged(data: any): void {
    this.cdr.detectChanges();
    this.currentFilters = data.filters;
    const keys = Object.keys(this.currentFilters);
    this.dateFilters = [];
    this.filters.map(ele => {
        if (ele && ele['controlType'].toLowerCase() == 'date') {
          keys.map(item => {
            if (item == ele['reference']) {
              this.dateFilters.push(item);
            }
          });
        }
    });

    if (data.filters) {
      this.chartData['selectedFilters'] = data.filters;
    } else {
      this.chartData['selectedFilters'] = {};
    }
    this.getDataSetValue(data.chartData[0].data);
    this.calculateBigNumber(data.chartData[0].data);
  }
  public graphStatsChange(data: any): void {
    this.showStats = data;
  }
  changeChartType(chartType) {
    this.chartType = _.lowerCase(_.get(chartType, 'value'));
  }
  filterModalPopup(operator) {

    if (operator == false) {
      this.closeDialog();
      this.cdr.detectChanges();
    } else {
      if (this.currentFilters) {
        this.chartData['selectedFilters'] = this.currentFilters;
        this.resetFilters = { data: this.chartData, reset: true };
      } else {
        this.chartData['selectedFilters'] = {};
      }
      this.cdr.detectChanges();
      this.openDialog();
    }

  }

  resetForm() {
    this.chartData['selectedFilters'] = {};
    this.resetFilters = { data: this.chartData, reset: true };
    this.currentFilters = [];
  }
  checkFilterReferance(element) {
    if (this.dateFilters && this.dateFilters.includes(element)) {
      return true;
    } else {
      return false;
    }
  }
  getChartData() {
    return [{ id: this.chartConfig.id , data: this.chartData , selectedFilters: this.currentFilters }];
  }
  openDialog() {
    if (this.filterPopUpMat) {
      this.dialogRef = this.dialog.open(this.filterPopUpMat, {
        data: this.chartData['selectedFilters'],
        panelClass: 'material-modal'
      });
    }
  }
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
