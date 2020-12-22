import { Component, OnInit,EventEmitter,Input, Output,OnDestroy, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, timer, of } from 'rxjs';
import { distinctUntilChanged, map, debounceTime, takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  // @Input() charts:any;

  @Input() chartInfo: any;
  @Input() showFilters:any;
  @Input() showChart: any;
  @Input() hideElements = false;
  @Input() filters:any;
  // @Input() resourceService: any;
  @Input() telemetryInteractObject: IInteractEventObject;
  @Input() chartType:any;
  // @Input() globalSelectedFilters:any;
  availableChartTypeOptions = ['Bar', 'Line'];
  filtersFormGroup: FormGroup;
  // filters: Array<{}>;
  chartConfig: any;
  chartData: any;
  pickerMinDate: any; // min date that can be selected in the datepicker
  pickerMaxDate: any; // max date that can be selected in datepicker
  dateFilterReferenceName;
  filtersSubscription: Subscription;
  public unsubscribe = new Subject<void>();
  selectedFilters: {};
  noResultsFound: Boolean;
  datasets: any;
  chartOptions: any;
  showGraphStats: Boolean = false;
  resultStatistics = {};
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('datePickerForFilters') datepicker: ElementRef;

  private _globalSelectedFilters; // private property _item

  // use getter setter to define the property
  get globalFilter(): any { 
    return this._globalSelectedFilters;
  }
  
  @Input()
  set globalFilter(val: any) {
    console.log('child previous item = ', this._globalSelectedFilters);
    console.log('currently selected item=', val);
    this._globalSelectedFilters = val;
    // this._item.status = 'In Process';
    console.log(this.filtersFormGroup,"sort data",this.filtersFormGroup.controls);

    
    this.filterData(this._globalSelectedFilters.filters);

    

  }


  constructor(
    public resourceService: ResourceService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private cdr: ChangeDetectorRef
    ){

     }

  ngOnInit() {

    // this.charts.forEach(element => {
      
    // });

    this.chartConfig = _.get(this.chartInfo, 'chartConfig');
    this.chartData = _.get(this.chartInfo, 'chartData');


    if (this.filters) {
      this.showFilters = false;
      this.buildFiltersForm();
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  buildFiltersForm() {
    debugger;
    this.filtersFormGroup = this.fb.group({});

    console.log("this.chartDat",this.chartData);
    
    if (_.get(this.chartConfig, 'labelsExpr')) {
      _.forEach(this.filters, filter => {
        if (filter.controlType === 'date' || /date/i.test(_.get(filter, 'reference'))) {
          const dateRange = _.uniq(_.map(this.chartData, _.get(filter, 'reference')));
          this.pickerMinDate = moment(dateRange[0], 'DD-MM-YYYY');
          this.pickerMaxDate = moment(dateRange[dateRange.length - 1], 'DD-MM-YYYY');
          this.dateFilterReferenceName = filter.reference;
        }
        this.filtersFormGroup.addControl(_.get(filter, 'reference'), this.fb.control(''));
        filter.options = _.sortBy(_.uniq(_.map(this.chartData, data => data[filter.reference].toLowerCase())));

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

          console.log("filters ---",filters);
          if(this._globalSelectedFilters && this._globalSelectedFilters.filters){
            filters.push(...this._globalSelectedFilters.filters);
          }
          
          const res: Array<{}> = _.filter(this.chartData, data => {
            return _.every(filters, (value, key) => {
              return _.includes(_.toLower(value), data[key].toLowerCase());
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

  setTelemetryInteractEdata(val) {
    return {
      id: _.join(_.split(val, ' '), '-').toLowerCase(),
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  getDataSetValue(chartData = this.chartData) {
    let groupedDataBasedOnLabels;
    const labelsExpr = _.get(this.chartConfig, 'labelsExpr');
    if (labelsExpr) {
      const sortedData = this.sortData(chartData, labelsExpr);
      groupedDataBasedOnLabels = _.groupBy(sortedData, (data) => _.trim(data[labelsExpr].toLowerCase()));
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

    
    this.filterChanged.emit({
      datasets:   this.datasets,
      chartType: this.chartType
    });
    if (this.showGraphStats) {
      this.calculateGraphStats();
    }
  }

  private sortData(chartData, labelsExpr) {
    return _.orderBy(chartData, data => {
      const date = moment(data[labelsExpr], 'DD-MM-YYYY');
      if (date.isValid()) { return date; }
      return data[labelsExpr];
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

    // this.chartLabels = labels;
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
  private getGoalsDataset(chartData, goalValue: number) {
    return _.fill(chartData, goalValue);
  }

  private getData(groupedDataBasedOnLabels, dataExpr, pickTopNElements: number) {

    const data = _.mapValues(groupedDataBasedOnLabels, value => {
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
  changeChartType(chartType) {
    this.chartType = _.lowerCase(chartType);

    this.filterChanged.emit({
      datasets:   this.datasets,
      chartType: this.chartType
    });
  }
  resetFilter() {
    this.filtersFormGroup.reset();
    if (this.datepicker) {
      this.datepicker.nativeElement.value = '';
    }
    this.showFilters = false;
    this.cdr.detectChanges(); // to fix change detection issue in sui select
    this.showFilters = true;
  }

  filterData(filters){
    console.log("this.filtersFormGroup.controls.value ---",this.filtersFormGroup.controls.value);
    //       if(this._globalSelectedFilters && this._globalSelectedFilters.filters){
    //         filters.push(...this._globalSelectedFilters.filters);
    //       }

    if(this.filtersFormGroup.controls){

      let kesys = Object.keys(this.filtersFormGroup.controls);
      console.log("keys",kesys);
      // filters.push(...);
      
    }
          
          const res: Array<{}> = _.filter(this.chartData, data => {
            return _.every(filters, (value, key) => {
              return _.includes(_.toLower(value), data[key].toLowerCase());
            });
          });
          this.noResultsFound = (res.length > 0) ? false : true;
          if (this.noResultsFound) {
            this.toasterService.error(this.resourceService.messages.stmsg.m0008);
          }
          this.getDataSetValue(res);
  }

}
