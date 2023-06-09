import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService } from '@sunbird/shared';
import * as _ from "lodash-es";
import { PdServiceService } from '../services/pd-service/pd-service.service';
import dayjs from 'dayjs';
@Component({
  selector: 'app-sb-bignumber',
  templateUrl: './sb-bignumber.component.html',
  styleUrls: ['./sb-bignumber.component.scss']
})
export class SbBignumberComponent implements OnInit, OnChanges {
  @Input() chart;
  lastUpdatedOn;
  @Input() hideElements = false;
  @Input() appliedFilters;
  chartData;
  chartConfig;
  updatedData;
  globalChange:boolean;
  globalData;
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) contentRef: TemplateRef<any>;
  showLastUpdatedOn: boolean = false;
  constructor(
    public resourceService: ResourceService,
    public dialog: MatDialog,
    public filterService:PdServiceService
  ) { }

  ngOnInit(){
    this.updatedData = this.chartData = _.compact(this.chart.chartData);
    this.chartConfig = this.chart.chartConfig;
    if(_.get(this.chart,'lastUpdatedOn')){
      this.lastUpdatedOn = dayjs(this.chart.lastUpdatedOn).format('DD-MMMM-YYYY');
      if (_.get(this.chartConfig, 'options.showLastUpdatedOn') || this.lastUpdatedOn) {
        this.showLastUpdatedOn = true;
      }
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {
   this.checkForChanges();
  }

  checkForChanges(){
    if(Object.keys(this.appliedFilters).length){
      this.globalData = this.filterService.getFilteredData(this.chartData,this.appliedFilters)
      this.globalChange = true;
      this.updatedData = this.globalData;
      this.outletRef.clear();
      this.outletRef.createEmbeddedView(this.contentRef);
    }else{
      this.globalData = this.chartData;
      this.globalChange = false;

    }
  }
}