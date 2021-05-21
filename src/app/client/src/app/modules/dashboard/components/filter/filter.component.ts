import { Component, OnInit, EventEmitter, Input, Output, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService } from '@sunbird/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { distinctUntilChanged, map, debounceTime, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() hideElements: boolean = false;
  @Input() chartData: any;
  @Input() filters: any;
  @Input() telemetryInteractObject: IInteractEventObject;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() filterType:string;

  filtersFormGroup: FormGroup;
  chartLabels: any = [];
  chartConfig: any;
  pickerMinDate: any; // min date that can be selected in the datepicker
  pickerMaxDate: any; // max date that can be selected in datepicker
  dateFilterReferenceName;
  filtersSubscription: Subscription;
  selectedFilters: {};
  noResultsFound: Boolean;
  resultStatistics = {};
  selectedStartDate: any;
  selectedEndDate: any;
  loadash = _;
  showFilters: Boolean = true;
  dateFilters:Array<string>;
  public unsubscribe = new Subject<void>();
  previousFilters: any;

  @Input()
  set selectedFilter(val: any) {
    if (val) {
      this.selectedFilters = {};
      if(val.filters){
        this.filters = val.filters;
      }
      this.formGeneration(val.data);
      if(val.selectedFilters){
        this.selectedFilters = val.selectedFilters;
        this.filtersFormGroup.patchValue(val.selectedFilters);
      }
    }
  }


  @Input()
  set resetFilters(val: any) {
    if (val) {
        const currentFilterValue = _.get(this.filtersFormGroup, 'value');
        this.resetFilter();
        this.chartData = val.data;
        this.buildFiltersForm();
        if(val.reset && val.reset==true){
          this.selectedFilters = {};
        }
        else if(val.filters){
          this.filtersFormGroup.patchValue(val.filters);
          this.selectedFilters = val.filters;
        } else if(currentFilterValue){
          this.filtersFormGroup.patchValue(currentFilterValue);
          this.selectedFilters = currentFilterValue;
        }
    }
  }

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  @ViewChild('datePickerForFilters',{static: false}) datepicker: ElementRef;

  constructor(
    public resourceService: ResourceService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }


  ngOnInit() {
    if (this.filters) {
      this.buildFiltersForm();
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  formUpdate(chartData){
    let filterKeys = Object.keys(this.selectedFilters);
    let previousKeys = [];
    if (this.previousFilters) {
      previousKeys = Object.keys(this.previousFilters);
    }
    _.forEach(this.filters, filter => {
      let options = (_.sortBy(_.uniq(
        _.map(chartData, (data) => data[filter.reference] ? data[filter.reference].toLowerCase() : ""
        )))).filter(Boolean);

      if (!filterKeys.includes(filter.reference)) {
        filter.options = options;
      } else {
        if (previousKeys && previousKeys.includes(filter.reference) && this.previousFilters && this.previousFilters[filter.reference].length == this.selectedFilters[filter.reference].length) {
          filter.options = options
        }
      }
    });
    this.previousFilters = this.selectedFilters;
  }
  formGeneration(chartData) {

      this.filtersFormGroup = this.fb.group({});
      _.forEach(this.filters, filter => {

        if (filter.controlType === 'date' || /date/i.test(_.get(filter, 'reference'))) {
          const dateRange = _.uniq(_.map(chartData, _.get(filter, 'reference')));
          this.pickerMinDate = moment(dateRange[0], 'DD-MM-YYYY');
          this.pickerMaxDate = moment(dateRange[dateRange.length - 1], 'DD-MM-YYYY');
          this.dateFilterReferenceName = filter.reference;
        }
        this.filtersFormGroup.addControl(_.get(filter, 'reference'), this.fb.control(''));
        filter.options = (_.sortBy(_.uniq(
          _.map(chartData, (data) => data[filter.reference] ? data[filter.reference].toLowerCase() : ""
          )))).filter(Boolean);

      });
   
  }

  buildFiltersForm() {
    this.formGeneration(this.chartData);
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
        this.selectedFilters = filters;
        this.filterData();
      }, (err) => {
        console.log(err);
      });
      if(this.chartData.selectedFilters){
          this.filtersFormGroup.patchValue(this.chartData.selectedFilters);
      }

  }

  setTelemetryInteractEdata(val) {
    return {
      id: _.join(_.split(val, ' '), '-').toLowerCase(),
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  resetFilter() {
    if(this.filtersFormGroup){
      this.filtersFormGroup.reset();
    }
    if (this.datepicker) {
      this.datepicker.nativeElement.value = '';
    }
    this.showFilters = false;
    this.cdr.detectChanges(); // to fix change detection issue in sui select
    this.showFilters = true;
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

  filterData() {
    if (this.selectedFilters) {
      const res: Array<{}> = _.filter(this.chartData, data => {
        return _.every(this.selectedFilters, (filterValues, key) => {
          if(data[key]){
            return _.some(filterValues, filterValue => _.trim(_.toLower(filterValue)) === _.trim(_.toLower(_.get(data, key))));
          }
        });
      });
      this.formUpdate(res);

      let keys = Object.keys(this.selectedFilters);
      this.dateFilters = [];
      this.filters.map(ele=>{
          if(ele && ele['controlType'].toLowerCase()=="date"){
            keys.map(item=>{
              if(item==ele['reference']){
                this.dateFilters.push(item);
              }
            })
          }
      });


      this.filterChanged.emit({
        allFilters:this.filters,
        filters: this.selectedFilters,
        chartData: res,
      });
    } else {
      this.dateFilters = [];
      this.filterChanged.emit({
        allFilters: this.filters,
        filters: {},
        chartData: this.chartData,
      });
    }

  }
  checkFilterReferance(element){
    if(this.dateFilters && this.dateFilters.includes(element)){
      return true
    } else {
      return false
    }
  }


}
