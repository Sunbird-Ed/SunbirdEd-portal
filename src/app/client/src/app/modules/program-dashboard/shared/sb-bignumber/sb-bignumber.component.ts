import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService } from '@sunbird/shared';
import * as _ from "lodash-es";
import { PdServiceService } from '../services/pd-service/pd-service.service';
@Component({
  selector: 'app-sb-bignumber',
  templateUrl: './sb-bignumber.component.html',
  styleUrls: ['./sb-bignumber.component.scss']
})
export class SbBignumberComponent implements OnInit, OnChanges {
  @Input() chart;
  @Input() lastUpdatedOn;
  @Input() hideElements = false;
  @Input() appliedFilters;
  chartData;
  chartConfig;
  updatedData;
  globalChange:boolean;
  globalData;
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) contentRef: TemplateRef<any>;
  constructor(
    public resourceService: ResourceService,
    public dialog: MatDialog,
    public filterService:PdServiceService
  ) { }

  ngOnInit(){
    this.updatedData = this.chartData = _.compact(this.chart.chartData);
    this.chartConfig = this.chart.chartConfig;
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