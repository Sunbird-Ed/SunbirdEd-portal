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
  selector: 'app-global-filter',
  templateUrl: './global-filter.component.html',
  styleUrls: ['./global-filter.component.scss']
})
export class GlobalFilterComponent implements OnInit {

  @Input() showFilters:any;
  @Input() chartData:any;
  
  @Input() filters:any;
  filtersFormGroup: FormGroup;
  @Input() telemetryInteractObject: IInteractEventObject;
  datasets: any;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('datePickerForFilters') datepicker: ElementRef;

  pickerMinDate: any; // min date that can be selected in the datepicker
  pickerMaxDate: any; // max date that can be selected in datepicker
  dateFilterReferenceName;
  filtersSubscription: Subscription;
  public unsubscribe = new Subject<void>();
  selectedFilters:any;

  constructor(
    public resourceService: ResourceService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute
    ){

     }

  
  ngOnInit() {

    if (this.filters) {
      this.showFilters = false;
      this.buildFiltersForm();
    }
  }


  buildFiltersForm() {
    debugger;
    this.filtersFormGroup = this.fb.group({});
    console.log(" global this.chartDat",this.chartData);
   
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
      // console.log("--------------data-------",data);
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

          console.log("selectedFilters",this.selectedFilters);
          // const res: Array<{}> = _.filter(this.chartData, data => {
          //   return _.every(filters, (value, key) => {
          //     return _.includes(_.toLower(value), data[key].toLowerCase());
          //   });
          // });

          this.filterChanged.emit({
            filters:   this.selectedFilters,
          });

          // console.log("res",res);
          // this.noResultsFound = (res.length > 0) ? false : true;
          // if (this.noResultsFound) {
          //   this.toasterService.error(this.resourceService.messages.stmsg.m0008);
          // }
          // this.getDataSetValue(res);

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
}
