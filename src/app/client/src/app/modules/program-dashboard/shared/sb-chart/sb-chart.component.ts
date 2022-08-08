import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService } from '@sunbird/shared';
import * as _ from "lodash-es";
@Component({
  selector: 'app-sb-chart',
  templateUrl: './sb-chart.component.html',
  styleUrls: ['./sb-chart.component.scss'],
})
export class SbChartComponent implements OnInit,OnChanges{
  @Input() chart;
  @Input() lastUpdatedOn;
  @Input() hideElements = false;
  @Input() globalDistrict;
  @Input() globalOrg;  
  chartData;
  chartConfig;
  currentFilters: Array<{}>;
  resetFilters;
  updatedData;
  type:string;
  globalChange:boolean;
  globalData;
  selectedFilters: {};
  loadash = _;
  availableChartTypeOptions = ['Bar', 'Line'];
  @ViewChild('lib', { static: false }) lib: any;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  filterType = 'chart-filter';
  dialogRef: any;
  constructor(
    public resourceService: ResourceService,
    public dialog: MatDialog
    ) { }

  ngOnInit(){
    this.updatedData = this.chartData = _.compact(this.chart.chartData);
    this.chartConfig = this.chart.chartConfig;
    this.type = this.chartConfig.chartType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkForGlobalChanges();
  }

  checkForGlobalChanges(){
    if(this.globalDistrict !== undefined || this.globalOrg !== undefined){
      this.globalData = _.filter(this.chartData,(data)=>{
        return (this.globalDistrict && this.globalOrg 
          ? data?.district_externalId == this.globalDistrict && data?.organisation_id == this.globalOrg 
          : this.globalDistrict ? data?.district_externalId == this.globalDistrict
          :this.globalOrg ? data?.organisation_id == this.globalOrg 
          : data)
    });
    this.currentFilters = [];
    this.globalChange = true;
    this.updatedData = this.globalData;
    this.lib.instance.update({data:this.globalData});
    }else{
      this.globalChange = false;
      this.updatedData = this.chartData
      this.lib?.instance?.update({data:this.chartData});
    }
  }
  
  changeChartType(change) {
    this.type = _.lowerCase(_.get(change, 'value'));
    this.chartConfig['chartType'] = this.type;
    this.chartConfig.filters.map(data => {
      delete data?.options
    })
    this.lib.instance.update({data:this.updatedData,type:this.type,config:this.chartConfig})
  }

  filterChanged(data: any): void {
    this.currentFilters = data.filters;
    if (data.filters) {
      this.globalChange ? this.globalData['selectedFilters'] = data.filters : this.chartData['selectedFilters'] = data.filters;
    } else {
      this.globalChange ? this.globalData['selectedFilters'] = {} : this.chartData['selectedFilters'] = {};
      this.resetFilters = { data:(this.globalChange? this.globalData: this.chartData), reset: true };
    }
    this.updatedData = data.chartData[0].data;
    this.lib.instance.update({data:this.updatedData});

  }

  resetForm() {
    this.chartData['selectedFilters'] = {};
    if(this.globalChange){this.globalData['selectedFilters'] = {};}
    this.currentFilters = [];
    this.updatedData = this.globalChange ? this.globalData: this.chartData
    this.resetFilters = { data:(this.globalChange ? this.globalData: this.chartData), reset: true };
    this.lib.instance.update({data:this.updatedData});
  }

  filterModalPopup(operator) {
    if (operator == false) {
      this.closeDialog();
    }  else {
      if (this.currentFilters) {
        this.globalChange ? this.globalData['selectedFilters'] = this.currentFilters : this.chartData['selectedFilters'] = this.currentFilters;
        this.resetFilters = { data:(this.globalChange ? this.globalData: this.chartData), reset: true };
      } else {
        this.globalChange ? this.globalData['selectedFilters'] = {} : this.chartData['selectedFilters'] = {};
      }
      this.openDialog();
    }

  }


  openDialog() {
    if (this.filterPopUpMat) {
      this.dialogRef = this.dialog.open(this.filterPopUpMat);
    }
  }
  
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
