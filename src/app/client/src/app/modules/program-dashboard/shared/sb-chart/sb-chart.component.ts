import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService } from '@sunbird/shared';
import * as _ from "lodash-es";
import { PdServiceService } from '../services/pd-service/pd-service.service';
import dayjs from 'dayjs';
@Component({
  selector: 'app-sb-chart',
  templateUrl: './sb-chart.component.html',
  styleUrls: ['./sb-chart.component.scss'],
})
export class SbChartComponent implements OnInit, OnChanges {
  @Input() chart;
  lastUpdatedOn;
  @Input() hideElements = false;
  @Input() appliedFilters;
  chartData;
  chartConfig;
  currentFilters: Array<{}>;
  resetFilters;
  updatedData;
  type: string;
  globalChange: boolean;
  globalData;
  selectedFilters: {};
  loadash = _;
  availableChartTypeOptions = ['Bar', 'Line'];
  @ViewChild('lib', { static: false }) lib: any;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  filterType = 'chart-filter';
  dialogRef: any;
  showLastUpdatedOn: boolean = false;
  constructor(
    public resourceService: ResourceService,
    public dialog: MatDialog,
    public filterService:PdServiceService
  ) { }

  ngOnInit() {
    this.updatedData = this.chartData = _.compact(this.chart.chartData);
    this.chartConfig = _.cloneDeep(this.chart.chartConfig);
    this.type = this.chartConfig.chartType;
    if(_.get(this.chart,'lastUpdatedOn')){
      this.lastUpdatedOn = dayjs(this.chart.lastUpdatedOn).format('DD-MMMM-YYYY');
      if (_.get(this.chartConfig, 'options.showLastUpdatedOn') || this.lastUpdatedOn) {
        this.showLastUpdatedOn = true;
      }
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.checkForGlobalChanges();
  }

  checkForGlobalChanges() {
    if (Object.keys(this.appliedFilters).length) {
      this.globalData = this.filterService.getFilteredData(this.chartData,this.appliedFilters)
      this.currentFilters = [];
      this.globalChange = true;
      this.updatedData = this.globalData;
      this.lib.instance.update({ data: this.globalData });
    } else {
      this.globalChange = false;
      this.updatedData = this.chartData
      this.lib?.instance?.update({ data: this.chartData });
    }
  }

  changeChartType(change) {
    this.type = _.lowerCase(_.get(change, 'value'));
    this.chartConfig['chartType'] = this.type;
    this.chartConfig.filters.map(data => {
      delete data?.options
    })
    this.lib.instance.update({ data: this.updatedData, type: this.type, config: this.chartConfig })
  }

  filterChanged(data: any): void {
    this.currentFilters = data.filters;
    if (data.filters) {
      if (this.globalChange) {
        this.globalData['selectedFilters'] = data.filters
      } else {
        this.chartData['selectedFilters'] = data.filters
      }
    } else {

      if (this.globalChange) {
        this.globalData['selectedFilters'] = {}
      } else {
        this.chartData['selectedFilters'] = {}
      }
      this.resetFilters = { data: (this.globalChange ? this.globalData : this.chartData), reset: true };
    }
    this.updatedData = data.chartData[0].data;
    this.lib.instance.update({ data: this.updatedData });

  }

  resetForm() {
    this.chartData['selectedFilters'] = {};
    if (this.globalChange) { this.globalData['selectedFilters'] = {}; }
    this.currentFilters = [];
    this.updatedData = this.globalChange ? this.globalData : this.chartData
    this.resetFilters = { data: (this.globalChange ? this.globalData : this.chartData), reset: true };
    this.lib.instance.update({ data: this.updatedData });
  }

  filterModalPopup(operator) {
    if (operator === false) {
      this.closeDialog();
    } else {
      if (this.currentFilters) {
        let dashletData;
        if (this.globalChange) {
          this.globalData['selectedFilters'] = this.currentFilters;
          dashletData = this.globalData;
        } else {
          this.chartData['selectedFilters'] = this.currentFilters;
          dashletData = this.chartData;
        }
        this.resetFilters = { data: dashletData, reset: true };
      } else {
        if(this.globalChange){
          this.globalData['selectedFilters'] = {}
        }else{
          this.chartData['selectedFilters'] = {}
        }
      }
      this.openDialog();
    }

  }


  openDialog() {
    if (this.filterPopUpMat) {
      this.dialogRef = this.dialog.open(this.filterPopUpMat, {
        data: (this.globalChange ? this.globalData['selectedFilters'] : this.chartData['selectedFilters'])
      });
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}