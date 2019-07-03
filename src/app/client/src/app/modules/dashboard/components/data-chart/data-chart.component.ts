import { ResourceService, ToasterService } from '@sunbird/shared';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit {

  @Input() chartInfo: any;
  // contains the chart configuration
  chartConfig;
  chartData;

  chartType;
  chartColors;
  legend;
  chartOptions;

  datasets;
  chartLabels = [];
  filters: Array<{}>;
  filtersFormGroup: FormGroup;
  showFilters: Boolean = false;
  filtersSubscription: Subscription;
  noResultsFound: Boolean;

  pickerMinDate: Date;
  pickerMaxDate: Date;
  selectedStartDate;
  selectedEndDate;

  @ViewChild(BaseChartDirective) chartDirective: BaseChartDirective;
  constructor(public resourceService: ResourceService, private cdr: ChangeDetectorRef, private fb: FormBuilder, private toasterService: ToasterService) { }

  ngOnInit() {
    this.chartConfig = _.get(this.chartInfo, 'chartConfig');
    this.chartData = _.get(this.chartInfo, 'chartData');
    this.prepareChart();
    if (this.filters) {
      this.buildFiltersForm();
    }
  }

  selectStartDate(time) {
    // let res = _.filter(this.chartData, data => {
    //   if (moment(moment(data['Date'], 'DD-MM-YYYY').toDate()).isBefore(time)) {
    //     return true; ``
    //   }
    //   return false;
    // })
    // this.getDataSetValue(res);
  }

  selectEndDate(time) {
    // this.selectedEndDate = moment(time, 'YYYY-MM-DD').format('DD-MM-YYYY');

    // if (!this.selectedStartDate) {

    // } else {
    // }
  }

  buildFiltersForm() {
    this.filtersFormGroup = this.fb.group({});
    _.forEach(this.filters, filter => {
      if (/date/i.test(_.get(filter, 'reference'))) {
        this.pickerMinDate = moment(this.chartLabels[0], 'DD-MM-YYYY').toDate();
        this.pickerMaxDate = moment(this.chartLabels[this.chartLabels.length - 1], 'DD-MM-YYYY').toDate();
      }
      this.filtersFormGroup.addControl(_.get(filter, 'reference'), this.fb.control(''));
      filter.options = _.uniq(_.map(this.chartData, filter.reference));
    })
    this.showFilters = true;
    this.filtersSubscription = this.filtersFormGroup.valueChanges
      .pipe(
        map(filters => {
          return _.omitBy(filters, _.isEmpty);
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((filters) => {
        let res: Array<{}> = _.filter(this.chartData, data => {
          return _.every(filters, (value, key) => {
            return _.includes(value, data[key]);
          })
        });
        this.noResultsFound = (res.length > 0) ? false : true;
        if (this.noResultsFound) {
          this.toasterService.error('No results found with applied filters');
        }
        this.getDataSetValue(res);

      }, (err) => {
        console.log(err)
      })
  }

  prepareChart() {
    this.chartOptions = _.get(this.chartConfig, 'options') || { responsive: true };
    this.chartColors = _.get(this.chartConfig, 'colors') || ['#024F9D'];
    this.chartType = _.get(this.chartConfig, 'chartType') || 'line';
    this.legend = (_.get(this.chartConfig, 'legend') === false) ? false : true;
    this.filters = _.get(this.chartConfig, 'filters');
    this.getDataSetValue();
  }

  getDataSetValue(chartData = this.chartData) {
    let groupedDataBasedOnLabels = _.groupBy(chartData, _.get(this.chartConfig, 'labelsExpr'));
    this.chartLabels = _.uniq(_.map(chartData, _.get(this.chartConfig, 'labelsExpr')));
    this.datasets = [];
    _.forEach(this.chartConfig.datasets, dataset => {
      this.datasets.push({
        label: dataset.label,
        data: _.get(dataset, 'data') || this.getData(groupedDataBasedOnLabels, dataset["dataExpr"]),
        hidden: _.get(dataset, 'hidden') || false
      });
    });
  }

  getData(groupedDataBasedOnLabels, dataExpr) {
    let data = _.mapValues(groupedDataBasedOnLabels, value => {
      return _.sumBy(value, (o) => +o[dataExpr])
    })
    return _.values(data);
  }

  resetFilter() {
    this.filtersFormGroup.reset();
  }
}
