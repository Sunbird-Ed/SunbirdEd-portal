import { Component, OnInit, EventEmitter, Input, Output, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Inject} from '@angular/core';
import { IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService} from '@sunbird/shared';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { distinctUntilChanged, map, debounceTime, takeUntil } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() hideElements = false;
  @Input() chartData: any;
  @Input() filters: any;
  @Input() telemetryInteractObject: IInteractEventObject;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() filterType: string;
  filtersFormGroup: UntypedFormGroup;
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
  dateFilters: Array<string>;
  public unsubscribe = new Subject<void>();
  previousFilters: any;
  formChartData: any = [];
  currentReference: any;
  firstFilter: any;
  errorMessage: any;

  @Input()
  set selectedFilter(val: any) {
    if (val) {
      this.selectedFilters = {};
      if (val.filters) {
        this.filters = val.filters;
      }
      this.formGeneration(val.data);
      if (val.selectedFilters) {
        this.selectedFilters = val.selectedFilters;
        this.filtersFormGroup.setValue(val.selectedFilters);
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
        if (val.reset && val.reset == true) {
          this.selectedFilters = {};
        } else if (val.filters) {
          this.filtersFormGroup.setValue(val.filters);
          this.selectedFilters = val.filters;
        } else if (currentFilterValue) {
          this.filtersFormGroup.setValue(currentFilterValue);
          this.selectedFilters = currentFilterValue;
        }
    }
  }

  ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  };
  @ViewChild('datePickerForFilters') datepicker: ElementRef;
  @ViewChild('matAutocomplete') matAutocomplete: MatAutocomplete;
  filterQuery: any;

  constructor(
    public resourceService: ResourceService,
    private fb: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public selectedDialogData: any
  ) {

  }


  ngOnInit() {
    const charts = [];
    if (this.chartData && this.chartData.length > 0) {
      this.chartData.map(function(data) {
        charts.push(...data.data);
        return data.data;
      });
    }
    this.formChartData = charts;
    if (this.filters) {
      this.buildFiltersForm();
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  formUpdate(chartData) {
    const filterKeys = Object.keys(this.selectedFilters);
    let previousKeys = [];
    if (this.previousFilters) {
      previousKeys = Object.keys(this.previousFilters);
    }
    _.forEach(this.filters, filter => {
      const { reference } = filter;
      const options = (_.sortBy(_.uniq(
        _.map(chartData, (data) => (data && data[reference]) ? data[reference].toLowerCase() : ''
        )))).filter(Boolean);
        if(this.firstFilter && this.firstFilter[0] !== reference){
          if (this.selectedFilters[reference] && this.selectedFilters[reference].length > 0) {
            this.selectedFilters[reference] = options;
          }   
          if (this.currentReference !== reference) {
            filter.options = options;
          }
        }

      if (!filterKeys.includes(reference)) {
        filter.options = options;
      }else if(previousKeys && previousKeys.includes(reference) && this.previousFilters && this.previousFilters[reference].length == this.selectedFilters[reference].length) {
        if (options.length > filter.options) {
          filter.options = options;
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
          this.pickerMinDate = dayjs(dateRange[0], 'DD-MM-YYYY');
          this.pickerMaxDate = dayjs(dateRange[dateRange.length - 1], 'DD-MM-YYYY');
          this.dateFilterReferenceName = filter.reference;
        }
        this.filtersFormGroup.addControl(_.get(filter, 'reference'), this.fb.control(''));
        filter.options = (_.sortBy(_.uniq(
          _.map(chartData, (data) => (data && data[filter.reference]) ? data[filter.reference].toLowerCase() : ''
          )))).filter(Boolean);

      });

  }

  buildFiltersForm() {
    this.formGeneration(this.formChartData);
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
      });
      if (this.chartData.selectedFilters) {
        const tempSelectedFilters = {...this.chartData.selectedFilters}
        setTimeout(() => {
          for(let [key,value] of Object.entries(tempSelectedFilters)){
            this.filtersFormGroup.controls[key].setValue(value)
          }
        },50)
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
    if (this.filtersFormGroup) {
      this.filtersFormGroup.reset();
      this.selectedDialogData = {};
    }
    if (this.datepicker) {
      this.datepicker.nativeElement.value = '';
    }
    this.selectedFilters = null;
    this.firstFilter = null;
    this.previousFilters = null;
    this.showFilters = false;
    this.cdr.detectChanges(); // to fix change detection issue in sui select
    this.showFilters = true;
  }

  getDateRange({ startDate, endDate }, columnRef) {
    this.selectedStartDate = dayjs(startDate).subtract(1, 'day');
    this.selectedEndDate = dayjs(endDate);
    const dateRange = [];
    const dateDiff = this.selectedEndDate.diff(this.selectedStartDate, 'd');
    for (let i = 0; i < dateDiff; i++) {
      dateRange.push(dayjs(startDate).add(i, 'days').format('DD-MM-YYYY'))
    }
    this.filtersFormGroup.get(columnRef).setValue(dateRange);
  }

  checkDependencyFilters(){
    _.map(this.filters, filter => {
      const {reference,dependency} = filter;
      if(dependency &&  !_.has(this.selectedFilters, `${dependency.reference}`) && _.has(this.selectedFilters, `${reference}`)){
        this.filtersFormGroup.controls[reference].setValue('')
        delete this.selectedFilters[reference]
      }
    })
  }

  filterData() {
    if (this.selectedFilters) {
      const filterKeys = Object.keys(this.selectedFilters);
      if((!this.previousFilters || Object.keys(this.previousFilters).length === 0)&& Object.keys(this.selectedFilters).length === 1){
        this.firstFilter = Object.keys(this.selectedFilters);
      }

    this.checkDependencyFilters();
     
    if(this.firstFilter && this.firstFilter.length && !filterKeys.includes(this.firstFilter[0])){
      this.chartData['selectedFilters'] = {};
      this.filterChanged.emit({
        allFilters: this.filters,
        filters: {},
        chartData: this.chartData,
      });
      this.showFilters = false;
      this.resetFilter();
      this.cdr.detectChanges();
      this.showFilters = true;
      return;
    }
      const filterData = [];
      const filteredChartData = [];
      this.chartData.forEach(chart => {

        const id = chart.id;
        delete chart?.id;
        delete chart?.data?.selectedFilters;
        delete chart?.data?.id;
        const result: Array<{}> = _.filter(chart.data, data => {
            return _.every(this.selectedFilters, (filterValues, key) => {
              if (data && data[key]) {
                return _.some(filterValues, filterValue => _.trim(_.toLower(filterValue)) === _.trim(_.toLower(_.get(data, key))));
              }
            });

        });
        
        filteredChartData.push({ id: id, data: result });
        result['selectedFilters'] = this.selectedFilters;
        filterData.push(...result);
      });

      this.formUpdate(filterData);
      const keys = Object.keys(this.selectedFilters);
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

      this.filterChanged.emit({
        allFilters: this.filters,
        filters: this.selectedFilters,
        chartData: filteredChartData,
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
  checkFilterReferance(element) {
    if (this.dateFilters && this.dateFilters.includes(element)) {
      return true;
    } else {
      return false;
    }
  }
  autoCompleteChange(data, reference) {
    const object = {};
    if (data && data.length > 0) {
      object[reference] = data;
      this.currentReference = reference;
    }
    if (this.selectedDialogData) {
      for (const key in this.selectedDialogData) {
        if (key != reference) {
          this.filtersFormGroup.controls[key].setValue(this.selectedDialogData[key]);
        }
      }
    }
    this.filtersFormGroup.controls[reference].setValue(data);
  }
  getSelectedData(reference) {
    if (Object.keys(this.selectedDialogData).length && this.selectedDialogData[reference]) {
      return this.selectedDialogData[reference];
    } else if (this.selectedFilters && this.selectedFilters[reference]) {
      return this.selectedFilters[reference];
    } else {
      return [];
    }
  }


  getFilters(options) {
    if (this.filterQuery && this.filterQuery != '') {
      return options.filter(opt =>
        opt.toLowerCase().indexOf(this.filterQuery.toLowerCase()) === 0);
    } else {
      return options;
    }
  }

  chooseOption(): void {
    this.matAutocomplete.options.first.select();
  }

  getFiltersValues(filter) {
   return Array.isArray(filter) ? filter : [filter];
  }

  showErrorMessage(event){
    const regex = /{displayName}/g
    this.errorMessage = event?.displayName ? this.resourceService?.frmelmnts?.lbl?.selectDependentFilter.replace(regex, event.displayName): undefined;
  }

}