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
  @Input() chartType: any;
  @Input() showGraphStats;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() graphStatsChange: EventEmitter<any> = new EventEmitter<any>();

  availableChartTypeOptions = ['Bar', 'Line'];
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
  
  public unsubscribe = new Subject<void>();
  private _selectedFilter; // private property _item
  private _resetFilters;

  // use getter setter to define the property
  get selectedFilter(): any {
    return this._selectedFilter;
  }

  @Input()
  set selectedFilter(val: any) {
    if (val) {

      this.selectedFilters = {};
      this.resetFilter();
      this.formGeneration(val.data);
    }
  }

  get resetFilters(): any {
    return this._resetFilters;
  }

  @Input()
  set resetFilters(val: any) {
    if (val) {
        // to apply current filters to new updated chart data;
        const currentFilterValue = _.get(this.filtersFormGroup, 'value');
        this.resetFilter();
        this.formGeneration(val.data);
        this.filtersFormGroup.patchValue(currentFilterValue);
        this.selectedFilters = currentFilterValue;
    
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
  @ViewChild('datePickerForFilters') datepicker: ElementRef;

  constructor(
    public resourceService: ResourceService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }

  statsChange($event){
    this.graphStatsChange.emit($event);
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

  formGeneration(chartData) {
    _.forEach(this.filters, filter => {
      if (filter.controlType === 'date' || /date/i.test(_.get(filter, 'reference'))) {
        const dateRange = _.uniq(_.map(chartData, _.get(filter, 'reference')));
        this.pickerMinDate = moment(dateRange[0], 'DD-MM-YYYY');
        this.pickerMaxDate = moment(dateRange[dateRange.length - 1], 'DD-MM-YYYY');
        this.dateFilterReferenceName = filter.reference;
      }
      this.filtersFormGroup.addControl(_.get(filter, 'reference'), this.fb.control(''));
      filter.options = _.sortBy(_.uniq(_.map(chartData, data => data[filter.reference].toLowerCase())));

    });
  }

  buildFiltersForm() {
    this.filtersFormGroup = this.fb.group({});
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
        // this.selectedFilters = _.omit(filters, this.dateFilterReferenceName); // to omit date inside labels
        this.filterData();

      }, (err) => {
        console.log(err);
      });

  }

  setTelemetryInteractEdata(val) {
    return {
      id: _.join(_.split(val, ' '), '-').toLowerCase(),
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  changeChartType(chartType) {
    this.chartType = _.lowerCase(chartType);
    this.filterData();
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
        return _.every(this.selectedFilters, (value, key) => {
          return _.includes(_.toLower(value), data[key].toLowerCase());
        });
      });
      this.filterChanged.emit({
        filters: this.selectedFilters,
        chartData: res,
        chartType: this.chartType
      });
    } else {
      this.filterChanged.emit({
        filters: {},
        chartData: this.chartData,
        chartType: this.chartType
      });
    }
    
  }

}
