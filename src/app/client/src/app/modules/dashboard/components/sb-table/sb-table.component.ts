import { Component, Input, AfterViewInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { ResourceService } from '@sunbird/shared';


@Component({
  selector: 'app-sb-table',
  templateUrl: './sb-table.component.html',
  styleUrls: ['./sb-table.component.scss']
})
export class SbTableComponent implements AfterViewInit  {
  @Input() rowsData: Array<Object>;
  @Input() columnConfig:any;
  @Input() filters:any;
  @Input() gridConfig:Object;
  load:boolean=false;
  data = {};
  config :any;

  constructor(private cdRef : ChangeDetectorRef, private resourceService: ResourceService) { }
  @ViewChild('lib', { static: false }) lib: any;

  loadTable(){
    this.config = {
      ...this.gridConfig,
      filters: this.filters,
      columnConfig:this.columnConfig,
    }


    this.data = {
      values:this.rowsData
    }
    this.load =true;
    this.cdRef.detectChanges();
  }
  ngAfterViewInit() {
    this.loadTable();
  }

  exportToCsv(){
    this.lib.instance.exportAs('csv');
  }
  reset(){
    this.load=false;
    this.lib.instance.resetFilters();
    this.loadTable()
    this.cdRef.detectChanges();
  }
}
